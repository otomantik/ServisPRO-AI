"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCashTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    type: "income",
    amount: 0,
    paymentMethod: "cash",
    paymentTypeId: "",
    paymentStatus: "completed",
    relatedServiceId: "",
    technicianId: "",
    description: "",
    transactionDate: new Date().toISOString().split('T')[0],
    installmentCount: 1,
  });

  useEffect(() => {
    // Ödeme türlerini, kullanıcıları ve servisleri yükle
    Promise.all([
      fetch("/api/payment-types").then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
      fetch("/api/services").then(res => res.json())
    ]).then(([paymentTypesData, usersData, servicesData]) => {
      setPaymentTypes(paymentTypesData);
      setUsers(usersData);
      setServices(servicesData);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cash-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          installmentCount: Number(formData.installmentCount),
        }),
      });

      if (res.ok) {
        router.push("/dashboard/cash");
      } else {
        alert("Hata oluştu!");
      }
    } catch (error) {
      alert("Hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">YENİ KASA HAREKETİ</h1>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">İşlem Tipi *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="income">Gelir</option>
                <option value="expense">Gider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tutar (₺) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ödeme Türü *</label>
              <select
                value={formData.paymentTypeId}
                onChange={(e) => setFormData({ ...formData, paymentTypeId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="">Ödeme Türü Seçin</option>
                {paymentTypes
                  .filter((pt: any) => pt.direction === formData.type)
                  .map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ödeme Şekli *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="cash">Nakit</option>
                <option value="card">Kredi Kartı</option>
                <option value="transfer">Havale/EFT</option>
                <option value="check">Çek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ödeme Durumu</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="completed">Tamamlandı</option>
                <option value="pending">Beklemede</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tarih *</label>
              <input
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">İlgili Servis</label>
              <select
                value={formData.relatedServiceId}
                onChange={(e) => setFormData({ ...formData, relatedServiceId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="">Servis Seçin (Opsiyonel)</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceNo} - {service.customer?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Personel</label>
              <select
                value={formData.technicianId}
                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="">Personel Seçin (Opsiyonel)</option>
                {users.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Taksit Sayısı</label>
              <input
                type="number"
                value={formData.installmentCount}
                onChange={(e) => setFormData({ ...formData, installmentCount: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="1"
                max="12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              rows={3}
              placeholder="İşlem hakkında detaylı açıklama..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kasa Hareketi Oluştur"}
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
