"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
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
      logger.error("Failed to load data", err, { context: 'NewServicePage' });
      showError("Veriler yüklenirken hata oluştu");
      setCustomers([]);
      setTechnicians([]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showSuccess("Servis kaydı oluşturuldu!");
        router.push("/dashboard/services");
      } else {
        showError("Servis kaydedilemedi!");
      }
    } catch (error) {
      logger.error("Service creation error", error, { context: 'NewServicePage' });
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
                type="number"
                value={formData.laborCost}
                onChange={(e) => setFormData({ ...formData, laborCost: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parça Ücreti (₺)</label>
              <input
                type="number"
                value={formData.partsCost}
                onChange={(e) => setFormData({ ...formData, partsCost: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                step="0.01"
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
