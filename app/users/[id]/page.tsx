// app/users/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function UserProfile(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const user = await prisma.user.findUnique({
    where: { telegramId: id },
    include: { rewards: true },
  });

  if (!user) return notFound();

  const totalReward = user.rewards.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-800">
      <h1 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        👤 Kullanıcı Profili
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Info label="Telegram Kullanıcı Adı" value={user.username ?? "Yok"} />
        <Info label="Telegram ID" value={user.telegramId} />
        <Info label="İsim" value={user.firstName ?? "-"} />
        <Info label="Soyisim" value={user.lastName ?? "-"} />
        <Info
          label="Premium mı?"
          value={user.isPremium ? "Evet ✅" : "Hayır"}
        />
        <Info label="Dil Kodu" value={user.languageCode ?? "-"} />
        <Info
          label="Katılma Tarihi"
          value={format(user.joinedAt, "dd/MM/yyyy")}
        />
        <Info
          label="Son Mesaj"
          value={
            user.lastMessageAt
              ? format(user.lastMessageAt, "dd/MM/yyyy")
              : "Yok"
          }
        />
        <Info
          label="Botu Engelledi mi?"
          value={user.blockedBot ? "Evet 🚫" : "Hayır"}
        />
        <Info label="Mesaj Sayısı" value={user.messageCount.toString()} />
        <Info label="Durum" value={user.status} />
        <Info label="Referans Kodu" value={user.referralCode} />
        <Info label="Kimden Geldi?" value={user.referrerId ?? "-"} />
        <Info label="Davet Sayısı" value={user.referredCount.toString()} />
        <Info label="Toplam Ödül" value={`${totalReward} ₺`} />
        <Info label="Etkinlik Sayısı" value={user.eventCount.toString()} />
        <Info
          label="Son Etkinlik Tarihi"
          value={
            user.lastEventDate ? format(user.lastEventDate, "dd/MM/yyyy") : "-"
          }
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col bg-zinc-800 p-4 rounded-md shadow-sm border border-zinc-700">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
