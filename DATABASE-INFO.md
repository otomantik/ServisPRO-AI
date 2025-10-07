# 🗄️ ServisPro AI - Veritabanı Bilgileri

## 📊 Mevcut Veri İstatistikleri

Veritabanı **1 yıllık gerçekçi işletme verisi** ile doldurulmuştur.

### 📈 Genel Durum

- ✅ **800 Servis Kaydı** (1 yıllık süre içinde ~günde 2-3 servis)
- ✅ **150 Müşteri** (Bireysel ve kurumsal)
- ✅ **18 Stok Kalemi** (Çeşitli yedek parçalar)
- ✅ **200 Fatura** (Tamamlanmış servisler için)
- ✅ **144 Gider Kaydı** (12 ay x 12 kategori)
- ✅ **4 Teknisyen/Personel**

### 💰 Finansal Durum

- **Toplam Gelir:** ₺261.732,63
- **Toplam Gider:** ₺514.771,78
- **Net Durum:** -₺253.039,15

> ⚠️ **Not:** Bu veriler örnek/test verileridir. Gerçek işletme verilerini yansıtmaz.

## 🏷️ Popüler Markalar (Servis Sayısına Göre)

1. 🥇 **Arçelik** - 59 servis
2. 🥈 **Whirlpool** - 57 servis
3. 🥉 **Regal** - 52 servis
4. **Samsung** - 52 servis
5. **Profilo** - 49 servis
6. **Beko** - 48 servis
7. **Airfel** - 46 servis
8. **Demirdöküm** - 45 servis
9. **Grundig** - 41 servis
10. **Bosch** - 41 servis

## 🔧 Cihaz Tipleri

- Çamaşır Makinası
- Bulaşık Makinası
- Buzdolabı
- Kurutma Makinası
- Fırın
- Aspiratör
- Televizyon
- Klima
- Kombi
- Şofben
- Termosifon

## 📦 Stok Kalemleri

Veritabanında aşağıdaki stok kalemleri bulunmaktadır:

- **Çamaşır Makinası Parçaları:** Elektrovana, Pompa Filtresi, Rulman, Rezistans, Amortisör, Elektronik Kart
- **Buzdolabı Parçaları:** Termostat, Kompresör, Kapı Contası, Soğutucu Gaz
- **Kombi Parçaları:** Eşanjör, Genleşme Deposu, NTC Sensör, Flometre
- **Klima Parçaları:** Fan Motoru, Klima Gazı
- **Fırın Parçaları:** Rezistans, Kapak Camı

## 🚀 Veritabanını Yeniden Doldurmak

Veritabanını sıfırdan yeniden doldurmak için:

```bash
npm run db:seed-full
```

Bu komut:
1. Mevcut tüm verileri temizler
2. 1 yıllık gerçekçi veri oluşturur
3. Servisler, müşteriler, stoklar, faturalar oluşturur
4. Gider kayıtları ekler (maaş, kira, elektrik, vb.)

## 📊 Servis Durumları

- **Tamamlandı:** %77.9 (623 servis)
- **Devam Ediyor:** %6.6 (53 servis)
- **Bekliyor:** %7.0 (56 servis)
- **İptal:** %8.5 (68 servis)

## 💳 Ödeme Durumları

- **Ödendi:** %80
- **Ödenmedi:** %20

## 📍 Bölge Dağılımı

Müşteriler İstanbul'un çeşitli ilçelerinde:
- Kadıköy, Beşiktaş, Şişli, Bakırköy, Üsküdar
- Maltepe, Ataşehir, Kartal, Pendik, Tuzla
- Ümraniye, Çekmeköy, Sancaktepe
- Başakşehir, Esenyurt, Avcılar, Beylikdüzü
- Fatih, Eyüpsultan, Sarıyer, Beykoz

## 🎯 Gelecek Geliştirmeler

- [ ] Daha fazla servis türü eklenecek
- [ ] Araç plaka ve marka bilgileri detaylandırılacak
- [ ] Müşteri geri bildirim sistemi eklenecek
- [ ] SMS/Email bildirimleri sistemi
- [ ] Detaylı raporlama ve analiz araçları

---

**Son Güncelleme:** Ekim 2025

