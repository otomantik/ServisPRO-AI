"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  type: string;
};

export default function NewStockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: 0,
    unit: "Adet",
    quantity: 0,
    minQuantity: 5,
    description: "",
  });

  useEffect(() => {
    // Kategorileri yükle
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data.filter((cat: any) => cat.type === "stock")));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/stock");
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
        <h1 className="text-2xl font-bold text-[#3d3d3d]">YENİ STOK ÜRÜNÜ</h1>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ürün Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fiyat (₺) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Birim</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
              >
                <option value="Adet">Adet</option>
                <option value="Metre">Metre</option>
                <option value="Kg">Kg</option>
                <option value="Litre">Litre</option>
                <option value="Paket">Paket</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mevcut Stok *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min. Stok *</label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                min="0"
                required
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
              placeholder="Ürün hakkında detaylı bilgi..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Ürün Oluştur"}
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
