"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "123456",
    phone: "",
    phone2: "",
    address: "",
    city: "Kırklareli",
    district: "Lüleburgaz",
    position: "Teknisyen",
    tcNo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/staff");
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
        <h1 className="text-2xl font-bold text-[#3d3d3d]">YENİ PERSONEL</h1>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad Soyad *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">E-posta *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefon *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                placeholder="0(5XX) XXX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefon 2</label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                placeholder="0(5XX) XXX-XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pozisyon *</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              >
                <option value="Patron">Patron</option>
                <option value="Teknisyen">Teknisyen</option>
                <option value="Operatör">Operatör</option>
                <option value="Muhasebe">Muhasebe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">TC No</label>
              <input
                type="text"
                value={formData.tcNo}
                onChange={(e) => setFormData({ ...formData, tcNo: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                placeholder="12345678901"
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Şehir</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="Kırklareli">Kırklareli</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Edirne">Edirne</option>
                <option value="Tekirdağ">Tekirdağ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">İlçe</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adres</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Not:</strong> Varsayılan şifre "123456" olarak ayarlanmıştır. 
              Personel ilk giriş yaptığında şifresini değiştirmelidir.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Personel Oluştur"}
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
