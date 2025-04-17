import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// 💡 Lucide ikonları
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Megaphone,
  Gift,
  Settings,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bonus Event Admin",
  description: "Admin panel for managing Bonus Event bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f8f9fa] text-[#111827]`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white text-black border-r border-gray-200 p-4">
            <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-600" />
              Bonus Event
            </h1>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/users"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Users className="w-4 h-4" />
                Kullanıcılar
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <MessageCircle className="w-4 h-4" />
                Mesajlar
              </Link>
              <Link
                href="/broadcast"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Megaphone className="w-4 h-4" />
                Duyuru Gönder
              </Link>
              <Link
                href="/rewards"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Gift className="w-4 h-4" />
                Ödül Takibi
              </Link>
              <Link
                href="/start"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Gift className="w-4 h-4" />
                Start Mesaji
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                <Settings className="w-4 h-4" />
                Ayarlar
              </Link>
            </nav>
          </aside>

          {/* Ana içerik */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
