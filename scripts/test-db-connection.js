const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔍 Veritabanı bağlantısı test ediliyor...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Veritabanı bağlantısı başarılı');
    
    // Test stock table
    const stockCount = await prisma.stock.count();
    console.log(`📦 Stok kayıt sayısı: ${stockCount}`);
    
    // Test account table
    const accountCount = await prisma.account.count();
    console.log(`💰 Hesap sayısı: ${accountCount}`);
    
    // Test user table
    const userCount = await prisma.user.count();
    console.log(`👥 Kullanıcı sayısı: ${userCount}`);
    
    // Test categories table
    const categoryCount = await prisma.category.count();
    console.log(`📂 Kategori sayısı: ${categoryCount}`);
    
    console.log('\n🎉 Tüm testler başarılı!');
    
  } catch (error) {
    console.error('❌ Veritabanı hatası:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
