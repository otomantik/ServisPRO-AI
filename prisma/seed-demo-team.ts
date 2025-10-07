import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Demo Ekip Oluşturuluyor...')

  // Önce mevcut kullanıcıları temizle
  await prisma.servicePhoto.deleteMany()
  await prisma.serviceNote.deleteMany()
  await prisma.serviceOperation.deleteMany()
  await prisma.user.deleteMany()

  console.log('👥 Kullanıcılar oluşturuluyor...')

  // 1. Yönetici - Gökhan Bozkurt
  const gokhan = await prisma.user.create({
    data: {
      email: 'gokhan.bozkurt@servispro.com',
      password: 'admin123', // Gerçek projede hash'lenmeli
      name: 'Gökhan Bozkurt',
      phone: '05551234567',
      position: 'Genel Müdür',
      status: true,
      hireDate: new Date('2020-01-15'),
    }
  })

  // 2. Operatör - Ayşe Yılmaz (Kız operatör)
  const ayse = await prisma.user.create({
    data: {
      email: 'ayse.yilmaz@servispro.com',
      password: 'operator123',
      name: 'Ayşe Yılmaz',
      phone: '05552345678',
      position: 'Müşteri Temsilcisi',
      status: true,
      hireDate: new Date('2021-03-10'),
    }
  })

  // 3. Usta Teknisyen - Mehmet Kaya
  const mehmet = await prisma.user.create({
    data: {
      email: 'mehmet.kaya@servispro.com',
      password: 'tech123',
      name: 'Mehmet Kaya',
      phone: '05553456789',
      position: 'Usta Teknisyen',
      status: true,
      hireDate: new Date('2019-06-01'),
    }
  })

  // 4. Teknisyen - Ahmet Demir
  const ahmet = await prisma.user.create({
    data: {
      email: 'ahmet.demir@servispro.com',
      password: 'tech123',
      name: 'Ahmet Demir',
      phone: '05554567890',
      position: 'Teknisyen',
      status: true,
      hireDate: new Date('2021-09-15'),
    }
  })

  // 5. Teknisyen - Ali Çelik
  const ali = await prisma.user.create({
    data: {
      email: 'ali.celik@servispro.com',
      password: 'tech123',
      name: 'Ali Çelik',
      phone: '05555678901',
      position: 'Teknisyen',
      status: true,
      hireDate: new Date('2022-02-20'),
    }
  })

  // 6. Muhasebe - Zeynep Aydın
  const zeynep = await prisma.user.create({
    data: {
      email: 'zeynep.aydin@servispro.com',
      password: 'acc123',
      name: 'Zeynep Aydın',
      phone: '05556789012',
      position: 'Muhasebe Sorumlusu',
      status: true,
      hireDate: new Date('2020-11-05'),
    }
  })

  // 7. Stok Sorumlusu - Emre Öztürk
  const emre = await prisma.user.create({
    data: {
      email: 'emre.ozturk@servispro.com',
      password: 'stock123',
      name: 'Emre Öztürk',
      phone: '05557890123',
      position: 'Stok Sorumlusu',
      status: true,
      hireDate: new Date('2021-07-12'),
    }
  })

  console.log('\n✅ 7 Kişilik Ekip Oluşturuldu:\n')
  console.log('1. 👨‍💼 Gökhan Bozkurt - Genel Müdür (gokhan.bozkurt@servispro.com / admin123)')
  console.log('2. 👩‍💼 Ayşe Yılmaz - Müşteri Temsilcisi (ayse.yilmaz@servispro.com / operator123)')
  console.log('3. 🔧 Mehmet Kaya - Usta Teknisyen (mehmet.kaya@servispro.com / tech123)')
  console.log('4. 🔧 Ahmet Demir - Teknisyen (ahmet.demir@servispro.com / tech123)')
  console.log('5. 🔧 Ali Çelik - Teknisyen (ali.celik@servispro.com / tech123)')
  console.log('6. 💰 Zeynep Aydın - Muhasebe Sorumlusu (zeynep.aydin@servispro.com / acc123)')
  console.log('7. 📦 Emre Öztürk - Stok Sorumlusu (emre.ozturk@servispro.com / stock123)')
  
  console.log('\n🎉 Demo ekip başarıyla oluşturuldu!')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

