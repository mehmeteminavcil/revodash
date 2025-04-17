// app/api/telegram/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bot } from "@/lib/telegramBot";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📦 Telegram'dan gelen VERİ:", JSON.stringify(body, null, 2));

    // message veya callback_query içinden kullanıcı bilgilerini al
    const from =
      body?.message?.from ??
      body?.edited_message?.from ?? // ✅ bunu ekle
      body?.callback_query?.from ??
      body?.inline_query?.from ??
      body?.my_chat_member?.from ??
      body?.chat_join_request?.from;

    if (!from) {
      return NextResponse.json(
        { error: "Invalid Telegram payload" },
        { status: 400 }
      );
    }

    // Kullanıcı bilgileri
    const telegramId = from.id.toString();
    const username = from.username;
    const firstName = from.first_name;
    const lastName = from.last_name;
    const languageCode = from.language_code;
    const isPremium = !!from.is_premium;

    // Kullanıcının referans kodu ile gelip gelmediğini kontrol et
    const refCode = body?.message?.text?.split(" ")[1];

    const existingUser = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          telegramId,
          username,
          firstName,
          lastName,
          languageCode,
          isPremium,
          joinedAt: new Date(),
          referralCode: crypto.randomUUID(),
          referrerId: refCode ? refCode : undefined,
        },
      });

      console.log(`✅ Yeni kullanıcı eklendi: ${username || firstName}`);

      // 🎁 Referans kodu geldiyse referansı güncelle
      if (refCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: refCode },
        });

        if (referrer) {
          const newCount = referrer.referredCount + 1;

          // ✅ Her 10 kişide bir ödül ver
          if (newCount % 10 === 0) {
            await prisma.reward.create({
              data: {
                userId: referrer.telegramId,
                amount: 200,
                note: "10 kişi davet ödülü 🎉",
              },
            });
          }

          await prisma.user.update({
            where: { telegramId: referrer.telegramId },
            data: { referredCount: newCount },
          });

          console.log(`🎉 ${referrer.username} → toplam davet: ${newCount}`);
        }
      }
    } else {
      // Kullanıcının referralCode'u yoksa oluştur
      if (!existingUser.referralCode) {
        await prisma.user.update({
          where: { telegramId },
          data: { referralCode: crypto.randomUUID() },
        });
        console.log("🎯 Kullanıcıya referralCode eklendi.");
      }
    }

    // ✅ Bot'u initialize etmeden handleUpdate çağrılmaz
    await bot.init();
    await bot.handleUpdate(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HATA:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
