export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">AYARLAR</h1>
      </div>

      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Genel Ayarlar</h2>
        <p className="text-gray-600 mb-6">
          Sistem ayarları, kategori yönetimi, ödeme türleri ve diğer
          yapılandırmalar buradan yapılacaktır.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Kategori Yönetimi</h3>
            <p className="text-sm text-gray-600">
              Müşteri ve ürün kategorilerini yönetin
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Ödeme Türleri</h3>
            <p className="text-sm text-gray-600">
              Kasa ödeme türlerini düzenleyin
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Firma Bilgileri</h3>
            <p className="text-sm text-gray-600">
              Firma adı, logo ve iletişim bilgileri
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Kullanıcı Yönetimi</h3>
            <p className="text-sm text-gray-600">Personel yetkilendirmeleri</p>
          </div>
        </div>
      </div>
    </div>
  );
}

