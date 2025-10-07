# 🚀 Vercel Deployment Guide

## Hızlı Deploy

### 1. Repository'yi GitHub'a Push Edin

```bash
git init
git add .
git commit -m "ServisPro AI v2.0 - Production Ready"
git branch -M main
git remote add origin [YOUR_GITHUB_REPO_URL]
git push -u origin main
```

### 2. Vercel'e Deploy

1. [vercel.com](https://vercel.com) adresine gidin
2. "Import Project" tıklayın
3. GitHub repository'nizi seçin
4. Otomatik tespit edilecek (Next.js)
5. "Deploy" butonuna tıklayın

### 3. Build Ayarları

Vercel otomatik olarak algılayacaktır:

- **Framework:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### 4. Environment Variables (Opsiyonel)

Vercel Dashboard > Settings > Environment Variables:

```
DATABASE_URL=file:./dev.db
```

AI için (opsiyonel):
```
NEXT_PUBLIC_OPENAI_KEY=sk-...
```

## 📊 Post-Deploy

### Veritabanı Seed

Vercel'de deployment sonrası, veritabanını doldurmak için:

```bash
# Local'de seed yaptıktan sonra database'i commitle
git add prisma/dev.db
git commit -m "Add seeded database"
git push
```

VEYA Vercel Dashboard'dan terminal açıp:

```bash
npm run db:seed-full
```

## ✅ Test Checklist

- [ ] Ana sayfa yükleniyor
- [ ] Login çalışıyor (gokhan.bozkurt@servispro.com / admin123)
- [ ] Dashboard istatistikleri gösteriliyor
- [ ] Servisler sayfası açılıyor (800 kayıt)
- [ ] Müşteriler sayfası açılıyor (150 kayıt)
- [ ] Stoklar sayfası açılıyor (18 kayıt)
- [ ] Kasa Detay sayfası açılıyor
- [ ] Alacaklar Detay sayfası açılıyor
- [ ] Yeni servis formu açılıyor
- [ ] Yeni müşteri formu açılıyor

## 🎯 Demo URL

Deployment sonrası URL:
```
https://servispro-ai-[YOUR-PROJECT].vercel.app
```

## 📱 Mobile Test

Chrome DevTools ile test edin:
- iPhone 12 Pro
- iPad Air
- Desktop (1920x1080)

## 🔒 Production Ayarları

### 1. Database

SQLite production için yeterli (demo amaçlı).
Gerçek production için:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

### 2. Authentication

Real-world için:
- NextAuth.js ekleyin
- JWT secrets ayarlayın
- Session management

### 3. Security

- [ ] Rate limiting
- [ ] CORS ayarları
- [ ] CSP headers
- [ ] Environment variables güvenli

## 📊 Performance

Vercel Analytics ile monitör edin:
- Core Web Vitals
- Response times
- Error rates

## 🐛 Troubleshooting

### Build Hatası

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Hatası

```bash
# Reset database
npm run db:push
npm run db:seed-full
```

### Module Not Found

```bash
# Ensure all deps installed
npm install
```

## 📞 Support

Demo için sorular:
- Email: support@servispro.com
- GitHub Issues: [repo]/issues

---

**ServisPro AI** - Production Ready 🚀

