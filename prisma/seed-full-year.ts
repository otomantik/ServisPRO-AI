import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() as any

// Türk araç markaları ve modelleri
const turkishCarBrands: Record<string, string[]> = {
  'Beko': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın', 'Aspiratör'],
  'Arçelik': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Kurutma Makinası', 'Buzdolabı', 'Fırın'],
  'Vestel': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Televizyon', 'Klima'],
  'Profilo': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın', 'Mikrofırın'],
  'Bosch': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın', 'Aspiratör'],
  'Siemens': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın', 'Ocak'],
  'Samsung': ['Çamaşır Makinası', 'Kurutma Makinası', 'Buzdolabı', 'Televizyon', 'Klima'],
  'LG': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Televizyon', 'Klima'],
  'Whirlpool': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın'],
  'Grundig': ['Çamaşır Makinası', 'Kurutma Makinası', 'Buzdolabı', 'Televizyon', 'Klima'],
  'Altus': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Fırın'],
  'Regal': ['Çamaşır Makinası', 'Bulaşık Makinası', 'Buzdolabı', 'Aspiratör'],
  'Airfel': ['Kombi', 'Şofben', 'Termosifon'],
  'Baymak': ['Kombi', 'Şofben', 'Termosifon', 'Klima'],
  'Vaillant': ['Kombi', 'Şofben', 'Termosifon'],
  'Demirdöküm': ['Kombi', 'Şofben', 'Kalorifer'],
  'Ariston': ['Kombi', 'Şofben', 'Su Isıtıcı'],
  'Eca': ['Kombi', 'Şofben', 'Su Isıtıcı'],
}

// Gerçekçi Türk isimleri
const turkishNames = [
  'Mehmet Yılmaz', 'Ayşe Kaya', 'Fatma Demir', 'Ahmet Şahin', 'Emine Çelik',
  'Mustafa Arslan', 'Hatice Koç', 'Ali Öztürk', 'Zeynep Aydın', 'Hüseyin Kurt',
  'Elif Özdemir', 'İbrahim Özkan', 'Can Yıldız', 'Selin Yıldırım', 'Burak Acar',
  'Merve Aksoy', 'Emre Koçak', 'Deniz Çetin', 'Ömer Erdoğan', 'Esra Polat',
  'Serkan Güneş', 'Aylin Özer', 'Murat Taş', 'Buse Çakır', 'Onur Şen',
  'Gül Ateş', 'Kemal Uçar', 'Derya Kaplan', 'Cem Bal', 'Seda Korkmaz',
  'Tolga Çetin', 'Burcu Aydın', 'Oğuz Kılıç', 'Pınar Aslan', 'Hakan Doğan',
  'Canan Şimşek', 'Volkan Akın', 'Nilüfer Başar', 'Tarık Eren', 'Gamze Toprak'
]

// İstanbul mahalle ve semtleri
const istanbulDistricts = [
  'Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Üsküdar', 'Maltepe', 'Ataşehir',
  'Kartal', 'Pendik', 'Tuzla', 'Ümraniye', 'Çekmeköy', 'Sancaktepe', 'Sultangazi',
  'Başakşehir', 'Esenyurt', 'Avcılar', 'Küçükçekmece', 'Beylikdüzü', 'Silivri',
  'Fatih', 'Eyüpsultan', 'Gaziosmanpaşa', 'Sarıyer', 'Beykoz', 'Çatalca'
]

// Arıza tipleri ve çözümleri
type ProblemData = {
  problem: string
  solution: string
  labor: number
  parts: number
}

const commonProblems: Record<string, ProblemData[]> = {
  'Çamaşır Makinası': [
    { problem: 'Su almıyor', solution: 'Elektrovana değiştirildi', labor: 350, parts: 280 },
    { problem: 'Su boşaltmıyor', solution: 'Pompa temizlendi ve değiştirildi', labor: 400, parts: 450 },
    { problem: 'Dönerken ses yapıyor', solution: 'Rulman değiştirildi', labor: 550, parts: 750 },
    { problem: 'Isıtmıyor', solution: 'Rezistans değiştirildi', labor: 450, parts: 620 },
    { problem: 'Çalışmıyor', solution: 'Elektronik kart onarıldı', labor: 650, parts: 950 },
    { problem: 'Kapak açılmıyor', solution: 'Kilit mekanizması değiştirildi', labor: 280, parts: 180 },
    { problem: 'Sarsıyor', solution: 'Amortisör değiştirildi', labor: 400, parts: 520 },
  ],
  'Bulaşık Makinası': [
    { problem: 'Su almıyor', solution: 'Elektrovana ve filtre temizlendi', labor: 350, parts: 220 },
    { problem: 'Kurutmuyor', solution: 'Fan motoru değiştirildi', labor: 450, parts: 680 },
    { problem: 'Kapak kapanmıyor', solution: 'Menteşe ve kilit ayarlandı', labor: 250, parts: 130 },
    { problem: 'Isıtmıyor', solution: 'Rezistans değiştirildi', labor: 400, parts: 550 },
    { problem: 'Pompa çalışmıyor', solution: 'Pompa motoru değiştirildi', labor: 480, parts: 620 },
  ],
  'Buzdolabı': [
    { problem: 'Soğutmuyor', solution: 'Gaz dolumu yapıldı ve termostat değiştirildi', labor: 650, parts: 850 },
    { problem: 'Çok gürültü yapıyor', solution: 'Kompresör değiştirildi', labor: 850, parts: 1650 },
    { problem: 'Dondurucu buz tutuyor', solution: 'Defrost sistemi onarıldı', labor: 550, parts: 380 },
    { problem: 'Kapı düzgün kapanmıyor', solution: 'Conta ve menteşe değiştirildi', labor: 280, parts: 320 },
  ],
  'Kombi': [
    { problem: 'Yanmıyor', solution: 'Gaz valfi ve elektronik sistem kontrolü yapıldı', labor: 450, parts: 330 },
    { problem: 'Sıcak su gelmiyor', solution: 'Eşanjör temizlendi', labor: 550, parts: 220 },
    { problem: 'Basınç düşüyor', solution: 'Genleşme deposu değiştirildi', labor: 650, parts: 950 },
    { problem: 'Aralıklı yanıyor', solution: 'NTC sensör ve flometre değiştirildi', labor: 400, parts: 440 },
  ],
  'Klima': [
    { problem: 'Soğutmuyor', solution: 'Gaz dolumu ve bakım yapıldı', labor: 550, parts: 650 },
    { problem: 'Su akıtıyor', solution: 'Drenaj hattı temizlendi', labor: 350, parts: 110 },
    { problem: 'Gürültü yapıyor', solution: 'Fan motoru yağlandı ve ayarlandı', labor: 400, parts: 260 },
  ],
  'Fırın': [
    { problem: 'Isıtmıyor', solution: 'Alt ve üst rezistans değiştirildi', labor: 450, parts: 620 },
    { problem: 'Termostat çalışmıyor', solution: 'Termostat değiştirildi', labor: 350, parts: 260 },
    { problem: 'Kapak cam kırık', solution: 'Cam değiştirildi', labor: 250, parts: 440 },
  ]
}

// Yedek parça ve malzemeler
const stockItems = [
  { code: 'ELV-001', name: 'Elektrovana', category: 'Çamaşır Makinası', price: 280, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'PMF-001', name: 'Pompa Filtresi', category: 'Çamaşır Makinası', price: 190, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Vestel'] },
  { code: 'RLM-001', name: 'Rulman Seti', category: 'Çamaşır Makinası', price: 750, unit: 'Takım', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'REZ-001', name: 'Rezistans', category: 'Çamaşır Makinası', price: 620, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'AMT-001', name: 'Amortisör', category: 'Çamaşır Makinası', price: 260, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Vestel'] },
  { code: 'EKT-001', name: 'Elektronik Kart', category: 'Çamaşır Makinası', price: 950, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'TRM-001', name: 'Termostat', category: 'Buzdolabı', price: 380, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Samsung'] },
  { code: 'KMP-001', name: 'Kompresör', category: 'Buzdolabı', price: 1650, unit: 'Adet', brands: ['Beko', 'Arçelik', 'LG'] },
  { code: 'CNT-001', name: 'Kapı Contası', category: 'Buzdolabı', price: 320, unit: 'Metre', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'GAZ-001', name: 'Soğutucu Gaz (R600a)', category: 'Buzdolabı', price: 850, unit: 'Tüp', brands: [] },
  { code: 'ESJ-001', name: 'Eşanjör', category: 'Kombi', price: 770, unit: 'Adet', brands: ['Baymak', 'Vaillant', 'Airfel'] },
  { code: 'GNL-001', name: 'Genleşme Deposu', category: 'Kombi', price: 950, unit: 'Adet', brands: ['Baymak', 'Vaillant'] },
  { code: 'NTC-001', name: 'NTC Sensör', category: 'Kombi', price: 260, unit: 'Adet', brands: ['Baymak', 'Vaillant', 'Airfel'] },
  { code: 'FLM-001', name: 'Flometre', category: 'Kombi', price: 180, unit: 'Adet', brands: ['Baymak', 'Vaillant'] },
  { code: 'FAN-001', name: 'Fan Motoru', category: 'Klima', price: 620, unit: 'Adet', brands: ['Vestel', 'Samsung', 'LG'] },
  { code: 'GAZ-002', name: 'Klima Gazı (R410A)', category: 'Klima', price: 650, unit: 'Tüp', brands: [] },
  { code: 'REZ-002', name: 'Fırın Rezistansı', category: 'Fırın', price: 310, unit: 'Adet', brands: ['Beko', 'Arçelik', 'Bosch'] },
  { code: 'CAM-001', name: 'Fırın Kapak Camı', category: 'Fırın', price: 440, unit: 'Adet', brands: ['Beko', 'Arçelik'] },
]

// Gider kategorileri (aylık) - Toplam ~180K sabit gider/ay
// Toplam gelir: 540K/yıl = 45K/ay (ödenmiş servislerden)
// Sabit giderler: 180K x 12 = 2.16M/yıl
// Net: 540K - 2.16M = -1.62M ZARAR (Değişken maliyetler servis içinde)
// 
// Gerçekçi senaryo:
// - Gelir: 500K/ay (servisler) = 6M/yıl
// - Sabit Giderler: 180K/ay = 2.16M/yıl
// - Net Kar: 6M - 2.16M = 3.84M/yıl (değişken maliyetler öncesi)
// - Değişken Maliyet (parçalar): servislerde partsCost olarak kaydediliyor
const expenseCategories = [
  { name: 'Personel Maaşı', avgAmount: 85000 }, // 7 kişi x ~12K ortalama
  { name: 'Kira', avgAmount: 25000 },
  { name: 'Elektrik', avgAmount: 6500 },
  { name: 'Su', avgAmount: 1200 },
  { name: 'Doğalgaz', avgAmount: 2800 },
  { name: 'İnternet', avgAmount: 1200 },
  { name: 'Telefon', avgAmount: 1800 },
  { name: 'Stok Yenileme', avgAmount: 35000 }, // Stok alımları (aylık)
  { name: 'Yakıt', avgAmount: 8500 },
  { name: 'Sigorta', avgAmount: 4500 },
  { name: 'Vergi ve SGK', avgAmount: 25000 },
  { name: 'Araç Bakım', avgAmount: 3500 },
]

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePhoneNumber() {
  const prefix = ['505', '506', '507', '530', '531', '532', '533', '534', '535', '536', '537', '538', '539', '541', '542', '543', '544', '545', '546', '547', '548', '549']
  return `0${randomElement(prefix)}${randomInt(100, 999)}${randomInt(10, 99)}${randomInt(10, 99)}`
}

async function main() {
  console.log('🚀 Veritabanı temizleniyor...')
  
  // PostgreSQL için doğru silme sırası (child -> parent)
  await prisma.servicePhoto.deleteMany()
  await prisma.serviceNote.deleteMany()
  await prisma.serviceOperation.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.stockMovement.deleteMany() // Stock'tan önce
  await prisma.periodicDevice.deleteMany()
  await prisma.periodicMaintenance.deleteMany()
  await prisma.cashTransaction.deleteMany()
  await prisma.service.deleteMany()
  await prisma.stock.deleteMany() // StockMovement'tan sonra
  await prisma.customer.deleteMany()
  await prisma.category.deleteMany()
  await prisma.paymentType.deleteMany()
  await prisma.user.deleteMany()

  console.log('👥 Kullanıcılar oluşturuluyor...')
  
  // Sahip - Gökhan Bozkurt
  const admin = await prisma.user.create({
    data: {
      email: 'gokhan@otobeyaz.com',
      password: 'admin123',
      name: 'Gökhan Bozkurt',
      phone: '05551234567',
      position: 'Sahip/Yönetici',
      status: true,
    }
  })

  // Sekreter - Pepee
  const sekreter = await prisma.user.create({
    data: {
      email: 'pepee@otobeyaz.com',
      password: 'pepee123',
      name: 'Pepee',
      phone: '05551234568',
      position: 'Sekreter',
      status: true,
    }
  })

  // Teknisyenler - Çizgi Film Karakterleri
  const technicians = await Promise.all([
    prisma.user.create({
      data: {
        email: 'shiro@otobeyaz.com',
        password: 'tech123',
        name: 'Shiro',
        phone: '05551234569',
        position: 'Usta Teknisyen',
        status: true,
      }
    }),
    prisma.user.create({
      data: {
        email: 'bee@otobeyaz.com',
        password: 'tech123',
        name: 'Bee',
        phone: '05551234570',
        position: 'Teknisyen',
        status: true,
      }
    }),
    prisma.user.create({
      data: {
        email: 'koko@otobeyaz.com',
        password: 'tech123',
        name: 'Koko',
        phone: '05551234571',
        position: 'Teknisyen',
        status: true,
      }
    }),
    prisma.user.create({
      data: {
        email: 'zizi@otobeyaz.com',
        password: 'tech123',
        name: 'Zizi',
        phone: '05551234572',
        position: 'Teknisyen',
        status: true,
      }
    }),
    prisma.user.create({
      data: {
        email: 'lolo@otobeyaz.com',
        password: 'tech123',
        name: 'Lolo',
        phone: '05551234573',
        position: 'Teknisyen',
        status: true,
      }
    }),
  ])

  console.log('📋 Kategoriler oluşturuluyor...')
  
  const categories = await Promise.all([
    prisma.category.create({ data: { type: 'customer', name: 'Bireysel Müşteri' } }),
    prisma.category.create({ data: { type: 'customer', name: 'Kurumsal Müşteri' } }),
    prisma.category.create({ data: { type: 'stock', name: 'Çamaşır Makinası Parçaları' } }),
    prisma.category.create({ data: { type: 'stock', name: 'Buzdolabı Parçaları' } }),
    prisma.category.create({ data: { type: 'stock', name: 'Kombi Parçaları' } }),
  ])

  console.log('💰 Ödeme tipleri oluşturuluyor...')
  
  await Promise.all([
    prisma.paymentType.create({ data: { name: 'Servis Tahsilatı', direction: 'incoming' } }),
    prisma.paymentType.create({ data: { name: 'Maaş Ödemesi', direction: 'outgoing' } }),
    prisma.paymentType.create({ data: { name: 'Kira Ödemesi', direction: 'outgoing' } }),
    prisma.paymentType.create({ data: { name: 'Malzeme Alımı', direction: 'outgoing' } }),
  ])

  console.log('👨‍👩‍👧‍👦 Müşteriler oluşturuluyor...')
  
  const customers: any[] = []
  for (let i = 0; i < 50; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: randomElement(turkishNames),
        phone: generatePhoneNumber(),
        phone2: Math.random() > 0.7 ? generatePhoneNumber() : undefined,
        email: Math.random() > 0.5 ? `musteri${i}@email.com` : undefined,
        address: `${randomElement(['Atatürk', 'İnönü', 'Cumhuriyet', 'Bağdat', 'İstiklal'])} Caddesi No: ${randomInt(1, 150)}`,
        city: 'İstanbul',
        district: randomElement(istanbulDistricts),
        type: Math.random() > 0.85 ? 'corporate' : 'individual',
        categoryId: randomElement(categories.filter(c => c.type === 'customer')).id,
      }
    })
    customers.push(customer)
  }

  console.log('📦 Stok kalemleri oluşturuluyor...')
  
  const stocks: any[] = []
  for (const item of stockItems) {
    const stock = await prisma.stock.create({
      data: {
        code: item.code,
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: randomInt(5, 50),
        minQuantity: randomInt(2, 10),
        categoryId: randomElement(categories.filter(c => c.type === 'stock')).id,
        brands: JSON.stringify(item.brands),
        status: true,
      }
    })
    stocks.push(stock)
  }

  console.log('🔧 Servisler oluşturuluyor (1 aylık veri)...')
  
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1) // 1 ay geriye
  const endDate = new Date()

  const services: any[] = []
  const serviceCount = 150 // 1 ayda 150 servis ~ günde 5 servis

  for (let i = 0; i < serviceCount; i++) {
    const brand = randomElement(Object.keys(turkishCarBrands))
    const deviceType = randomElement(turkishCarBrands[brand])
    const problemData = randomElement(commonProblems[deviceType] || commonProblems['Çamaşır Makinası'])
    const customer = randomElement(customers)
    const technician = randomElement(technicians)
    const receivedDate = randomDate(startDate, endDate)
    const isCompleted = Math.random() > 0.15 // %85 tamamlanmış
    const deliveryDate = isCompleted ? new Date(receivedDate.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000) : undefined
    
    const laborCost = problemData.labor * (1.2 + Math.random() * 0.8) // %20-100 artış
    const partsCost = problemData.parts * (1.2 + Math.random() * 0.8)
    const totalCost = laborCost + partsCost

    const service = await prisma.service.create({
      data: {
        serviceNo: `${100000 + i}`,
        customerId: customer.id,
        technicianId: technician.id,
        operatorId: admin.id,
        deviceBrand: brand,
        deviceType: deviceType,
        deviceModel: `${deviceType.substring(0, 3).toUpperCase()}-${randomInt(1000, 9999)}`,
        serialNo: `SN${randomInt(100000, 999999)}`,
        problem: problemData.problem,
        solution: isCompleted ? problemData.solution : undefined,
        diagnosis: isCompleted ? `${problemData.problem} tespit edildi. ${problemData.solution}` : undefined,
        status: isCompleted ? (Math.random() > 0.9 ? 'cancelled' : 'completed') : (Math.random() > 0.5 ? 'in_progress' : 'pending'),
        priority: Math.random() > 0.8 ? 'urgent' : (Math.random() > 0.5 ? 'normal' : 'low'),
        receivedDate,
        deliveryDate,
        laborCost,
        partsCost,
        totalCost,
        paymentStatus: isCompleted ? (Math.random() > 0.05 ? 'paid' : 'unpaid') : 'unpaid', // %95 ödeniyor
        availableTime: `${randomInt(9, 17)}:00 - ${randomInt(18, 20)}:00`,
        warrantyEnd: Math.random() > 0.6 ? new Date(receivedDate.getTime() + 90 * 24 * 60 * 60 * 1000) : undefined,
      }
    })
    services.push(service)

    // Stok hareketi ekle (eğer parça kullanıldıysa)
    if (isCompleted && partsCost > 0) {
      const relatedStock = stocks.find(s => s.categoryId === categories.find(c => c.name.includes(deviceType))?.id)
      if (relatedStock) {
        await prisma.stockMovement.create({
          data: {
            stockId: relatedStock.id,
            type: 'out',
            quantity: randomInt(1, 3),
            serviceId: service.id,
            unitPrice: relatedStock.price,
            totalPrice: partsCost,
            date: receivedDate,
            notes: `${service.serviceNo} numaralı servis için kullanıldı`,
          }
        })
      }
    }

    // Ödeme ekle (eğer ödenmiş ise)
    if (service.paymentStatus === 'paid') {
      await prisma.cashTransaction.create({
        data: {
          type: 'income',
          amount: totalCost,
          paymentMethod: randomElement(['cash', 'card', 'transfer']),
          relatedServiceId: service.id,
          technicianId: technician.id,
          description: `${service.serviceNo} - ${customer.name} - ${deviceType} ${problemData.problem}`,
          transactionDate: deliveryDate || receivedDate,
        }
      })
    }
  }

  console.log('💸 Gider kayıtları oluşturuluyor...')
  
  // Bu ay için giderler
  const currentMonth = new Date()
  
  for (const expense of expenseCategories) {
    const amount = expense.avgAmount * (0.9 + Math.random() * 0.2) // ±%10 varyasyon
    await prisma.cashTransaction.create({
      data: {
        type: 'expense',
        amount,
        paymentMethod: expense.name === 'Personel Maaşı' ? 'transfer' : randomElement(['cash', 'transfer']),
        description: `${expense.name} - ${currentMonth.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}`,
        transactionDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), randomInt(1, 28)),
      }
    })
  }

  console.log('🔄 Periyodik bakım sözleşmeleri oluşturuluyor...')
  
  // Kurumsal müşteriler için periyodik bakım sözleşmeleri
  const corporateCustomers = customers.filter(c => c.type === 'corporate')
  const periodicMaintenances: any[] = []
  
  for (let i = 0; i < Math.min(5, corporateCustomers.length); i++) {
    const customer = corporateCustomers[i]
    const contractStartDate = randomDate(startDate, new Date(endDate.getTime() - 180 * 24 * 60 * 60 * 1000))
    const contractEndDate = new Date(contractStartDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    const deviceCounts = [5, 7, 3, 5, 10, 15, 8, 12, 6, 9, 18, 20]
    const deviceCount = randomElement(deviceCounts)
    const pricePerMaintenance = randomInt(1200, 2000)
    
    const periodicMaintenance = await prisma.periodicMaintenance.create({
      data: {
        customerId: customer.id,
        companyName: customer.name,
        phone: customer.phone,
        address: customer.address || `${customer.district}, ${customer.city}`,
        startDate: contractStartDate,
        endDate: contractEndDate,
        maintenanceCount: deviceCount * 4, // Yılda 4 bakım
        status: true,
        partsIncluded: Math.random() > 0.5,
        pricePerMaintenance,
      }
    })
    periodicMaintenances.push(periodicMaintenance)
    
    // Her sözleşme için cihazlar ekle
    const brands = Object.keys(turkishCarBrands)
    for (let j = 0; j < deviceCount; j++) {
      const brand = randomElement(brands)
      const deviceType = randomElement(turkishCarBrands[brand])
      
      await prisma.periodicDevice.create({
        data: {
          periodicMaintenanceId: periodicMaintenance.id,
          brand,
          type: deviceType,
          model: `${deviceType.substring(0, 3).toUpperCase()}-${randomInt(1000, 9999)}`,
          serialNo: `SN${randomInt(100000, 999999)}`,
          location: `${randomElement(['Üretim', 'Yemekhane', 'Ofis', 'Depo', 'Satış'])} Katı`,
        }
      })
    }
    
    // Periyodik bakım için gelir kaydı (bu ay)
    await prisma.cashTransaction.create({
      data: {
        type: 'income',
        amount: pricePerMaintenance * deviceCount,
        paymentMethod: 'transfer',
        description: `Periyodik Bakım - ${customer.name} - ${deviceCount} Cihaz`,
        transactionDate: new Date(),
      }
    })
  }

  console.log('📄 Faturalar oluşturuluyor...')
  
  // Tamamlanan servisler için fatura oluştur
  const completedServices = services.filter(s => s.status === 'completed' && s.paymentStatus === 'paid').slice(0, 50)
  
  for (let i = 0; i < completedServices.length; i++) {
    const service = completedServices[i]
    const subtotal = service.totalCost / 1.20 // KDV hariç
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: `2024-${String(i + 1).padStart(3, '0')}`,
        customerId: service.customerId,
        issueDate: service.receivedDate,
        dueDate: new Date(service.receivedDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal,
        vatRate: 20,
        discount: 0,
        total: service.totalCost,
        status: Math.random() > 0.1 ? 'paid' : 'open',
      }
    })

    // Ödeme kaydı
    if (invoice.status === 'paid') {
      await prisma.payment.create({
        data: {
          customerId: service.customerId,
          invoiceId: invoice.id,
          method: randomElement(['cash', 'card', 'transfer']),
          amount: invoice.total,
          fee: 0,
        }
      })
    }
  }

  console.log('📊 İstatistikler:')
  console.log(`✅ ${customers.length} müşteri oluşturuldu`)
  console.log(`✅ ${stocks.length} stok kalemi oluşturuldu`)
  console.log(`✅ ${services.length} servis kaydı oluşturuldu`)
  console.log(`✅ ${periodicMaintenances.length} periyodik bakım sözleşmesi oluşturuldu`)
  console.log(`✅ ${12 * expenseCategories.length} gider kaydı oluşturuldu`)
  console.log(`✅ ${completedServices.length} fatura oluşturuldu`)
  
  const totalIncome = await prisma.cashTransaction.aggregate({
    where: { type: 'income' },
    _sum: { amount: true }
  })
  
  const totalExpense = await prisma.cashTransaction.aggregate({
    where: { type: 'expense' },
    _sum: { amount: true }
  })
  
  console.log(`\n💰 Toplam Gelir: ₺${totalIncome._sum.amount?.toLocaleString('tr-TR') || 0}`)
  console.log(`💸 Toplam Gider: ₺${totalExpense._sum.amount?.toLocaleString('tr-TR') || 0}`)
  console.log(`📈 Net Kar: ₺${((totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0)).toLocaleString('tr-TR')}`)
  
  console.log('\n🎉 Veritabanı başarıyla dolduruldu!')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

