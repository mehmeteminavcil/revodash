"use client";

import StatCard from "@/components/StatCard";
import { Users, Share2, Gift, CalendarCheck } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Kullanıcı"
          value="1248"
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Toplam Referans"
          value="893"
          icon={<Share2 className="w-6 h-6" />}
        />
        <StatCard
          title="Ödül Kazananlar"
          value="57"
          icon={<Gift className="w-6 h-6" />}
        />
        <StatCard
          title="Bugün Katılan"
          value="32"
          icon={<CalendarCheck className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}
