// app/api/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Tip tanımı: extraMessage ve row alanlarını da ekledik
type ButtonInput = {
  text: string;
  action: string;
  url?: string;
  extraMessage?: string;
  row?: number;
};

// ✅ GET: Start mesajı + butonları getir
export async function GET() {
  const start = await prisma.startMessage.findUnique({
    where: { id: 1 },
    include: { buttons: true },
  });

  if (!start) {
    return NextResponse.json({ message: "", buttons: [] });
  }

  return NextResponse.json({
    message: start.message,
    buttons: start.buttons.map((btn) => ({
      id: btn.id,
      text: btn.text,
      action: btn.action,
      url: btn.url,
      extraMessage: btn.extraMessage,
      row: btn.row ?? 0,
    })),
  });
}

// ✅ POST: Start mesajı ve butonları kaydet
export async function POST(req: NextRequest) {
  const { message, buttons } = await req.json();

  // Start mesajı oluştur/güncelle
  await prisma.startMessage.upsert({
    where: { id: 1 },
    update: { message },
    create: { id: 1, message },
  });

  // Eski butonları sil
  await prisma.button.deleteMany({ where: { startId: 1 } });

  // Yeni butonları ekle
  if (Array.isArray(buttons) && buttons.length > 0) {
    await prisma.button.createMany({
      data: (buttons as ButtonInput[]).map((btn) => ({
        text: btn.text,
        action: btn.action,
        url: btn.url || null,
        extraMessage: btn.extraMessage || null,
        row: btn.row ?? 0,
        startId: 1,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
