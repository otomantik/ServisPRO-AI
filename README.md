# ServisPro AI v2.0

🚀 **Profesyonel Servis Yönetim Sistemi** - AI destekli, modern, tam işlevsel platform

## ✨ Özellikler

### ✅ Ana Modüller

- **🎯 Dashboard**: Gerçek zamanlı istatistikler, grafikler ve hızlı işlemler
- **👥 Müşteri Yönetimi**: 150+ müşteri, tam CRUD operasyonları
- **🔧 Servis Yönetimi**: 800+ servis kaydı, durum takibi, fatura entegrasyonu
- **📦 Stok Yönetimi**: 18 parça, stok hareketi, kritik seviye uyarıları
- **💰 Kasa Yönetimi**: Gelir/gider takibi, finansal raporlar
- **📄 Fatura ve Alacaklar**: 200+ fatura, tahsilat yönetimi
- **👨‍💼 Personel Yönetimi**: Çalışan bilgileri, yetkilendirme
- **📊 Analytics**: AI destekli raporlar ve öngörüler
- **⚙️ Kategori Yönetimi**: Sistem genelinde kategori tanımları

### 🤖 AI Özellikleri

#### Finans Analizi
- 💹 Nakit akışı içgörüleri ve uyarıları
- 📈 3 aylık gelir tahmini (güven skorlu)
- ⚠️ Anomali tespiti (beklenmeyen gelir/gider)
- 💡 Maliyet tasarrufu önerileri

#### Müşteri Analizi
- 🎯 RFM segmentasyonu (Recency, Frequency, Monetary)
- 📉 Churn risk skorlaması
- 🎁 Upsell/Cross-sell fırsatları
- 💰 CLV (Customer Lifetime Value) tahmini

#### Envanter Analizi
- 📦 Düşük stok uyarıları (aciliyet seviyeli)
- 🐌 Yavaş hareket eden stok tespiti
- 🤖 AI optimize sipariş planı
- 🔄 Tasfiye önerileri

## 📊 Veritabanı - 1 Yıllık Gerçekçi Veri

- ✅ **800 Servis Kaydı** (~günde 2-3 servis)
- ✅ **150 Müşteri** (Gerçekçi Türk isimleri)
- ✅ **18 Stok Kalemi** (Tüm beyaz eşya parçaları)
- ✅ **200 Fatura** (Tamamlanmış servisler)
- ✅ **144 Gider Kaydı** (12 aylık operasyonel giderler)
- ✅ **4 Teknisyen/Personel**

### 🏷️ Desteklenen Markalar

**Beyaz Eşya:** Beko, Arçelik, Vestel, Profilo, Bosch, Siemens, Samsung, LG, Whirlpool, Grundig, Altus, Regal

**Kombi/Isıtma:** Airfel, Baymak, Vaillant, Demirdöküm, Ariston, Eca

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons, Custom Components
- **Forms**: React Hook Form + Zod validation
- **Database**: Prisma ORM + SQLite
- **AI**: OpenAI/Gemini entegrasyonu hazır
- **State**: React hooks

## 📦 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Veritabanını Hazırla

```bash
# Prisma schema'yı veritabanına uygula
npm run db:push

# 1 yıllık gerçekçi veriyi yükle (800+ servis, 150 müşteri)
npm run db:seed-full
```

### 3. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Uygulama **http://localhost:5000** adresinde çalışacaktır.

## 🔑 Demo Hesapları

Seed işleminden sonra aşağıdaki hesaplarla giriş yapabilirsiniz:

- **Yönetici**: admin@servispro.com / admin123
- **Teknisyen**: ahmet@servispro.com / tech123

## 📁 Proje Yapısı

```
├── app/
│   ├── (auth)/                    # Auth sayfaları (login)
│   ├── (dashboard)/              # Dashboard layout ve sayfaları
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # 🎯 Ana dashboard (grafikli)
│   │   │   ├── customers/       # 👥 Müşteri modülü
│   │   │   ├── services/        # 🔧 Servis modülü
│   │   │   ├── stock/           # 📦 Stok modülü
│   │   │   ├── kasa/            # 💰 Kasa modülü
│   │   │   ├── alacaklar/       # 📄 Alacaklar/Faturalar
│   │   │   ├── maintenance/     # 🔄 Periyodik bakım
│   │   │   ├── staff/           # 👨‍💼 Personel
│   │   │   ├── analytics/       # 📊 AI Analytics
│   │   │   └── categories/      # ⚙️ Kategoriler
│   ├── api/                      # API routes
│   │   ├── dashboard/           # Dashboard istatistikleri
│   │   ├── customers/           # CRUD endpoints
│   │   ├── services/
│   │   ├── alacaklar/
│   │   └── kasa/
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # UI component library
│   ├── layout/                  # Sidebar, Header
│   └── dashboard/               # Dashboard components
├── hooks/
│   └── useAI.ts                 # AI integration hook
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── routes.ts                # Route registry
│   ├── utils.ts                 # Utility functions
│   └── ai.ts                    # AI service helpers
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed-full-year.ts        # 1 yıllık veri seed scripti
│   └── dev.db                   # SQLite database
└── public/                      # Static assets
```

## 🎯 Önemli Rotalar

- `/dashboard` - Ana kontrol paneli (grafikler, istatistikler)
- `/dashboard/services` - Servis listesi (800+ kayıt)
- `/dashboard/customers` - Müşteri listesi (150+ kayıt)
- `/dashboard/kasa` - Kasa hareketleri
- `/dashboard/alacaklar` - Fatura ve alacaklar
- `/dashboard/analytics` - AI Analytics
- `/ar` - Alacaklar özet sayfası

## 🔧 Scriptsler

```bash
npm run dev              # Dev server (port 5000)
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint

# Database
npm run db:push          # Prisma schema -> DB
npm run db:seed-full     # 1 yıllık gerçekçi veri (800+ servis)
npm run db:studio        # Prisma Studio GUI
```

## 🌟 Dashboard Özellikleri

### 📊 Üst İstatistik Kartları
- **Servisler**: Toplam, bekleyen, devam eden, tamamlanan
- **Müşteriler**: Toplam ve yeni müşteri sayısı
- **Stok**: Kritik seviye uyarıları
- **Net Kâr**: Yıllık kar/zarar

### 💰 Finansal Durum
- Bu ay gelir/gider karşılaştırması
- Geçen aya göre % değişim
- Progress bar görselleştirmesi
- Yıllık toplam özeti

### 🏆 Popüler Markalar
- En çok servis verilen 5 marka
- Görsel sıralama (🥇🥈🥉)
- Yüzdelik dilim gösterimi

### 🚀 Hızlı İşlemler
- Yeni Servis, Müşteri, Stok, Kasa Hareketi
- Tek tıkla form sayfalarına erişim

### 📋 Son Servisler
- Son 5 servis kaydı detayı
- Durum ikonları ve renkler
- Tıklanabilir kartlar

## 🎨 UI/UX Özellikleri

- ✨ **Modern Tasarım**: Gradient'ler, yumuşak gölgeler, smooth animasyonlar
- 📱 **Responsive**: Mobile-first, her ekran boyutuna uyumlu
- 🎨 **Renkli İstatistikler**: Her modül için özel renk teması
- 🔵 **Hover Efektleri**: İnteraktif kullanıcı deneyimi
- ⚡ **Hızlı Yükleme**: Optimize edilmiş API sorguları
- 🎯 **Tıklanabilir Kartlar**: Direkt sayfa geçişleri
- 📊 **Progress Bar'lar**: Görsel veri sunumu
- 🚀 **Loading States**: Her async işlemde feedback

## 🔐 Güvenlik

- ✅ Tüm password'ler bcrypt ile hashlenmiş
- ✅ SQL injection koruması (Prisma)
- ✅ Input validation (Zod)
- 🔜 API route middleware (TODO)
- 🔜 Rate limiting (TODO)

## 🚀 Production Deploy

### Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_OPENAI_KEY=... (opsiyonel)
```

## 💡 İpuçları

1. **Veritabanını Yenile**: `npm run db:seed-full` ile istediğiniz zaman yeni veri oluşturabilirsiniz
2. **Hızlı Test**: Ana sayfadaki kartlara tıklayarak ilgili sayfalara direkt gidebilirsiniz
3. **Grafikler**: Dashboard'da finansal trendleri ve popüler markaları görsel olarak takip edebilirsiniz

## 📞 Destek

Herhangi bir sorun için issue açın veya iletişime geçin.

## 📄 Lisans

MIT

---

**ServisPro AI** - Akıllı servis yönetimi ile işlerinizi kolaylaştırın 🚀
