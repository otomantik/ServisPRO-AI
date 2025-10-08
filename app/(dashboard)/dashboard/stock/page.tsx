"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStocks() {
      try {
        setLoading(true);
        const response = await fetch('/api/stocks');
        if (response.ok) {
          const data = await response.json();
          setStocks(data || []);
        } else {
          setError('Stok verileri yüklenirken hata oluştu');
        }
      } catch (err) {
        console.error('Stock page error:', err);
        setError('Stok verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    loadStocks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="border-b border-[#1b2033] pb-3">
          <h1 className="text-2xl font-bold text-[#3d3d3d]">STOKLAR</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="border-b border-[#1b2033] pb-3">
          <h1 className="text-2xl font-bold text-[#3d3d3d]">STOKLAR</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">STOKLAR</h1>
      </div>

      {/* Yeni Ürün Butonu */}
      <div>
        <Link
          href="/dashboard/stock/new"
          className="inline-flex items-center px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Stok Listesi */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white text-xs sm:text-sm">
              <th className="p-2 sm:p-3 text-left">STOK KODU</th>
              <th className="p-2 sm:p-3 text-left">ÜRÜN ADI</th>
              <th className="p-2 sm:p-3 text-left hidden sm:table-cell">KATEGORİ</th>
              <th className="p-2 sm:p-3 text-center">ADET</th>
              <th className="p-2 sm:p-3 text-center hidden sm:table-cell">MIN. ADET</th>
              <th className="p-2 sm:p-3 text-right">FİYAT</th>
              <th className="p-2 sm:p-3 text-left hidden md:table-cell">DURUM</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const isLowStock = stock.quantity <= stock.minQuantity;
              
              return (
                <tr
                  key={stock.id}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => window.location.href = `/dashboard/stock/${stock.id}`}
                >
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-mono">{stock.code}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm min-w-0">
                    <span className="font-bold text-black truncate block">{stock.name}</span>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">
                    {stock.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {stock.category.name}
                      </span>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-center">
                    <span
                      className={`font-bold ${
                        isLowStock ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {stock.quantity}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-center text-gray-500 hidden sm:table-cell">
                    {stock.minQuantity}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-right font-bold">
                    <span className="break-all">{formatCurrency(stock.price)}</span>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden md:table-cell">
                    {isLowStock && (
                      <div className="flex items-center text-red-600 text-xs">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Kritik Stok
                      </div>
                    )}
                    {!stock.status && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        Pasif
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-600">
        Listelenen Stok Sayısı: <strong>{stocks.length}</strong>
      </div>
    </div>
  );
}

