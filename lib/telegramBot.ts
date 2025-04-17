// lib/telegramBot.ts

import { Bot } from "grammy";
import type { InlineKeyboardMarkup } from "typegram"; // ✅ doğru import
import { prisma } from "@/lib/prisma";

type InlineKeyboardButton =
  InlineKeyboardMarkup["inline_keyboard"][number][number];

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// ✅ /start komutu → kullanıcıya mesaj + butonlar gösterilir
bot.command("start", async (ctx) => {
  const user = ctx.from;
  if (!user) return ctx.reply("Kullanıcı bilgisi alınamadı.");

  const telegramId = user.id.toString();
  const firstname = user.first_name;
  const username = user.username || "";

  // Kullanıcı kayıtlı değilse veritabanına ekle (önlem)
  await prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: {
      telegramId,
      username,
      firstName: firstname,
      isPremium: !!user.is_premium,
      referralCode: crypto.randomUUID(),
      joinedAt: new Date(),
    },
  });

  const start = await prisma.startMessage.findUnique({
    where: { id: 1 },
    include: { buttons: true },
  });

  if (!start) return ctx.reply("Hoş geldin!");

  const message = start.message
    .replace(/%firstname%/g, firstname)
    .replace(/%username%/g, username);

  // Inline butonları sıraya göre gruplandır
  const rows: { [key: number]: InlineKeyboardButton[] } = {};
  for (const btn of start.buttons) {
    const row = btn.row ?? 0;
    const button = btn.url
      ? { text: btn.text, url: btn.url }
      : { text: btn.text, callback_data: `action:${btn.action}:${btn.id}` };
    if (!rows[row]) rows[row] = [];
    rows[row].push(button);
  }

  const inlineKeyboard = Object.values(rows);

  // Start mesajı
  await ctx.reply(message, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });

  // Sabit menü
  await ctx.reply("🔽 Aşağıdaki menüyü kullanabilirsin:", {
    reply_markup: {
      keyboard: [[{ text: "📨 Mesaj Gönder" }]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

// ✅ Callback butona basıldığında çalışır
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const [prefix, action, id] = data.split(":");

  if (prefix !== "action") return;

  const telegramId = ctx.from?.id.toString();
  if (!telegramId) {
    return ctx.answerCallbackQuery({ text: "Kullanıcı bulunamadı." });
  }

  if (action === "check_group") {
    try {
      const groupId = process.env.TELEGRAM_GROUP_ID!;
      const member = await ctx.api.getChatMember(groupId, ctx.from.id);
      const isMember = ["member", "administrator", "creator"].includes(
        member.status
      );

      if (isMember) {
        const user = await prisma.user.findUnique({ where: { telegramId } });
        if (!user)
          return ctx.reply("Kullanıcı bilgilerin veritabanında bulunamadı.");

        const refLink = `https://t.me/${ctx.me.username}?start=${user.referralCode}`;
        await ctx.reply(`🎉 Gruba başarıyla katıldın!

🎗 Davet Edilen Üye Sayısı: ${user.referredCount}
🔗 Referans Linkin: ${refLink}`);
      } else {
        await ctx.reply(
          "❗ Gruba katıldığını göremedim. Lütfen önce katıl, sonra tekrar dene."
        );
      }
    } catch (error) {
      console.error("Grup kontrol hatası:", error);
      await ctx.reply("⛔ Grup kontrolü sırasında bir hata oluştu.");
    }
  }

  if (action === "show_message") {
    const button = await prisma.button.findUnique({
      where: { id: Number(id) },
    });

    if (button?.extraMessage) {
      await ctx.answerCallbackQuery();
      await ctx.reply(button.extraMessage);
    } else {
      await ctx.answerCallbackQuery({ text: "Mesaj bulunamadı." });
    }
  }

  if (action === "send_message") {
    await prisma.user.update({
      where: { telegramId },
      data: { isWritingToAdmin: true },
    });
    await ctx.answerCallbackQuery();
    return ctx.reply(
      "✉️ Şimdi mesajınızı yazabilirsiniz. Mesajınızı doğrudan bu sohbete yazın, biz de admin'e iletelim."
    );
  }

  if (action === "none") {
    await ctx.answerCallbackQuery({ text: "🫥" });
  }
});

// ✅ Kullanıcıdan gelen metin mesajları (özel mesajlar)
bot.on("message:text", async (ctx) => {
  const telegramId = ctx.from?.id.toString();
  const text = ctx.message.text;
  const isPrivate = ctx.chat.type === "private";
  if (!telegramId || !isPrivate) return;

  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (text === "📨 Mesaj Gönder") {
    await prisma.user.update({
      where: { telegramId },
      data: { isWritingToAdmin: true },
    });

    return ctx.reply(
      "✉️ Şimdi mesajınızı yazabilirsiniz. Mesajınızı doğrudan bu sohbete yazın, biz de admin'e iletelim."
    );
  }

  if (user?.isWritingToAdmin) {
    await prisma.message.create({
      data: {
        userId: telegramId,
        content: text,
      },
    });

    await prisma.user.update({
      where: { telegramId },
      data: { isWritingToAdmin: false },
    });

    return ctx.reply("✅ Mesajınız admin'e iletildi.");
  }

  return ctx.reply(
    "ℹ️ Lütfen bot ile iletişime geçmek için alttaki '📨 Mesaj Gönder' butonunu kullan."
  );
});
