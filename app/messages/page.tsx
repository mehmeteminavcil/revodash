// app/messages/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  reply?: string;
  createdAt: string;
  user: {
    telegramId: string;
    username: string | null;
    firstName: string | null;
  };
}

export default function MessagePanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const users = Array.from(
    new Map(messages.map((m) => [m.user.telegramId, m.user])).values()
  );

  const unreadCounts = messages.reduce<Record<string, number>>((acc, m) => {
    if (!m.reply) {
      acc[m.user.telegramId] = (acc[m.user.telegramId] || 0) + 1;
    }
    return acc;
  }, {});

  const currentMessages = messages
    .filter((m) => m.user.telegramId === selectedUser)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: selectedUser }),
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [currentMessages]);

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  const sendReply = async () => {
    if (!selectedUser || !reply.trim()) return;

    const res = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: selectedUser, message: reply }),
    });

    if (res.ok) {
      toast.success("Yanıt gönderildi");
      setReply("");
      fetchMessages();
    } else {
      toast.error("Gönderilemedi");
    }
  };

  return (
    <div className="p-4 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span role="img" aria-label="mail">
          📩
        </span>{" "}
        Gelen Mesajlar
      </h2>
      <div className="flex gap-4 h-[calc(100vh-150px)]">
        {/* Kullanıcı Listesi */}
        <div className="w-60 bg-zinc-800 p-2 rounded-md overflow-y-auto">
          <h3 className="text-white mb-2 flex items-center gap-1">
            <span role="img" aria-label="users">
              📂
            </span>{" "}
            Kullanıcılar
          </h3>
          {users.map((user) => (
            <div
              key={user.telegramId}
              onClick={() => setSelectedUser(user.telegramId)}
              className={`p-2 rounded cursor-pointer flex justify-between items-center mb-1 transition-all duration-150 ${
                selectedUser === user.telegramId
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 text-white hover:bg-zinc-600"
              }`}
            >
              <span>
                {user.username
                  ? `@${user.username}`
                  : user.firstName || user.telegramId}
              </span>
              {unreadCounts[user.telegramId] && (
                <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCounts[user.telegramId]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mesaj Paneli */}
        <div className="flex-1 flex flex-col bg-zinc-900 rounded-md overflow-hidden">
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col"
            ref={scrollRef}
          >
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs px-3 py-2 text-sm shadow-sm rounded-2xl ${
                  msg.reply
                    ? "bg-green-600 text-white self-end"
                    : "bg-zinc-800 text-white self-start"
                }`}
              >
                <div>
                  {msg.reply
                    ? msg.reply
                    : `⚠️ Admin'den mesaj var: ${msg.content}`}
                </div>
                <div className="text-xs text-right text-zinc-400 mt-1">
                  {format(new Date(msg.createdAt), "HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Cevap Alanı */}
          <div className="border-t border-zinc-700 p-4 flex gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1 p-2 rounded-md bg-zinc-800 text-white border border-zinc-600 resize-none"
              placeholder="✍️ Cevabınızı yazın..."
            />
            <button
              onClick={sendReply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              🚀 Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
