# 🔐 Environment Variables Kurulumu

## Manuel Kurulum Gerekli

`.env` dosyası `.gitignore`'da olduğu için otomatik oluşturulamadı.

### Adım 1: .env Dosyası Oluştur

Proje root dizininde `.env` dosyası oluştur:

```bash
# Komut ile:
echo. > .env

# Veya manuel olarak:
# Proje klasöründe sağ tık → Yeni → Text Document → .env olarak adlandır
```

### Adım 2: İçeriği Kopyala

Aşağıdaki içeriği `.env` dosyasına yapıştır:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
SESSION_SECRET="dev-secret-key-please-change-in-production"
NEXTAUTH_URL="http://localhost:5000"
NEXTAUTH_SECRET="dev-nextauth-secret-change-this"

# Environment
NODE_ENV="development"

# Logging
LOG_LEVEL="debug"
```

### Adım 3: Production için Değiştir

⚠️ **ÖNEMLİ:** Production'a deploy ederken değiştir:

```env
NODE_ENV="production"
SESSION_SECRET="<güçlü-random-key-buraya>"
NEXTAUTH_SECRET="<başka-güçlü-key-buraya>"
```

Güçlü key oluşturmak için:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Adım 4: Restart Gerekli

`.env` değişikliğinden sonra:
```bash
# Dev server'ı restart et
Ctrl+C
npm run dev
```

---

✅ **TAMAMLANDI!** Artık environment variables güvenli şekilde yönetiliyor.

