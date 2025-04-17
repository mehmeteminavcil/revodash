// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            telegramId: true,
            username: true,
            firstName: true,
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ Mesajları çekerken hata oluştu:", error);
    return NextResponse.json({ error: "Mesajlar alınamadı" }, { status: 500 });
  }
}
