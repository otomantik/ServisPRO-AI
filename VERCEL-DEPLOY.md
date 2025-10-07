# 🚀 Vercel Deployment Rehberi

## Ön Hazırlık ✅

Sisteminiz Vercel'e deploy için hazır! Tüm gerekli konfigürasyonlar tamamlandı.

### ✨ Yapılanlar:
- ✅ PostgreSQL (Neon) veritabanı entegrasyonu
- ✅ Prisma schema güncellemesi
- ✅ Build script'leri eklendi
- ✅ vercel.json ve .vercelignore oluşturuldu
- ✅ 1 aylık demo veri (150 servis, 50 müşteri)

## 📋 Deploy Adımları

### 1. GitHub'a Push
```bash
git init
git add .
git commit -m "Initial commit - PostgreSQL ready"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Vercel'de Proje Oluştur
1. https://vercel.com/new sayfasına git
2. GitHub repository'nizi seç
3. Import butonuna tıkla

### 3. Environment Variables Ekle
Vercel Dashboard'da şu environment variable'ı ekle:

**Key:** `DATABASE_URL`
**Value:** 
```
postgresql://neondb_owner:npg_xlFgT0IZC4kV@ep-falling-bush-ag329800-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 4. Deploy!
"Deploy" butonuna tıkla ve bekle! 🎉

## 🎬 Personel Bilgileri

### Giriş Bilgileri:
- **Sahip**: gokhan@otobeyaz.com / admin123
- **Sekreter**: pepee@otobeyaz.com / pepee123
- **Teknisyenler**: shiro@otobeyaz.com / tech123

## 📊 Demo Veriler
- 7 Personel (Gökhan + Pepee + 5 Teknisyen)
- 50 Müşteri
- 150 Servis (1 aylık)
- 50 Fatura
- Net Kâr: ₺85.752

## 🔧 Deploy Sonrası
Veritabanı zaten hazır ve dolu! Hiçbir şey yapmanıza gerek yok.

Deploy URL'iniz: `https://your-project.vercel.app`

## ⚡ Hızlı Komutlar

```bash
# Local test
npm run dev

# Build test (Vercel'in yapacağını test et)
npm run build

# Production başlat
npm start
```

## 🎨 Özellikler
- Dashboard & Analytics
- Müşteri Yönetimi
- Servis Takibi
- Fatura Sistemi
- Kasa Yönetimi
- Stok Takibi
- Periyodik Bakım
- Personel Yönetimi

## 🆘 Sorun Giderme

### Build hatası alırsanız:
1. Vercel'de DATABASE_URL'in doğru girildiğini kontrol edin
2. Build logs'u inceleyin
3. Local'de `npm run build` çalıştırıp test edin

### Database bağlantı hatası:
- Neon veritabanının aktif olduğundan emin olun
- Connection string'in doğru olduğunu kontrol edin
- SSL modunun `require` olduğundan emin olun

Başarılar! 🚀

