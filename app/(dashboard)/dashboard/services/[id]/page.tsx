"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Wrench, 
  AlertCircle,
  Clock,
  Shield,
  Camera,
  FileText,
  DollarSign,
  CheckCircle
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

interface ServiceOperation {
  id: string;
  operationDate: string;
  operatorName: string;
  operationName: string;
  description?: string;
}

interface ServiceNote {
  id: string;
  noteDate: string;
  noteBy: string;
  content: string;
}

interface ServicePhoto {
  id: string;
  photoUrl: string;
  caption?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [operations, setOperations] = useState<ServiceOperation[]>([]);
  const [notes, setNotes] = useState<ServiceNote[]>([]);
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

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

    const mockOperations: ServiceOperation[] = [
      {
        id: "1",
        operationDate: "2025-01-07T12:00:00Z",
        operatorName: "Gökhan Bozkurt",
        operationName: "Teknisyen Yönlendir",
        description: "Teknisyen : Hakan\nGidiş Tarihi : 08.10.2025"
      },
      {
        id: "2",
        operationDate: "2025-01-07T11:59:00Z",
        operatorName: "Gökhan Bozkurt",
        operationName: "Teknisyen Yönlendir",
        description: "Teknisyen : Hakan\nGidiş Tarihi : 07.10.2025"
      }
    ];

    const mockNotes: ServiceNote[] = [
      {
        id: "1",
        noteDate: "2025-01-07T12:30:00Z",
        noteBy: "Hakan Yılmaz",
        content: "Müşteri ile görüşüldü, randevu alındı."
      }
    ];

    const mockPhotos: ServicePhoto[] = [
      {
        id: "1",
        photoUrl: "/api/placeholder/300/200",
        caption: "Cihaz genel görünüm"
      }
    ];

    setService(mockService);
    setOperations(mockOperations);
    setNotes(mockNotes);
    setPhotos(mockPhotos);
    setLoading(false);
  }, [params.id]);

  const handleSave = () => {
    // Kaydetme işlemi
    setEditing(false);
    alert("Değişiklikler kaydedildi!");
  };

  const handleStatusChange = (newStatus: string) => {
    if (service) {
      setService({ ...service, status: newStatus });
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
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Servis Detayı</h1>
            <p className="text-gray-600">Servis No: {service.serviceNo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "info", label: "Servis Bilgileri", icon: FileText },
            { id: "operations", label: "Yapılan İşlemler", icon: Wrench },
            { id: "payments", label: "Para Hareketleri", icon: DollarSign },
            { id: "notes", label: "Servis Notları", icon: FileText },
            { id: "photos", label: "Fotoğraflar", icon: Camera }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sol Kolon */}
          <div className="space-y-6">
            {/* Servis Özeti */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Servis Özeti
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıt Tarihi:</span>
                  <span className="font-medium">
                    {new Date(service.receivedDate).toLocaleDateString('tr-TR')} - {new Date(service.receivedDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servis Kaynağı:</span>
                  <span className="font-medium">{service.serviceSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operatör:</span>
                  <span className="font-medium">Gökhan Bozkurt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <select
                    value={service.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={!editing}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Teknisyen Yönlendir">Teknisyen Yönlendir</option>
                    <option value="PARÇA SİPARİŞİ VERİLDİ">Parça Siparişi Verildi</option>
                    <option value="Atölyeye Alındı">Atölyeye Alındı</option>
                    <option value="Haber Verecek">Haber Verecek</option>
                    <option value="Servisi Sonlandır">Servisi Sonlandır</option>
                    <option value="Müşteri İptal Etti">Müşteri İptal Etti</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Müşteri Bilgileri */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Müşteri Bilgisi
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad</label>
                  <input
                    type="text"
                    value={service.customer.name}
                    onChange={(e) => setService({...service, customer: {...service.customer, name: e.target.value}})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={service.customer.phone}
                    onChange={(e) => setService({...service, customer: {...service.customer, phone: e.target.value}})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adres</label>
                  <textarea
                    value={service.customer.address || ""}
                    onChange={(e) => setService({...service, customer: {...service.customer, address: e.target.value}})}
                    disabled={!editing}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şehir</label>
                    <input
                      type="text"
                      value={service.customer.city || ""}
                      onChange={(e) => setService({...service, customer: {...service.customer, city: e.target.value}})}
                      disabled={!editing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">İlçe</label>
                    <input
                      type="text"
                      value={service.customer.district || ""}
                      onChange={(e) => setService({...service, customer: {...service.customer, district: e.target.value}})}
                      disabled={!editing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Müsait Olma Zamanı</label>
                  <input
                    type="text"
                    value={service.availableTime || ""}
                    onChange={(e) => setService({...service, availableTime: e.target.value})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Operatör Notu</label>
                  <textarea
                    value={service.operatorNote || ""}
                    onChange={(e) => setService({...service, operatorNote: e.target.value})}
                    disabled={!editing}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                Cihaz Bilgisi
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cihaz Markası</label>
                  <select
                    value={service.deviceBrand || ""}
                    onChange={(e) => setService({...service, deviceBrand: e.target.value})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cihaz Türü</label>
                  <select
                    value={service.deviceType || ""}
                    onChange={(e) => setService({...service, deviceType: e.target.value})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kombi">Kombi</option>
                    <option value="Çamaşır Makinası">Çamaşır Makinası</option>
                    <option value="Bulaşık Makinası">Bulaşık Makinası</option>
                    <option value="Buzdolabı">Buzdolabı</option>
                    <option value="Klima">Klima</option>
                    <option value="Fırın">Fırın</option>
                    <option value="Mikrodalga">Mikrodalga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cihaz Modeli</label>
                  <input
                    type="text"
                    value={service.deviceModel || ""}
                    onChange={(e) => setService({...service, deviceModel: e.target.value})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cihaz Arızası</label>
                  <textarea
                    value={service.problem || ""}
                    onChange={(e) => setService({...service, problem: e.target.value})}
                    disabled={!editing}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Garanti Bitiş</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={service.warrantyEnd ? new Date(service.warrantyEnd).toISOString().split('T')[0] : ""}
                      onChange={(e) => setService({...service, warrantyEnd: e.target.value || undefined})}
                      disabled={!editing}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    {service.warrantyDaysLeft && (
                      <span className="text-sm text-green-600 font-medium">
                        ({service.warrantyDaysLeft} Gün Kaldı)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Maliyet Bilgileri */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Maliyet Bilgileri
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İşçilik Maliyeti</label>
                  <input
                    type="number"
                    value={service.laborCost || 0}
                    onChange={(e) => setService({...service, laborCost: parseFloat(e.target.value) || 0})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parça Maliyeti</label>
                  <input
                    type="number"
                    value={service.partsCost || 0}
                    onChange={(e) => setService({...service, partsCost: parseFloat(e.target.value) || 0})}
                    disabled={!editing}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Toplam Tutar:</span>
                    <span className="text-green-600">
                      ₺{((service.laborCost || 0) + (service.partsCost || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yapılan İşlemler Tab */}
      {activeTab === "operations" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Serviste Yapılan İşlemler</h3>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                İşlem Ekle
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TARİH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İŞLEMİ YAPAN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İŞLEM ADI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AÇIKLAMA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {operations.map((operation) => (
                  <tr key={operation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(operation.operationDate).toLocaleDateString('tr-TR')} {new Date(operation.operationDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operation.operatorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {operation.operationName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <pre className="whitespace-pre-wrap">{operation.description}</pre>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Para Hareketleri Tab */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Para Hareketleri</h3>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Ödeme Ekle
              </button>
            </div>
          </div>
          <div className="p-6 text-center text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz bir para tahsilatı yapmadınız.</p>
          </div>
        </div>
      )}

      {/* Servis Notları Tab */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Servis Notları</h3>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Not Ekle
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{note.noteBy}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(note.noteDate).toLocaleDateString('tr-TR')} {new Date(note.noteDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{note.content}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Not Bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fotoğraflar Tab */}
      {activeTab === "photos" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fotoğraflar</h3>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Fotoğraf Ekle
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600">{photo.caption || "Fotoğraf"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alt Butonlar */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <X className="w-4 h-4 mr-2" />
          Servisi Sil
        </button>
        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <CheckCircle className="w-4 h-4 mr-2" />
          Servisi Güncelle
        </button>
      </div>
    </div>
  );
}
