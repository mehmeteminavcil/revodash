// app/api/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegramBot";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const telegramId = String(body.telegramId || "").trim();
    const message = String(body.message || "").trim();

    if (!telegramId || !message) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // Son kullanıcı mesajını bul
    const lastMessage = await prisma.message.findFirst({
      where: { userId: telegramId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastMessage) {
      return NextResponse.json(
        { error: "Kullanıcının mesajı bulunamadı." },
        { status: 404 }
      );
    }

    // 1️⃣ Kullanıcı mesajına reply yaz
    await prisma.message.update({
      where: { id: lastMessage.id },
      data: { reply: message },
    });

    // 2️⃣ Yeni admin mesajı olarak DB'ye ekle
    await prisma.message.create({
      data: {
        userId: telegramId,
        content: `🔔 Admin'den mesaj var:\n\n${message}`,
      },
    });

    // 3️⃣ Telegram'a gönder
    await bot.api.sendMessage(
      telegramId,
      `🔔 Admin'den mesaj var:\n\n${message}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Yanıt gönderilirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
