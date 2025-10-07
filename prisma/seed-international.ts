import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Türkçe isimler
const turkishNames = [
  'Ahmet Yılmaz', 'Mehmet Kaya', 'Ali Demir', 'Ayşe Özkan', 'Fatma Çelik',
  'Mustafa Arslan', 'Zeynep Yıldız', 'Emre Öztürk', 'Selin Aydın', 'Burak Şahin',
  'Elif Korkmaz', 'Can Özdemir', 'Seda Yılmaz', 'Oğuz Kılıç', 'Pınar Aktaş',
  'Deniz Özkan', 'Gizem Yıldırım', 'Tolga Çetin', 'Burcu Aydın', 'Serkan Yılmaz'
];

// Uluslararası isimler
const internationalNames = [
  // İngiliz
  'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
  'Lisa Anderson', 'James Taylor', 'Jennifer Thomas', 'Robert Jackson', 'Mary White',
  
  // Fransız
  'Pierre Martin', 'Marie Dubois', 'Jean Bernard', 'Sophie Laurent', 'Paul Moreau',
  'Claire Petit', 'François Roux', 'Isabelle Leroy', 'Antoine Simon', 'Nathalie Garcia',
  
  // Alman
  'Hans Mueller', 'Anna Schmidt', 'Klaus Weber', 'Greta Fischer', 'Wolfgang Wagner',
  'Ingrid Becker', 'Dieter Schulz', 'Ursula Hoffmann', 'Rainer Klein', 'Petra Richter',
  
  // İtalyan
  'Marco Rossi', 'Giulia Bianchi', 'Alessandro Ferrari', 'Francesca Romano', 'Luca Conti',
  'Valentina Ricci', 'Matteo Gallo', 'Chiara Leone', 'Andrea Costa', 'Elena Martini',
  
  // İspanyol
  'Carlos Rodriguez', 'Maria Garcia', 'Jose Martinez', 'Ana Lopez', 'Antonio Gonzalez',
  'Carmen Sanchez', 'Francisco Perez', 'Isabel Torres', 'Manuel Ruiz', 'Pilar Diaz',
  
  // Japon
  'Yuki Tanaka', 'Hiroshi Sato', 'Aiko Yamamoto', 'Takeshi Suzuki', 'Yumi Nakamura',
  'Kenji Watanabe', 'Sakura Ito', 'Masahiro Kobayashi', 'Akiko Takahashi', 'Kenta Saito',
  
  // Koreli
  'Min-jun Kim', 'So-young Park', 'Jae-ho Lee', 'Hye-jin Choi', 'Sung-hoon Jung',
  'Eun-ji Kang', 'Dong-hyun Han', 'Ji-eun Lim', 'Seung-woo Oh', 'Mi-kyung Shin'
];

// Şehir ve ülke verileri
const cities = [
  // Türkiye
  { name: 'İstanbul', country: 'Türkiye', district: 'Kadıköy' },
  { name: 'Ankara', country: 'Türkiye', district: 'Çankaya' },
  { name: 'İzmir', country: 'Türkiye', district: 'Konak' },
  { name: 'Lüleburgaz', country: 'Türkiye', district: 'Merkez' },
  { name: 'Pınarhisar', country: 'Türkiye', district: 'Merkez' },
  { name: 'Vize', country: 'Türkiye', district: 'Merkez' },
  { name: 'Babaeski', country: 'Türkiye', district: 'Merkez' },
  { name: 'Kırklareli', country: 'Türkiye', district: 'Merkez' },
  
  // İngiltere
  { name: 'London', country: 'İngiltere', district: 'Westminster' },
  { name: 'Manchester', country: 'İngiltere', district: 'City Centre' },
  { name: 'Birmingham', country: 'İngiltere', district: 'Digbeth' },
  { name: 'Liverpool', country: 'İngiltere', district: 'City Centre' },
  { name: 'Leeds', country: 'İngiltere', district: 'City Centre' },
  
  // Fransa
  { name: 'Paris', country: 'Fransa', district: '8ème Arrondissement' },
  { name: 'Lyon', country: 'Fransa', district: 'Presqu\'île' },
  { name: 'Marseille', country: 'Fransa', district: 'Vieux Port' },
  { name: 'Toulouse', country: 'Fransa', district: 'Capitole' },
  { name: 'Nice', country: 'Fransa', district: 'Promenade des Anglais' },
  
  // Almanya
  { name: 'Berlin', country: 'Almanya', district: 'Mitte' },
  { name: 'Münih', country: 'Almanya', district: 'Altstadt' },
  { name: 'Hamburg', country: 'Almanya', district: 'Altstadt' },
  { name: 'Köln', country: 'Almanya', district: 'Altstadt' },
  { name: 'Frankfurt', country: 'Almanya', district: 'Innenstadt' },
  
  // İtalya
  { name: 'Roma', country: 'İtalya', district: 'Centro Storico' },
  { name: 'Milano', country: 'İtalya', district: 'Centro' },
  { name: 'Napoli', country: 'İtalya', district: 'Centro Storico' },
  { name: 'Torino', country: 'İtalya', district: 'Centro' },
  { name: 'Firenze', country: 'İtalya', district: 'Centro Storico' },
  
  // İspanya
  { name: 'Madrid', country: 'İspanya', district: 'Centro' },
  { name: 'Barcelona', country: 'İspanya', district: 'Ciutat Vella' },
  { name: 'Valencia', country: 'İspanya', district: 'Ciutat Vella' },
  { name: 'Sevilla', country: 'İspanya', district: 'Centro' },
  { name: 'Bilbao', country: 'İspanya', district: 'Casco Viejo' },
  
  // Japonya
  { name: 'Tokyo', country: 'Japonya', district: 'Shibuya' },
  { name: 'Osaka', country: 'Japonya', district: 'Namba' },
  { name: 'Kyoto', country: 'Japonya', district: 'Gion' },
  { name: 'Yokohama', country: 'Japonya', district: 'Minato Mirai' },
  { name: 'Nagoya', country: 'Japonya', district: 'Sakae' },
  
  // Güney Kore
  { name: 'Seul', country: 'Güney Kore', district: 'Gangnam' },
  { name: 'Busan', country: 'Güney Kore', district: 'Haeundae' },
  { name: 'Incheon', country: 'Güney Kore', district: 'Songdo' },
  { name: 'Daegu', country: 'Güney Kore', district: 'Dongseong-ro' },
  { name: 'Daejeon', country: 'Güney Kore', district: 'Yuseong' }
];

// Türk markaları ve cihaz türleri
const turkishBrands = [
  'Arçelik', 'Beko', 'Vestel', 'Profilo', 'Altus', 'Regal', 'Simfer', 'Karaca', 'Tefal', 'Fakir'
];

const deviceTypes = [
  'Kombi', 'Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Klima', 'Fırın', 'Mikrodalga', 'Aspiratör', 'Kurutma Makinası', 'Su Isıtıcısı'
];

const faultTypes = [
  'Sıcak su gelmiyor', 'Çalışmıyor', 'Su sızdırıyor', 'Ses çıkarıyor', 'Isıtmıyor', 'Soğutmuyor',
  'Elbiseler ıslak çıkıyor', 'Sürekli çalışıyor', 'Alarm veriyor', 'Garantisi yok', 'Bakım gerekli',
  'Parça değişimi gerekli', 'Elektrik sorunu', 'Su basıncı düşük', 'Termostat arızalı'
];

// Adres örnekleri
const addressTemplates = {
  'Türkiye': [
    'Cumhuriyet Mh. Atatürk Cd. No:{no} D:{d}',
    'Gençlik Mh. Sevlap Evleri {no}. Ara Sk. No:{no} D:{d}',
    'Fatih Mh. Cumhuriyet Cd. No:{no} D:{d}',
    'Yeni Mahalle İnönü Sk. No:{no} D:{d}',
    'Merkez Mh. Gazi Paşa Cd. No:{no} D:{d}'
  ],
  'İngiltere': [
    'Baker Street {no}B',
    'Oxford Street {no}',
    'Regent Street {no}',
    'Piccadilly {no}',
    'Covent Garden {no}'
  ],
  'Fransa': [
    'Champs-Élysées {no}',
    'Rue de Rivoli {no}',
    'Boulevard Saint-Germain {no}',
    'Avenue des Champs-Élysées {no}',
    'Rue de la Paix {no}'
  ],
  'Almanya': [
    'Unter den Linden {no}',
    'Kurfürstendamm {no}',
    'Neue Straße {no}',
    'Hauptstraße {no}',
    'Bahnhofstraße {no}'
  ],
  'İtalya': [
    'Via del Corso {no}',
    'Piazza Navona {no}',
    'Via Veneto {no}',
    'Corso Buenos Aires {no}',
    'Via Roma {no}'
  ],
  'İspanya': [
    'Gran Vía {no}',
    'Paseo de la Castellana {no}',
    'Rambla de Catalunya {no}',
    'Calle Serrano {no}',
    'Plaza Mayor {no}'
  ],
  'Japonya': [
    'Shibuya {no}-{no}-{no}',
    'Ginza {no}-{no}-{no}',
    'Harajuku {no}-{no}-{no}',
    'Roppongi {no}-{no}-{no}',
    'Shinjuku {no}-{no}-{no}'
  ],
  'Güney Kore': [
    'Gangnam-gu {no}-{no}',
    'Myeongdong {no}-{no}',
    'Hongdae {no}-{no}',
    'Itaewon {no}-{no}',
    'Insadong {no}-{no}'
  ]
};

function generateAddress(city: any) {
  const templates = addressTemplates[city.country as keyof typeof addressTemplates] || addressTemplates['Türkiye'];
  const template = faker.helpers.arrayElement(templates);
  const no = faker.number.int({ min: 1, max: 999 });
  const d = faker.number.int({ min: 1, max: 20 });
  
  return template.replace(/{no}/g, no.toString()).replace(/{d}/g, d.toString());
}

function generatePhoneNumber(country: string) {
  const countryCodes = {
    'Türkiye': '0(5XX) XXX-XXXX',
    'İngiltere': '+44 7XXX XXX XXX',
    'Fransa': '+33 6 XX XX XX XX',
    'Almanya': '+49 1XX XXXXXXX',
    'İtalya': '+39 3XX XXX XXXX',
    'İspanya': '+34 6XX XXX XXX',
    'Japonya': '+81 90-XXXX-XXXX',
    'Güney Kore': '+82 10-XXXX-XXXX'
  };
  
  const pattern = countryCodes[country as keyof typeof countryCodes] || countryCodes['Türkiye'];
  return pattern.replace(/X/g, () => faker.number.int({ min: 0, max: 9 }).toString());
}

async function seedInternationalData() {
  console.log('🌍 Uluslararası müşteri verileri oluşturuluyor...');

  // Kategoriler oluştur
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'customer-premium' },
      update: {},
      create: {
        id: 'customer-premium',
        type: 'customer',
        name: 'Premium Müşteri'
      }
    }),
    prisma.category.upsert({
      where: { id: 'customer-regular' },
      update: {},
      create: {
        id: 'customer-regular',
        type: 'customer',
        name: 'Normal Müşteri'
      }
    }),
    prisma.category.upsert({
      where: { id: 'customer-corporate' },
      update: {},
      create: {
        id: 'customer-corporate',
        type: 'customer',
        name: 'Kurumsal Müşteri'
      }
    })
  ]);

  // Müşteriler oluştur
  const customers = [];
  const allNames = [...turkishNames, ...internationalNames];
  
  for (let i = 0; i < 150; i++) {
    const name = faker.helpers.arrayElement(allNames);
    const city = faker.helpers.arrayElement(cities);
    const category = faker.helpers.arrayElement(categories);
    const isTurkish = turkishNames.includes(name);
    
    const customer = await prisma.customer.create({
      data: {
        type: faker.helpers.arrayElement(['individual', 'corporate']),
        name,
        phone: generatePhoneNumber(city.country),
        phone2: faker.datatype.boolean() ? generatePhoneNumber(city.country) : null,
        email: faker.internet.email(),
        address: generateAddress(city),
        city: city.name,
        district: city.district,
        taxNo: faker.datatype.boolean() ? faker.string.numeric(10) : null,
        taxOffice: faker.datatype.boolean() ? faker.company.name() + ' Vergi Dairesi' : null,
        categoryId: category.id,
        isSupplier: faker.datatype.boolean({ probability: 0.1 })
      }
    });
    
    customers.push(customer);
  }

  // Personel oluştur
  const staff = [];
  for (let i = 0; i < 10; i++) {
    const name = faker.helpers.arrayElement(turkishNames);
    const city = faker.helpers.arrayElement(cities.filter(c => c.country === 'Türkiye'));
    
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: '$2b$10$example', // Hash'lenmiş şifre
        name,
        phone: generatePhoneNumber('Türkiye'),
        phone2: faker.datatype.boolean() ? generatePhoneNumber('Türkiye') : null,
        address: generateAddress(city),
        city: city.name,
        district: city.district,
        position: faker.helpers.arrayElement(['Teknisyen', 'Operatör', 'Müdür', 'Uzman', 'Asistan']),
        status: faker.datatype.boolean({ probability: 0.9 }),
        hireDate: faker.date.past({ years: 5 }),
        photoUrl: null,
        tcNo: faker.string.numeric(11),
        permissions: JSON.stringify({})
      }
    });
    
    staff.push(user);
  }

  // Servisler oluştur
  const services = [];
  for (let i = 0; i < 200; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const technician = faker.helpers.arrayElement(staff);
    const operator = faker.helpers.arrayElement(staff);
    const deviceBrand = faker.helpers.arrayElement(turkishBrands);
    const deviceType = faker.helpers.arrayElement(deviceTypes);
    const problem = faker.helpers.arrayElement(faultTypes);
    
    const service = await prisma.service.create({
      data: {
        serviceNo: faker.string.numeric(6),
        customerId: customer.id,
        technicianId: technician.id,
        operatorId: operator.id,
        deviceBrand,
        deviceType,
        deviceModel: faker.helpers.arrayElement([
          'Seri 9', 'Inverter', 'Bakım 2500TI', 'Sessiz Çalışma', 'Garantisi Yok',
          'Premium', 'Eco', 'Smart', 'Pro', 'Max'
        ]),
        serialNo: faker.string.alphanumeric(10),
        problem,
        solution: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        diagnosis: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        status: faker.helpers.arrayElement([
          'Teknisyen Yönlendir', 'PARÇA SİPARİŞİ VERİLDİ', 'Atölyeye Alındı',
          'Haber Verecek', 'Servisi Sonlandır', 'Müşteri İptal Etti'
        ]),
        priority: faker.helpers.arrayElement(['normal', 'high', 'urgent']),
        receivedDate: faker.date.recent({ days: 30 }),
        deliveryDate: faker.datatype.boolean() ? faker.date.future(0.08) : null, // ~30 days
        laborCost: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
        partsCost: faker.number.float({ min: 50, max: 2000, fractionDigits: 2 }),
        totalCost: faker.number.float({ min: 200, max: 3000, fractionDigits: 2 }),
        paymentStatus: faker.helpers.arrayElement(['unpaid', 'paid', 'partial']),
        serviceSource: generatePhoneNumber('Türkiye'),
        operatorNote: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        availableTime: faker.helpers.arrayElement([
          '08.10.2025 - 09:00 ile 18:00 Arası',
          '09.10.2025 - 10:00 ile 17:00 Arası',
          '10.10.2025 - 14:00 ile 20:00 Arası',
          'Hafta içi herhangi bir saat',
          'Hafta sonu sabah saatleri'
        ]),
        warrantyEnd: faker.datatype.boolean() ? faker.date.future({ years: 2 }) : null,
        warrantyDaysLeft: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 730 }) : null,
        photos: JSON.stringify([])
      }
    });
    
    services.push(service);
  }

  // Servis işlemleri oluştur
  for (const service of services.slice(0, 100)) {
    const operationCount = faker.number.int({ min: 1, max: 5 });
    
    for (let i = 0; i < operationCount; i++) {
      await prisma.serviceOperation.create({
        data: {
          serviceId: service.id,
          operationDate: faker.date.between({ 
            from: service.receivedDate, 
            to: new Date() 
          }),
          operatorId: faker.helpers.arrayElement(staff).id,
          operationName: faker.helpers.arrayElement([
            'Teknisyen Yönlendir', 'Parça Siparişi', 'Atölyeye Alındı',
            'Müşteri Arandı', 'Servis Tamamlandı', 'Garanti Kontrolü'
          ]),
          description: faker.lorem.sentence()
        }
      });
    }
  }

  // Servis notları oluştur
  for (const service of services.slice(0, 80)) {
    const noteCount = faker.number.int({ min: 0, max: 3 });
    
    for (let i = 0; i < noteCount; i++) {
      await prisma.serviceNote.create({
        data: {
          serviceId: service.id,
          noteDate: faker.date.between({ 
            from: service.receivedDate, 
            to: new Date() 
          }),
          noteBy: faker.helpers.arrayElement(staff).id,
          content: faker.lorem.sentence()
        }
      });
    }
  }

  // Kasa işlemleri oluştur
  for (let i = 0; i < 100; i++) {
    const service = faker.helpers.arrayElement(services);
    const technician = faker.helpers.arrayElement(staff);
    
    await prisma.cashTransaction.create({
      data: {
        type: faker.helpers.arrayElement(['income', 'expense']),
        amount: faker.number.float({ min: 50, max: 2000, fractionDigits: 2 }),
        paymentMethod: faker.helpers.arrayElement(['cash', 'card', 'transfer']),
        paymentStatus: faker.helpers.arrayElement(['completed', 'pending', 'cancelled']),
        relatedServiceId: faker.datatype.boolean() ? service.id : null,
        technicianId: technician.id,
        description: faker.lorem.sentence(),
        transactionDate: faker.date.recent({ days: 30 }),
        installmentCount: faker.number.int({ min: 1, max: 12 })
      }
    });
  }

  console.log('✅ Uluslararası veri oluşturma tamamlandı!');
  console.log(`📊 Oluşturulan veriler:`);
  console.log(`   - Müşteriler: ${customers.length}`);
  console.log(`   - Personel: ${staff.length}`);
  console.log(`   - Servisler: ${services.length}`);
  console.log(`   - Kategoriler: ${categories.length}`);
}

seedInternationalData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
