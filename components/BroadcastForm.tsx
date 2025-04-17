"use client";

import { useState } from "react";

export default function BroadcastForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      alert("Lütfen bir mesaj yaz.");
      return;
    }

    alert(
      `📢 DUYURU GÖNDERİLDİ:\n\n${title}\n${message}\n[${buttonText}](${buttonUrl})`
    );
    // TODO: Telegram API'ye bağlayacağız sonra
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl space-y-4">
      <h3 className="text-xl font-bold text-black">📢 Duyuru Gönder</h3>

      <input
        type="text"
        placeholder="Başlık (isteğe bağlı)"
        className="w-full border px-3 py-2 rounded-md text-black"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Mesaj içeriği"
        className="w-full h-32 border px-3 py-2 rounded-md text-black"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Buton yazısı"
          className="border px-3 py-2 rounded-md text-black"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
        />
        <input
          type="url"
          placeholder="Buton linki"
          className="border px-3 py-2 rounded-md text-black"
          value={buttonUrl}
          onChange={(e) => setButtonUrl(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={handleSend}
      >
        Gönder
      </button>
    </div>
  );
}
