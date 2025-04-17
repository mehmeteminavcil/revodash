// ✅ Kullanıcılardan gelen mesajlar için admin panel bileşeni
// Şimdilik mock verilerle çalışıyoruz

"use client";

import { useState } from "react";

interface Message {
  id: number;
  from: string;
  content: string;
  date: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    from: "@jordi",
    content: "Merhaba, gruba katıldım ama referans linkim gözükmüyor.",
    date: "2025-04-12 14:30",
  },
  {
    id: 2,
    from: "@ayse123",
    content: "Kazandığım ödül ne zaman yatacak acaba?",
    date: "2025-04-12 13:50",
  },
];

export default function MessagePanel() {
  const [messages] = useState(mockMessages);
  const [reply, setReply] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-black">
        📩 Gelen Mesajlar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mesaj Listesi */}
        <div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelected(msg)}
              className="border p-3 rounded-md cursor-pointer hover:bg-gray-100 mb-2"
            >
              <p className="text-black font-medium">{msg.from}</p>
              <p className="text-gray-600 text-sm">
                {msg.content.slice(0, 60)}...
              </p>
              <p className="text-gray-400 text-xs mt-1">{msg.date}</p>
            </div>
          ))}
        </div>

        {/* Yanıt Paneli */}
        {selected && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-black font-semibold text-lg mb-1">
                Gönderen:
              </h3>
              <p className="text-black">{selected.from}</p>
              <h4 className="text-black font-semibold mt-4">Mesaj:</h4>
              <p className="text-gray-700">{selected.content}</p>
            </div>

            <textarea
              className="w-full h-32 p-3 border rounded-md text-black"
              placeholder="Bu kullanıcıya ne cevap yazmak istersin?"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <button
              className="self-start px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={() => {
                alert(`Yanıt gönderildi: ${reply}`);
                setReply("");
              }}
            >
              Yanıtla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
