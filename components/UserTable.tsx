"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";

interface User {
  telegramId: string;
  username?: string | null;
  referredCount: number;
  joinedAt: Date;
  totalReward: number;
}

export default function UserTable({ serverUsers }: { serverUsers: User[] }) {
  const [users, setUsers] = useState(serverUsers);

  const toggleReward = (telegramId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.telegramId === telegramId
          ? {
              ...u,
              totalReward: u.totalReward > 0 ? 0 : 100,
            }
          : u
      )
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-black">
        👤 Kullanıcı Listesi
      </h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr className="border-b">
            <th className="text-left py-2 text-black font-semibold">
              Telegram ID
            </th>
            <th className="text-left py-2 text-black font-semibold">
              Kullanıcı Adı
            </th>
            <th className="text-left py-2 text-black font-semibold">
              Referans
            </th>
            <th className="text-left py-2 text-black font-semibold">
              Katılım Tarihi
            </th>
            <th className="text-left py-2 text-black font-semibold">Ödül</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.telegramId}
              className="border-b even:bg-gray-50 hover:bg-gray-100"
            >
              <td className="py-2 text-black">{user.telegramId}</td>

              <td className="py-2 text-black">
                <Link
                  href={`/users/${user.telegramId}`}
                  className="text-blue-600 hover:underline"
                >
                  @{user.username ?? "—"}
                </Link>
              </td>

              <td className="py-2 text-black">{user.referredCount}</td>
              <td className="py-2 text-black">
                {format(user.joinedAt, "yyyy-MM-dd")}
              </td>
              <td className="py-2">
                {user.totalReward > 0 ? (
                  <span className="text-green-600 font-medium">✅ Ödendi</span>
                ) : (
                  <button
                    onClick={() => toggleReward(user.telegramId)}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    İşaretle
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
