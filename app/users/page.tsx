// app/users/page.tsx
import { prisma } from "@/lib/prisma";
import UserTable from "@/components/UserTable";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { joinedAt: "desc" },
    select: {
      telegramId: true,
      username: true,
      referredCount: true,
      joinedAt: true,
      totalReward: true,
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 Kullanıcılar</h2>
      <UserTable serverUsers={users} />
    </div>
  );
}
