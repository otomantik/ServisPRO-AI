"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CashPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/cash-old')
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
          setBalance(data.balance || 0)
          setIncome(data.income || 0)
          setExpense(data.expense || 0)
        }
      } catch (error) {
        console.error('Failed to load cash data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">KASA</h1>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-300">
          <h3 className="text-sm text-gray-600 mb-2">Toplam Gelir</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-300">
          <h3 className="text-sm text-gray-600 mb-2">Toplam Gider</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(expense)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-300">
          <h3 className="text-sm text-gray-600 mb-2">Kasa Bakiyesi</h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Yeni İşlem Butonu */}
      <div>
        <Link
          href={routes.kasa.new()}
          className="inline-flex items-center px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Kasa Hareketi Oluştur
        </Link>
      </div>

      {/* İşlem Listesi */}
      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-500 text-white text-sm">
              <th className="p-3 text-left">TARİH</th>
              <th className="p-3 text-left">ÖDEME TÜRÜ</th>
              <th className="p-3 text-left">AÇIKLAMA</th>
              <th className="p-3 text-left">ÖDEME ŞEKLİ</th>
              <th className="p-3 text-left">DURUM</th>
              <th className="p-3 text-right">TUTAR</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <tr
                  key={transaction.id}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="p-3 text-sm">
                    {formatDateTime(transaction.transactionDate)}
                  </td>
                  <td className="p-3 text-sm font-bold">
                    {transaction.paymentType?.name || "Diğer"}
                  </td>
                  <td className="p-3 text-sm">
                    {transaction.description && (
                      <div className="text-xs">{transaction.description}</div>
                    )}
                    {transaction.technician && (
                      <div className="text-xs text-gray-500">
                        Personel: {transaction.technician.name}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="capitalize">{transaction.paymentMethod}</span>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        transaction.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.paymentStatus === "completed"
                        ? "Tamamlandı"
                        : "Beklemede"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-right font-bold">
                    <span className={isIncome ? "text-green-600" : "text-red-600"}>
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>

      {!loading && (
        <div className="text-sm text-gray-600">
          Listelenen Hareket Sayısı: <strong>{transactions.length}</strong>
        </div>
      )}
    </div>
  );
}

