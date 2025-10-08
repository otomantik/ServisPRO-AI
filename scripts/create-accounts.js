const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAccounts() {
  try {
    console.log('Hesap planı oluşturuluyor...');

    const accounts = [
      // Aktif Hesaplar
      { code: '1001', name: 'Kasa', type: 'ASSET', isCashLike: true },
      { code: '1020', name: 'Banka', type: 'ASSET', isCashLike: true },
      { code: '1200', name: 'Alacaklar', type: 'ASSET', isCashLike: false },
      { code: '1500', name: 'Stoklar', type: 'ASSET', isCashLike: false },
      { code: '1800', name: 'Demirbaşlar', type: 'ASSET', isCashLike: false },
      
      // Pasif Hesaplar
      { code: '2000', name: 'Borçlar', type: 'LIABILITY', isCashLike: false },
      { code: '2500', name: 'Ödenecek Vergiler', type: 'LIABILITY', isCashLike: false },
      
      // Öz Kaynaklar
      { code: '3000', name: 'Öz Sermaye', type: 'EQUITY', isCashLike: false },
      
      // Gelir Hesapları
      { code: '4000', name: 'Servis Gelirleri', type: 'REVENUE', isCashLike: false },
      { code: '4100', name: 'Satış Gelirleri', type: 'REVENUE', isCashLike: false },
      
      // Gider Hesapları
      { code: '6000', name: 'Genel Giderler', type: 'EXPENSE', isCashLike: false },
      { code: '6100', name: 'Maaş Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6200', name: 'Yakıt Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6300', name: 'Kira Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6400', name: 'Malzeme Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6500', name: 'Elektrik Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6600', name: 'Su Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6700', name: 'İletişim Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6800', name: 'Vergi Giderleri', type: 'EXPENSE', isCashLike: false },
      { code: '6900', name: 'Diğer Giderler', type: 'EXPENSE', isCashLike: false },
    ];

    for (const accountData of accounts) {
      // Önce hesabın var olup olmadığını kontrol et
      const existingAccount = await prisma.account.findUnique({
        where: { code: accountData.code }
      });

      if (existingAccount) {
        console.log(`✅ ${accountData.code} - ${accountData.name} zaten mevcut`);
      } else {
        console.log(`📝 ${accountData.code} - ${accountData.name} oluşturuluyor...`);
        
        await prisma.account.create({
          data: accountData
        });
        
        console.log(`✅ ${accountData.code} - ${accountData.name} oluşturuldu`);
      }
    }

    console.log('\n🎉 Hesap planı hazır!');
    console.log('\nOluşturulan Hesaplar:');
    console.log('💰 Kasa (1001) - Nakit işlemler için');
    console.log('🏦 Banka (1020) - Banka işlemleri için');
    console.log('📊 Alacaklar (1200) - Müşteri alacakları için');
    console.log('📦 Stoklar (1500) - Envanter için');
    console.log('💼 Demirbaşlar (1800) - Sabit kıymetler için');
    console.log('💳 Borçlar (2000) - Tedarikçi borçları için');
    console.log('📈 Öz Sermaye (3000) - Şirket sermayesi için');
    console.log('💰 Gelir Hesapları (4000-4100) - Gelir takibi için');
    console.log('💸 Gider Hesapları (6000-6900) - Gider takibi için');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAccounts();
