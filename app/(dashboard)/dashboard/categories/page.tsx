"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Category {
  id: string;
  type: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    type: "customer",
    name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      logger.error("Error fetching categories", error, { context: 'CategoriesPage' });
      showError("Kategoriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchCategories();
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ type: "customer", name: "" });
        showSuccess(editingCategory ? "Kategori güncellendi!" : "Kategori oluşturuldu!");
      } else {
        showError("İşlem başarısız oldu!");
      }
    } catch (error) {
      logger.error("Category save error", error, { context: 'CategoriesPage' });
      showError("Bağlantı hatası oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ type: category.type, name: category.name });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchCategories();
        showSuccess("Kategori silindi!");
      } else {
        showError("Kategori silinemedi!");
      }
    } catch (error) {
      logger.error("Category delete error", error, { context: 'CategoriesPage' });
      showError("Bağlantı hatası oluştu!");
    }
  };

  const customerCategories = categories.filter(cat => cat.type === "customer");
  const stockCategories = categories.filter(cat => cat.type === "stock");

  return (
    <div className="space-y-4">
      <div className="border-b border-[#1b2033] pb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">KATEGORİLER</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setFormData({ type: "customer", name: "" });
          }}
          className="inline-flex items-center px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kategori
        </button>
      </div>

      {/* Kategori Formu */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-bold mb-4">
            {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori Tipi</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                >
                  <option value="customer">Müşteri Kategorisi</option>
                  <option value="stock">Stok Kategorisi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#36ba82]"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Müşteri Kategorileri */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h3 className="text-lg font-bold text-blue-800">Müşteri Kategorileri</h3>
        </div>
        <div className="p-4">
          {customerCategories.length === 0 ? (
            <p className="text-gray-500">Henüz müşteri kategorisi eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerCategories.map((category) => (
                <div key={category.id} className="border rounded p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{category.name}</h4>
                      <p className="text-sm text-gray-500">Müşteri Kategorisi</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stok Kategorileri */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-4 bg-green-50 border-b">
          <h3 className="text-lg font-bold text-green-800">Stok Kategorileri</h3>
        </div>
        <div className="p-4">
          {stockCategories.length === 0 ? (
            <p className="text-gray-500">Henüz stok kategorisi eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockCategories.map((category) => (
                <div key={category.id} className="border rounded p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{category.name}</h4>
                      <p className="text-sm text-gray-500">Stok Kategorisi</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
