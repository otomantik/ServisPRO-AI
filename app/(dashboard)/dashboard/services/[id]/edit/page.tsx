"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Wrench, 
  AlertCircle,
  Clock,
  Shield,
  DollarSign
} from "lucide-react";

interface Service {
  id: string;
  serviceNo: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
    city?: string;
    district?: string;
  };
  technician?: {
    name: string;
  };
  deviceBrand?: string;
  deviceType?: string;
  deviceModel?: string;
  problem?: string;
  status: string;
  receivedDate: string;
  totalCost: number;
  serviceSource?: string;
  operatorNote?: string;
  availableTime?: string;
  warrantyEnd?: string;
  warrantyDaysLeft?: number;
  laborCost?: number;
  partsCost?: number;
  paymentStatus?: string;
}

export default function ServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Örnek veri - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockService: Service = {
      id: params.id as string,
      serviceNo: "577677",
      customer: {
        name: "Taner Çelik",
        phone: "0(536) 619-7344",
        address: "Gençlik Mh. Sevlap Evleri 2. Ara Sk. No:18 D:12",
        city: "Lüleburgaz",
        district: "Merkez"
      },
      technician: { name: "Hakan Yılmaz" },
      deviceBrand: "ECA",
      deviceType: "Kombi",
      deviceModel: "2500? Bakım",
      problem: "2500? Bakım",
      status: "Teknisyen Yönlendir",
      receivedDate: "2025-01-07T11:56:00Z",
      totalCost: 750,
      serviceSource: "0(532) 379-9451",
      operatorNote: "Acil müdahale gerekli",
      availableTime: "08.10.2025 - 09:00 ile 18:00 Arası",
      warrantyEnd: "2026-01-07T00:00:00Z",
      warrantyDaysLeft: 364,
      laborCost: 300,
      partsCost: 450,
      paymentStatus: "unpaid"
    };

    setService(mockService);
    setLoading(false);
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş gecikme
      
      alert("Değişiklikler başarıyla kaydedildi!");
      router.push(`/dashboard/services/${params.id}`);
    } catch (error) {
      alert("Kaydetme sırasında bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Değişiklikler kaydedilmedi. Çıkmak istediğinizden emin misiniz?")) {
      router.push(`/dashboard/services/${params.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Servis bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Servis Düzenle</h1>
            <p className="text-gray-600">Servis No: {service.serviceNo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            İptal
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-6">
          {/* Servis Özeti */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Servis Özeti
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servis Durumu</label>
                <select
                  value={service.status}
                  onChange={(e) => setService({...service, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Teknisyen Yönlendir">Teknisyen Yönlendir</option>
                  <option value="PARÇA SİPARİŞİ VERİLDİ">Parça Siparişi Verildi</option>
                  <option value="Atölyeye Alındı">Atölyeye Alındı</option>
                  <option value="Haber Verecek">Haber Verecek</option>
                  <option value="Servisi Sonlandır">Servisi Sonlandır</option>
                  <option value="Müşteri İptal Etti">Müşteri İptal Etti</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servis Kaynağı</label>
                <input
                  type="text"
                  value={service.serviceSource || ""}
                  onChange={(e) => setService({...service, serviceSource: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operatör Notu</label>
                <textarea
                  value={service.operatorNote || ""}
                  onChange={(e) => setService({...service, operatorNote: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Müşteri Bilgileri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={service.customer.name}
                  onChange={(e) => setService({...service, customer: {...service.customer, name: e.target.value}})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="text"
                  value={service.customer.phone}
                  onChange={(e) => setService({...service, customer: {...service.customer, phone: e.target.value}})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea
                  value={service.customer.address || ""}
                  onChange={(e) => setService({...service, customer: {...service.customer, address: e.target.value}})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                  <input
                    type="text"
                    value={service.customer.city || ""}
                    onChange={(e) => setService({...service, customer: {...service.customer, city: e.target.value}})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={service.customer.district || ""}
                    onChange={(e) => setService({...service, customer: {...service.customer, district: e.target.value}})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müsait Olma Zamanı</label>
                <input
                  type="text"
                  value={service.availableTime || ""}
                  onChange={(e) => setService({...service, availableTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Cihaz Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Cihaz Bilgileri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cihaz Markası</label>
                <select
                  value={service.deviceBrand || ""}
                  onChange={(e) => setService({...service, deviceBrand: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="ECA">ECA</option>
                  <option value="Buderus">Buderus</option>
                  <option value="Bosch">Bosch</option>
                  <option value="Demirdöküm">Demirdöküm</option>
                  <option value="Arçelik">Arçelik</option>
                  <option value="Vestel">Vestel</option>
                  <option value="Beko">Beko</option>
                  <option value="Profilo">Profilo</option>
                  <option value="Altus">Altus</option>
                  <option value="Regal">Regal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cihaz Türü</label>
                <select
                  value={service.deviceType || ""}
                  onChange={(e) => setService({...service, deviceType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="Kombi">Kombi</option>
                  <option value="Çamaşır Makinası">Çamaşır Makinası</option>
                  <option value="Bulaşık Makinası">Bulaşık Makinası</option>
                  <option value="Buzdolabı">Buzdolabı</option>
                  <option value="Klima">Klima</option>
                  <option value="Fırın">Fırın</option>
                  <option value="Mikrodalga">Mikrodalga</option>
                  <option value="Aspiratör">Aspiratör</option>
                  <option value="Kurutma Makinası">Kurutma Makinası</option>
                  <option value="Su Isıtıcısı">Su Isıtıcısı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cihaz Modeli</label>
                <input
                  type="text"
                  value={service.deviceModel || ""}
                  onChange={(e) => setService({...service, deviceModel: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cihaz Arızası</label>
                <textarea
                  value={service.problem || ""}
                  onChange={(e) => setService({...service, problem: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Garanti Bitiş Tarihi</label>
                <input
                  type="date"
                  value={service.warrantyEnd ? new Date(service.warrantyEnd).toISOString().split('T')[0] : ""}
                  onChange={(e) => setService({...service, warrantyEnd: e.target.value || undefined})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Maliyet Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Maliyet Bilgileri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İşçilik Maliyeti (₺)</label>
                <input
                  type="text"
                  value={(service.laborCost || 0) === 0 ? '' : (service.laborCost || 0).toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^0+/, '') || '0';
                    setService({...service, laborCost: parseFloat(value) || 0});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parça Maliyeti (₺)</label>
                <input
                  type="text"
                  value={(service.partsCost || 0) === 0 ? '' : (service.partsCost || 0).toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^0+/, '') || '0';
                    setService({...service, partsCost: parseFloat(value) || 0});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Toplam Tutar:</span>
                  <span className="text-green-600">
                    ₺{((service.laborCost || 0) + (service.partsCost || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Durumu</label>
                <select
                  value={service.paymentStatus || "unpaid"}
                  onChange={(e) => setService({...service, paymentStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unpaid">Ödenmedi</option>
                  <option value="paid">Ödendi</option>
                  <option value="partial">Kısmi Ödeme</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teknisyen Ataması */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Teknisyen Ataması
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atanmış Teknisyen</label>
              <select
                value={service.technician?.name || ""}
                onChange={(e) => setService({...service, technician: {name: e.target.value}})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Teknisyen Seçiniz</option>
                <option value="Hakan Yılmaz">Hakan Yılmaz</option>
                <option value="Mehmet Kaya">Mehmet Kaya</option>
                <option value="Ali Demir">Ali Demir</option>
                <option value="Fatma Özkan">Fatma Özkan</option>
                <option value="David Wilson">David Wilson</option>
                <option value="Pierre Martin">Pierre Martin</option>
                <option value="Takeshi Sato">Takeshi Sato</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Değişiklikleri İptal Et
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}
