// app/api/messages/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // en eski mesaj en başta
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ Kullanıcı mesajları alınamadı:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
