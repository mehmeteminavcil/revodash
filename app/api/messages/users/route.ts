// app/api/messages/users/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Her kullanıcıdan yalnızca en son mesajı getir
    const latestMessages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      distinct: ["userId"], // her kullanıcıdan 1 mesaj
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

    return NextResponse.json(latestMessages);
  } catch (error) {
    console.error("❌ Kullanıcı mesajları alınamadı:", error);
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 });
  }
}
