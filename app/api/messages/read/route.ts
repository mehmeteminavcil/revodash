import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("🟢 Okundu isteği geldi:", body);

  // Şimdilik sadece başarı yanıtı döndür.
  return NextResponse.json({ status: "ok", received: body });
}
