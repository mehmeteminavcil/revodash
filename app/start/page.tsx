// app/start/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "../../components/ui/Textarea";
import toast, { Toaster } from "react-hot-toast";

type Btn = {
  id?: number;
  text: string;
  action: string;
  url?: string;
  row?: number;
  extraMessage?: string;
};

export default function StartMessagePage() {
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState<Btn[]>([]);

  useEffect(() => {
    fetch("/api/start")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setButtons(data.buttons);
      });
  }, []);

  const updateButton = <K extends keyof Btn>(
    index: number,
    field: K,
    value: Btn[K]
  ) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "action") {
      if (
        (value === "check_group" || value === "show_message") &&
        updated[index].url
      ) {
        toast.error("Bu aksiyon tipi ile URL birlikte kullanılamaz!");
        updated[index].url = "";
      }
    }

    setButtons(updated);
  };

  const addButton = () => {
    setButtons([...buttons, { text: "", action: "", url: "", row: 0 }]);
  };

  const removeButton = (index: number) => {
    const updated = [...buttons];
    updated.splice(index, 1);
    setButtons(updated);
  };

  const handleSave = async () => {
    const res = await fetch("/api/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, buttons }),
    });

    if (res.ok) {
      toast.success("✅ Başarıyla kaydedildi.");
    } else {
      toast.error("⛔ Bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 space-y-6 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          🎬 Start Mesajı
        </h1>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="🎉 Hoş geldin %firstname%! Başlamak için aşağıdaki butonlara tıkla..."
          className="min-h-[100px]"
        />

        <div className="space-y-4">
          {buttons.map((btn, i) => {
            const disableURL =
              btn.action === "check_group" || btn.action === "show_message";

            return (
              <div
                key={i}
                className="flex flex-col gap-2 border border-zinc-700/50 rounded-lg p-3 bg-zinc-950/50"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    className="flex-1 min-w-[120px]"
                    placeholder="🔘 Buton metni"
                    value={btn.text}
                    onChange={(e) => updateButton(i, "text", e.target.value)}
                  />
                  <select
                    className="min-w-[140px] border rounded px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    value={btn.action}
                    onChange={(e) => updateButton(i, "action", e.target.value)}
                  >
                    <option value="">🎯 Aksiyon Seç</option>
                    <option value="check_group">👥 Grup Kontrolü</option>
                    <option value="show_message">📩 Mesaj Göster</option>
                    <option value="none">🚫 Hiçbir şey yapma</option>
                  </select>
                  <Input
                    className="w-16 text-center"
                    type="number"
                    placeholder="Satır"
                    value={btn.row?.toString() || "0"}
                    onChange={(e) =>
                      updateButton(i, "row", Number(e.target.value))
                    }
                  />
                  <Input
                    className="flex-1 min-w-[180px]"
                    placeholder="(Opsiyonel) 🌐 URL"
                    value={btn.url || ""}
                    onChange={(e) => updateButton(i, "url", e.target.value)}
                    disabled={disableURL}
                  />
                  <Button
                    onClick={() => removeButton(i)}
                    className="bg-red-600 text-white"
                  >
                    ❌ Sil
                  </Button>
                </div>

                {btn.action === "show_message" && (
                  <Textarea
                    className="mt-2"
                    placeholder="📩 Kullanıcıya gösterilecek özel mesaj"
                    value={btn.extraMessage || ""}
                    onChange={(e) =>
                      updateButton(i, "extraMessage", e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}

          <Button
            onClick={addButton}
            className="bg-zinc-700 text-white flex items-center gap-2"
          >
            ➕ Buton Ekle
          </Button>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 justify-center"
        >
          💾 Kaydet
        </Button>
      </div>
    </div>
  );
}
