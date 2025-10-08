const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('Demo kullanıcılar oluşturuluyor...');

    const demoUsers = [
      {
        email: 'admin@oto.com',
        password: 'admin123',
        name: 'Admin User',
        position: 'Admin',
        status: true
      },
      {
        email: 'ahmet@oto.com',
        password: 'ahmet123',
        name: 'Ahmet Teknisyen',
        position: 'Teknisyen',
        status: true
      },
      {
        email: 'melek@oto.com',
        password: 'melek123',
        name: 'Melek Operatör',
        position: 'Operatör',
        status: true
      }
    ];

    for (const userData of demoUsers) {
      // Önce kullanıcının var olup olmadığını kontrol et
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`${userData.email} zaten mevcut, güncelleniyor...`);
        
        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Kullanıcıyı güncelle
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            password: hashedPassword,
            name: userData.name,
            position: userData.position,
            status: userData.status
          }
        });
        
        console.log(`✅ ${userData.email} güncellendi`);
      } else {
        console.log(`${userData.email} oluşturuluyor...`);
        
        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Yeni kullanıcı oluştur
        await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            position: userData.position,
            status: userData.status
          }
        });
        
        console.log(`✅ ${userData.email} oluşturuldu`);
      }
    }

    console.log('\n🎉 Tüm demo kullanıcılar hazır!');
    console.log('\nDemo Hesaplar:');
    console.log('📧 admin@oto.com - Şifre: admin123 (Admin)');
    console.log('📧 ahmet@oto.com - Şifre: ahmet123 (Teknisyen)');
    console.log('📧 melek@oto.com - Şifre: melek123 (Operatör)');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
