import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await prisma.user.findMany();
    return NextResponse.json(user);
  } catch (err) {
    console.error("🔥 HATA:", err);
    return new NextResponse("HATA", { status: 500 });
  }
}
