import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/tr';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Türkiye şehirleri
const cities = ['Kırklareli', 'İstanbul', 'Edirne', 'Tekirdağ'];
const districts: Record<string, string[]> = {
  'Kırklareli': ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Pınarhisar'],
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar'],
  'Edirne': ['Merkez', 'Keşan', 'Uzunköprü'],
  'Tekirdağ': ['Merkez', 'Çorlu', 'Çerkezköy'],
};

async function main() {
  console.log('🌱 Seed başlıyor...');

  // Temizlik
  await prisma.cashTransaction.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.periodicDevice.deleteMany();
  await prisma.periodicMaintenance.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.paymentType.deleteMany();
  await prisma.category.deleteMany();

  // 1. Kategoriler
  console.log('📁 Kategoriler oluşturuluyor...');
  const customerCategories = await Promise.all([
    prisma.category.create({ data: { type: 'customer', name: 'VIP Müşteri' } }),
    prisma.category.create({ data: { type: 'customer', name: 'Kurumsal' } }),
    prisma.category.create({ data: { type: 'customer', name: 'Sorunlu Müşteri' } }),
  ]);

  const stockCategories = await Promise.all([
    prisma.category.create({ data: { type: 'stock', name: 'Yedek Parça' } }),
    prisma.category.create({ data: { type: 'stock', name: 'Sarf Malzeme' } }),
    prisma.category.create({ data: { type: 'stock', name: 'Aksesuar' } }),
  ]);

  // 2. Ödeme Türleri
  console.log('💳 Ödeme türleri oluşturuluyor...');
  const paymentTypes = await Promise.all([
    prisma.paymentType.create({ data: { name: 'Servis İşlemleri', direction: 'incoming' } }),
    prisma.paymentType.create({ data: { name: 'Ürün Satışı', direction: 'incoming' } }),
    prisma.paymentType.create({ data: { name: 'Maaş Ödemesi', direction: 'outgoing' } }),
    prisma.paymentType.create({ data: { name: 'Kira Ödemesi', direction: 'outgoing' } }),
    prisma.paymentType.create({ data: { name: 'Fatura Ödemesi', direction: 'outgoing' } }),
  ]);

  // 3. Personel (8 kişi)
  console.log('👥 Personel oluşturuluyor...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@oto.com',
        password: hashedPassword,
        name: 'Gökhan Bozkurt',
        phone: '0(532) 379-9451',
        city: 'Kırklareli',
        district: 'Lüleburgaz',
        position: 'Patron',
        address: 'Gonul Sokak No:24/A',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ahmet@oto.com',
        password: hashedPassword,
        name: 'Ahmet',
        phone: '0(541) 234-5678',
        city: 'Kırklareli',
        district: 'Lüleburgaz',
        position: 'Teknisyen',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ridvan@oto.com',
        password: hashedPassword,
        name: 'Rıdvan',
        phone: '0(543) 585-0789',
        city: 'Kırklareli',
        district: 'Lüleburgaz',
        position: 'Teknisyen',
      },
    }),
    prisma.user.create({
      data: {
        email: 'hakan@oto.com',
        password: hashedPassword,
        name: 'Hakan',
        phone: '0(541) 453-6057',
        city: 'Kırklareli',
        district: 'Lüleburgaz',
        position: 'Teknisyen',
      },
    }),
    prisma.user.create({
      data: {
        email: 'melek@oto.com',
        password: hashedPassword,
        name: 'Melek',
        phone: '0(532) 379-9451',
        city: 'Kırklareli',
        district: 'Lüleburgaz',
        position: 'Operatör',
      },
    }),
  ]);

  // 4. Müşteriler (100 kişi)
  console.log('🏢 Müşteriler oluşturuluyor...');
  const customers = [];
  for (let i = 0; i < 100; i++) {
    const city = faker.helpers.arrayElement(cities);
    const isCompany = i < 30; // İlk 30'u kurumsal
    
    customers.push(
      await prisma.customer.create({
        data: {
          type: isCompany ? 'corporate' : 'individual',
          name: isCompany ? faker.company.name() : faker.person.fullName(),
          phone: `0(${faker.number.int({ min: 500, max: 599 })}) ${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
          phone2: Math.random() > 0.5 ? `0(${faker.number.int({ min: 500, max: 599 })}) ${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}` : null,
          email: faker.internet.email().toLowerCase(),
          address: faker.location.streetAddress(),
          city: city,
          district: faker.helpers.arrayElement(districts[city]),
          taxNo: isCompany ? faker.number.int({ min: 1000000000, max: 9999999999 }).toString() : null,
          taxOffice: isCompany ? faker.helpers.arrayElement(['Lüleburgaz', 'Kırklareli', 'İstanbul']) : null,
          categoryId: i < 5 ? customerCategories[0].id : i < 35 ? customerCategories[1].id : i < 38 ? customerCategories[2].id : null,
          isSupplier: i < 10, // İlk 10'u tedarikçi
        },
      })
    );
  }

  // 5. Servisler (120 kayıt)
  console.log('🔧 Servisler oluşturuluyor...');
  const deviceBrands = ['Arçelik', 'Bosch', 'Siemens', 'Vestel', 'Beko', 'Samsung', 'LG'];
  const deviceTypes = ['Bulaşık Makinesi', 'Çamaşır Makinesi', 'Buzdolabı', 'Fırın', 'Klima'];
  const statuses = ['completed', 'in_progress', 'pending', 'cancelled'];
  
  const services = [];
  for (let i = 0; i < 120; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const technician = faker.helpers.arrayElement(users.filter(u => u.position === 'Teknisyen'));
    const status = faker.helpers.arrayElement(statuses);
    const laborCost = faker.number.int({ min: 100, max: 500 });
    const partsCost = faker.number.int({ min: 0, max: 1000 });
    
    services.push(
      await prisma.service.create({
        data: {
          serviceNo: `SRV${Date.now()}${faker.number.int({ min: 100, max: 999 })}`,
          customerId: customer.id,
          technicianId: technician.id,
          deviceBrand: faker.helpers.arrayElement(deviceBrands),
          deviceType: faker.helpers.arrayElement(deviceTypes),
          deviceModel: `Model ${faker.number.int({ min: 1000, max: 9999 })}`,
          serialNo: faker.string.alphanumeric(10).toUpperCase(),
          problem: faker.helpers.arrayElement([
            'Çalışmıyor',
            'Ses yapıyor',
            'Su akıtıyor',
            'Soğutmuyor',
            'Isıtmıyor',
            'Titreşim var'
          ]),
          solution: status === 'completed' ? faker.helpers.arrayElement([
            'Parça değiştirildi',
            'Yazılım güncellendi',
            'Temizlik yapıldı',
            'Ayar yapıldı'
          ]) : null,
          status: status,
          priority: faker.helpers.arrayElement(['normal', 'urgent', 'low']),
          receivedDate: faker.date.past({ years: 1 }),
          deliveryDate: status === 'completed' ? faker.date.recent({ days: 30 }) : null,
          laborCost: laborCost,
          partsCost: partsCost,
          totalCost: laborCost + partsCost,
          paymentStatus: status === 'completed' ? (Math.random() > 0.2 ? 'paid' : 'unpaid') : 'unpaid',
        },
      })
    );
  }

  // 6. Stoklar (50 kayıt)
  console.log('📦 Stoklar oluşturuluyor...');
  const stockNames = [
    'Motor', 'Pompa', 'Termostat', 'Sigorta', 'Kablo', 'Conta', 'Filtre',
    'Kompresör', 'Fan', 'Sensör', 'Vana', 'Mantar', 'Kayış', 'Rulman'
  ];
  
  const stocks = [];
  for (let i = 0; i < 50; i++) {
    stocks.push(
      await prisma.stock.create({
        data: {
          code: `STK${Date.now()}${faker.number.int({ min: 100, max: 999 })}`,
          name: `${faker.helpers.arrayElement(stockNames)} ${faker.helpers.arrayElement(deviceBrands)}`,
          categoryId: faker.helpers.arrayElement(stockCategories).id,
          price: faker.number.int({ min: 50, max: 2000 }),
          unit: faker.helpers.arrayElement(['Adet', 'Metre', 'Kg']),
          quantity: faker.number.int({ min: 0, max: 100 }),
          minQuantity: faker.number.int({ min: 5, max: 20 }),
          description: faker.lorem.sentence(),
        },
      })
    );
  }

  // 7. Stok Hareketleri (Servislere bağlı)
  console.log('📊 Stok hareketleri oluşturuluyor...');
  for (let i = 0; i < 80; i++) {
    const stock = faker.helpers.arrayElement(stocks);
    const service = faker.helpers.arrayElement(services);
    const quantity = faker.number.int({ min: 1, max: 5 });
    
    await prisma.stockMovement.create({
      data: {
        stockId: stock.id,
        type: 'out',
        quantity: quantity,
        serviceId: service.id,
        unitPrice: stock.price,
        totalPrice: stock.price * quantity,
        date: service.receivedDate,
        notes: `Servis işlemi için kullanıldı`,
      },
    });
  }

  // 8. Kasa İşlemleri (60 kayıt)
  console.log('💰 Kasa işlemleri oluşturuluyor...');
  for (let i = 0; i < 60; i++) {
    const isIncome = Math.random() > 0.4;
    const service = isIncome ? faker.helpers.arrayElement(services) : null;
    
    await prisma.cashTransaction.create({
      data: {
        type: isIncome ? 'income' : 'expense',
        amount: faker.number.int({ min: 500, max: 10000 }),
        paymentMethod: faker.helpers.arrayElement(['cash', 'card', 'transfer']),
        paymentTypeId: isIncome ? paymentTypes[0].id : faker.helpers.arrayElement(paymentTypes.filter(pt => pt.direction === 'outgoing')).id,
        paymentStatus: 'completed',
        relatedServiceId: service?.id,
        technicianId: faker.helpers.arrayElement(users).id,
        description: faker.lorem.sentence(),
        transactionDate: faker.date.past({ years: 1 }),
      },
    });
  }

  // 9. Periyodik Bakım (15 kayıt)
  console.log('📅 Periyodik bakımlar oluşturuluyor...');
  for (let i = 0; i < 15; i++) {
    const customer = faker.helpers.arrayElement(customers.filter(c => c.type === 'corporate'));
    const startDate = faker.date.past({ years: 1 });
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    const maintenance = await prisma.periodicMaintenance.create({
      data: {
        customerId: customer.id,
        companyName: customer.name,
        phone: customer.phone,
        address: customer.address || '',
        startDate: startDate,
        endDate: endDate,
        maintenanceCount: faker.number.int({ min: 4, max: 12 }),
        status: true,
        partsIncluded: Math.random() > 0.5,
        pricePerMaintenance: faker.number.int({ min: 500, max: 2000 }),
      },
    });

    // Her bakıma 3-8 cihaz ekle
    const deviceCount = faker.number.int({ min: 3, max: 8 });
    for (let j = 0; j < deviceCount; j++) {
      await prisma.periodicDevice.create({
        data: {
          periodicMaintenanceId: maintenance.id,
          brand: faker.helpers.arrayElement(deviceBrands),
          type: faker.helpers.arrayElement(deviceTypes),
          model: `Model ${faker.number.int({ min: 1000, max: 9999 })}`,
          serialNo: faker.string.alphanumeric(10).toUpperCase(),
          location: faker.helpers.arrayElement(['Zemin Kat', '1. Kat', '2. Kat', 'Bodrum']),
        },
      });
    }
  }

  console.log('✅ Seed tamamlandı!');
  console.log(`
  📊 Oluşturulan Kayıtlar:
  - Personel: ${users.length}
  - Müşteriler: ${customers.length}
  - Servisler: ${services.length}
  - Stoklar: ${stocks.length}
  - Kasa İşlemleri: 60
  - Periyodik Bakım: 15
  `);
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

