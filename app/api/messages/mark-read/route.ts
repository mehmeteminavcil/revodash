// app/api/messages/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { telegramId } = await req.json();

    await prisma.message.updateMany({
      where: {
        userId: telegramId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Okundu bilgisi güncellenemedi:", error);
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}
