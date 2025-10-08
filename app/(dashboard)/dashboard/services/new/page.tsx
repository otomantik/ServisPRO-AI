"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    technicianId: "",
    deviceBrand: "",
    deviceType: "",
    deviceModel: "",
    serialNo: "",
    problem: "",
    priority: "normal",
    laborCost: 0,
    partsCost: 0,
  });

  useEffect(() => {
    // Müşterileri ve teknisyenleri yükle
    Promise.all([
      fetch("/api/customers?limit=100").then(res => res.json()),
      fetch("/api/users").then(res => res.json())
    ]).then(([customersData, usersData]) => {
      setCustomers(customersData.customers || customersData || []);
      setTechnicians((usersData || []).filter((user: any) => user.position === "Teknisyen"));
    }).catch(err => {
      console.error("Failed to load data", err);
      showError("Veriler yüklenirken hata oluştu");
      setCustomers([]);
      setTechnicians([]);
    });
  }, []);

  // Baştaki sıfırları kaldıran ve geçerli sayı döndüren fonksiyon
  const parsePrice = (value: string): number => {
    if (!value || value === '') return 0;
    // Baştaki sıfırları kaldır ve sayıya çevir
    const cleanValue = value.replace(/^0+/, '') || '0';
    return parseFloat(cleanValue) || 0;
  };

  const handlePriceChange = (field: 'laborCost' | 'partsCost', value: string) => {
    const numericValue = parsePrice(value);
    setFormData({ ...formData, [field]: numericValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form verilerini temizle - baştaki sıfırları kaldır
      const cleanFormData = {
        ...formData,
        laborCost: parsePrice(formData.laborCost.toString()),
        partsCost: parsePrice(formData.partsCost.toString())
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanFormData),
      });

      if (res.ok) {
        showSuccess("Servis kaydı oluşturuldu!");
        router.push("/dashboard/services");
      } else {
        const errorData = await res.json();
        showError(errorData.message || "Servis kaydedilemedi!");
      }
    } catch (error) {
      console.error("Service creation error", error);
      showError("Bağlantı hatası oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">YENİ SERVİS</h1>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Müşteri *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="">Müşteri Seçin</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teknisyen *</label>
              <select
                value={formData.technicianId}
                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="">Teknisyen Seçin</option>
                {technicians.map((tech: any) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cihaz Markası</label>
              <select
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="">Marka Seçin</option>
                <option value="Arçelik">Arçelik</option>
                <option value="Bosch">Bosch</option>
                <option value="Siemens">Siemens</option>
                <option value="Vestel">Vestel</option>
                <option value="Beko">Beko</option>
                <option value="Samsung">Samsung</option>
                <option value="LG">LG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cihaz Tipi</label>
              <select
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="">Tip Seçin</option>
                <option value="Bulaşık Makinesi">Bulaşık Makinesi</option>
                <option value="Çamaşır Makinesi">Çamaşır Makinesi</option>
                <option value="Buzdolabı">Buzdolabı</option>
                <option value="Fırın">Fırın</option>
                <option value="Klima">Klima</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                type="text"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Seri No</label>
              <input
                type="text"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Öncelik</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="low">Düşük</option>
                <option value="normal">Normal</option>
                <option value="urgent">Acil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">İşçilik Ücreti (₺)</label>
              <input
                type="text"
                value={formData.laborCost === 0 ? '' : formData.laborCost.toString()}
                onChange={(e) => handlePriceChange('laborCost', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                placeholder="0"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parça Ücreti (₺)</label>
              <input
                type="text"
                value={formData.partsCost === 0 ? '' : formData.partsCost.toString()}
                onChange={(e) => handlePriceChange('partsCost', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                placeholder="0"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Problem Açıklaması</label>
            <textarea
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              rows={4}
              placeholder="Müşterinin belirttiği problem..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Servis Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
