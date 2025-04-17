"use client";

interface Reward {
  id: number;
  telegramId: string;
  username?: string;
  amount: number;
  givenAt: string;
  note?: string;
}

const mockRewards: Reward[] = [
  {
    id: 1,
    telegramId: "123456789",
    username: "jordi",
    amount: 200,
    givenAt: "2025-04-12 14:32",
    note: "10 referans sonrası verildi",
  },
  {
    id: 2,
    telegramId: "987654321",
    username: "ayse123",
    amount: 500,
    givenAt: "2025-04-13 11:15",
    note: "Çekiliş ödülü",
  },
];

export default function RewardList() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-black mb-4">🎁 Verilen Ödüller</h3>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 text-black font-semibold">
              Telegram ID
            </th>
            <th className="text-left py-2 text-black font-semibold">
              Kullanıcı Adı
            </th>
            <th className="text-left py-2 text-black font-semibold">Tutar</th>
            <th className="text-left py-2 text-black font-semibold">Tarih</th>
            <th className="text-left py-2 text-black font-semibold">Not</th>
          </tr>
        </thead>
        <tbody>
          {mockRewards.map((reward) => (
            <tr key={reward.id} className="border-b even:bg-gray-50">
              <td className="py-2 text-black">{reward.telegramId}</td>
              <td className="py-2 text-black">@{reward.username ?? "—"}</td>
              <td className="py-2 text-black">{reward.amount} TL</td>
              <td className="py-2 text-black">{reward.givenAt}</td>
              <td className="py-2 text-black">{reward.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
