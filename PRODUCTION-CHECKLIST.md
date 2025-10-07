# 🚀 Production Checklist - Vercel Deploy

## ✅ 1. Environment Variables (Vercel Dashboard)

### Zorunlu Variables:
```env
DATABASE_URL=postgresql://neondb_owner:npg_xlFgT0IZC4kV@ep-falling-bush-ag329800-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

SESSION_SECRET=production-super-secret-key-change-this-12345678

NODE_ENV=production

NEXTAUTH_URL=https://your-app-name.vercel.app

NEXTAUTH_SECRET=another-random-secret-key-for-nextauth
```

### Opsiyonel (AI için):
```env
OPENAI_API_KEY=sk-...  # Eğer gerçek AI kullanacaksanız
```

---

## ✅ 2. Build Ayarları Kontrolü

Vercel Dashboard → Settings → Build & Development Settings:

- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build` (vercel.json'da tanımlı)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## ✅ 3. Deploy Sonrası Testler

Site açıldığında test edin:

### Login Testi:
```
URL: https://your-app.vercel.app/login
Email: admin@oto.com
Password: 123456
```

### Kontroller:
- [ ] ✅ Login çalışıyor mu?
- [ ] ✅ Dashboard yükleniyor mu?
- [ ] ✅ Müşteriler sayfası açılıyor mu?
- [ ] ✅ Servisler sayfası açılıyor mu?
- [ ] ✅ Kasa sayfası açılıyor mu?
- [ ] ✅ Yeni servis oluşturma çalışıyor mu?
- [ ] ✅ Veriler veritabanından geliyor mu?

---

## ✅ 4. Güvenlik Ayarları

### A. SESSION_SECRET Değiştir
Production'da güçlü bir secret key kullan:

```bash
# Random secret oluştur:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıktıyı `SESSION_SECRET` olarak Vercel'e ekle.

### B. CORS ve Security Headers
`middleware.ts` dosyasında zaten var ✅

---

## ✅ 5. Database Seed (İlk Deploy)

Eğer Neon database boşsa, seed yapın:

### Option A: Vercel Functions üzerinden
Vercel Dashboard → Project → More → Run Command:
```bash
npm run db:seed
```

### Option B: Local'den
```bash
# .env'deki DATABASE_URL production URL olmalı
npm run db:seed
```

---

## ✅ 6. Performance Optimizasyonları

### Zaten Yapılmış Olanlar:
- ✅ Next.js 15 App Router (otomatik optimizasyon)
- ✅ Server Components kullanımı
- ✅ Image optimization
- ✅ Code splitting

### Yapılabilecekler:
- [ ] Redis caching (ileride)
- [ ] CDN kullanımı (Vercel otomatik)
- [ ] Database indexleme (zaten var)

---

## ✅ 7. Monitoring & Analytics

### Vercel Analytics Aktifleştir:
1. Vercel Dashboard → Analytics → Enable
2. Ücretsiz plan yeterli

### Speed Insights:
1. Vercel Dashboard → Speed Insights → Enable
2. Performance metrikleri göreceksiniz

---

## ✅ 8. Custom Domain (Opsiyonel)

Eğer kendi domain'iniz varsa:

1. Vercel Dashboard → Settings → Domains
2. Domain ekleyin: `otobeyaz.com`
3. DNS ayarlarını yapın:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## ✅ 9. Hata Ayıklama

### Deploy Logs Kontrol:
Vercel Dashboard → Deployments → Latest → View Function Logs

### Runtime Logs:
Vercel Dashboard → Logs

### Sık Karşılaşılan Hatalar:

**1. Database Connection Error:**
```
Çözüm: DATABASE_URL'in doğru olduğundan emin olun
```

**2. Module Not Found:**
```
Çözüm: package.json'da tüm dependencies var mı kontrol edin
```

**3. Build Failed:**
```
Çözüm: Local'de "npm run build" çalıştırıp test edin
```

---

## ✅ 10. Güncellemeler

Her kod değişikliğinde:
```bash
git add .
git commit -m "Update: açıklama"
git push
```

Vercel otomatik deploy eder! 🚀

---

## 📊 Demo Data

Sistemde hazır veriler:
- ✅ 5 Personel (admin@oto.com / 123456)
- ✅ 100 Müşteri
- ✅ 120 Servis
- ✅ 50 Stok
- ✅ 60 Kasa işlemi

---

## 🎯 Production URL

Deploy sonrası URL'iniz:
```
https://servispro-ai-xxxx.vercel.app
```

veya custom domain:
```
https://otobeyaz.com
```

---

## 🆘 Sorun mu var?

1. **Vercel Logs'u kontrol edin**
2. **Local'de test edin:** `npm run build && npm start`
3. **Environment variables'ı kontrol edin**
4. **Database bağlantısını test edin**

---

✅ **HAZIR!** Sistem production'da çalışıyor olmalı.

🎉 **İlk login:** https://your-app.vercel.app/login

