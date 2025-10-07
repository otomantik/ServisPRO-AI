# 🚀 HIZLI BAŞLANGIÇ KILAVUZU

## 📋 Önce Yapılacaklar

### 1. Node.js Kurulu mu?
Terminal'de kontrol edin:
```bash
node --version
```
Eğer kurulu değilse: https://nodejs.org/ adresinden indirin (18.x veya üstü)

### 2. Veritabanı Seçin

#### Seçenek A: Neon.tech (PostgreSQL - ÖNERİLEN) ✅

**Neden Neon?**
- ✅ Tamamen ücretsiz
- ✅ Kurulum gerektirmez
- ✅ Bulut tabanlı
- ✅ 5 saniyede hazır

**Adımlar:**
1. https://neon.tech adresine gidin
2. "Sign Up" tıklayın → GitHub ile giriş yapın
3. "Create Project" butonuna tıklayın
4. Proje adı: `oto-beyaz`
5. Region: `Frankfurt` (yakın olsun)
6. **Connection string'i kopyalayın** (postgresql://... ile başlayan)

#### Seçenek B: MySQL (Local - XAMPP)

**Adımlar:**
1. XAMPP'i indirin: https://www.apachefriends.org/
2. XAMPP'i kurun ve çalıştırın
3. "MySQL" yanındaki "Start" butonuna tıklayın
4. "Admin" butonuna tıklayın (phpMyAdmin açılır)
5. "New" tıklayarak database oluşturun: `oto_beyaz`

---

## ⚡ HIZLI KURULUM (5 ADIM)

### 1️⃣ Bağımlılıkları Yükleyin
```bash
npm install
```
☕ Bu 2-3 dakika sürebilir

### 2️⃣ .env Dosyasını Düzenleyin

`.env` dosyasını açın ve veritabanı bağlantısını yapıştırın:

**PostgreSQL (Neon) kullanıyorsanız:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/oto_beyaz?sslmode=require"
```

**MySQL (XAMPP) kullanıyorsanız:**
```env
DATABASE_URL="mysql://root:@localhost:3306/oto_beyaz"
```

### 3️⃣ Veritabanı Tabloları Oluşturun
```bash
npm run db:push
```
✅ "Your database is now in sync with your schema" mesajını göreceksiniz

### 4️⃣ 350+ Sanal Veri Ekleyin
```bash
npm run db:seed
```
⏱️ Bu 30-60 saniye sürer
✅ "Seed tamamlandı!" mesajını göreceksiniz

### 5️⃣ Uygulamayı Başlatın
```bash
npm run dev
```
🎉 Tarayıcıda açın: http://localhost:3000

---

## 🎯 GİRİŞ BİLGİLERİ

### Demo Hesaplar:

**Patron (Tam Yetki):**
```
Email: admin@oto.com
Şifre: 123456
```

**Teknisyen:**
```
Email: ahmet@oto.com
Şifre: 123456
```

**Operatör:**
```
Email: melek@oto.com
Şifre: 123456
```

---

## 🐛 SORUN GİDERME

### Hata: "command not found: npm"
**Çözüm:** Node.js'i yükleyin: https://nodejs.org/

### Hata: "Can't reach database server"
**Çözüm:**
- PostgreSQL: Connection string'i doğru kopyaladınız mı?
- MySQL: XAMPP'de MySQL başlatıldı mı?

### Hata: "Port 3000 is already in use"
**Çözüm:**
```bash
# Farklı port kullanın:
PORT=3001 npm run dev
```

### Veritabanını Sıfırlamak İsterseniz:
```bash
npm run db:push
npm run db:seed
```

---

## 📊 SİSTEMDE OLUŞTURULAN VERİLER

✅ 5 Personel (Patron, 3 Teknisyen, 1 Operatör)
✅ 100 Müşteri (70 bireysel, 30 kurumsal)
✅ 120 Servis kaydı
✅ 50 Stok ürünü
✅ 80 Stok hareketi
✅ 60 Kasa işlemi
✅ 15 Periyodik bakım
✅ 45+ Cihaz kaydı

---

## 🎨 ÖZELLİKLER

✅ **Dashboard** - İstatistikler ve grafikler
✅ **Servisler** - Servis takip sistemi
✅ **Müşteriler** - Müşteri yönetimi
✅ **Personel** - Personel listesi
✅ **Stoklar** - Stok takibi, kritik stok uyarıları
✅ **Kasa** - Gelir/gider takibi
✅ **Periyodik Bakım** - Bakım planlaması

---

## 🚀 DEPLOYMENT (Canlıya Alma)

### Vercel ile (ÜCRETSİZ):

1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın
3. "Import Project" tıklayın
4. Bu klasörü seçin
5. Environment Variables ekleyin:
   - `DATABASE_URL`: Neon connection string
   - `NEXTAUTH_URL`: https://your-app.vercel.app
   - `NEXTAUTH_SECRET`: random-secret-key
6. "Deploy" tıklayın

🎉 2 dakikada canlıda!

---

## 📞 YARDIM

**Veritabanı görüntülemek için:**
```bash
npm run db:studio
```
Tarayıcıda açılacak → Tüm tabloları görebilirsiniz

**Logları görüntülemek için:**
Terminal'de çalışan uygulamayı izleyin

---

## ✅ KONTROL LİSTESİ

- [ ] Node.js kurdum
- [ ] npm install yaptım
- [ ] Veritabanı seçtim (Neon veya XAMPP)
- [ ] .env dosyasını düzenledim
- [ ] npm run db:push çalıştırdım
- [ ] npm run db:seed çalıştırdım
- [ ] npm run dev çalıştırdım
- [ ] http://localhost:3000 açtım
- [ ] admin@oto.com ile giriş yaptım

🎉 Hepsi tamamsa, sistem hazır!

