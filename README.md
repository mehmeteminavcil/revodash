# 🧠 RevoDash – Telegram Bot Admin Paneli

RevoDash, özel bir Telegram botu için geliştirilmiş **modern ve gerçek zamanlı bir admin panelidir.**  
Panel üzerinden gelen mesajlar görüntülenir, admin cevap verebilir, kullanıcı detayları yönetilebilir.

---

## 🚀 Özellikler

### 🟢 Temel Fonksiyonlar

- Kullanıcıların bot üzerinden gönderdiği mesajları görme
- Admin’in yanıt göndermesi ve yanıtların kullanıcıya ulaşması
- Admin yanıtları otomatik veritabanına kayıt edilir

### 💬 Mesajlaşma Arayüzü

- WhatsApp/Messenger tarzı çift panel UI
- Sol panel: kullanıcı listesi ve unread bildirimleri
- Sağ panel: seçilen kullanıcıyla olan tüm konuşma geçmişi
- Son mesaj en altta, otomatik scroll
- Admin mesajları sağda, yeşil ve farklı stilde görünür

### 🔔 Bildirim Sistemi

- Okunmamış mesajlar için kırmızı rozet 🔴
- Mesaj seçilince otomatik olarak "okundu" sayılır
- (İleride eklenecek: socket/polling ile anlık güncelleme)

---

## 🧱 Teknolojiler

- **Next.js 15 (App Router)**
- **TypeScript + TailwindCSS**
- **Prisma ORM + PostgreSQL**
- **Telegram Bot API (grammY)**
- **Vercel uyumlu frontend**
- **Railway / Render uyumlu backend (DB/cron/socket)**

---

## 🔐 Ortam Değişkenleri

`.env` dosyasına aşağıdaki bilgileri eklemelisin:

```env
DATABASE_URL=postgresql://kullanici:sifre@host:5432/veritabani
BOT_TOKEN=telegram-bot-tokenin


npm run dev
```
