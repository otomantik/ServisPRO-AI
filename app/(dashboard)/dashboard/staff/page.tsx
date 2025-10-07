"use client"

import { useState, useEffect } from "react"
import { formatDate } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch('/api/staff')
        if (res.ok) {
          const data = await res.json()
          setStaff(data)
        }
      } catch (error) {
        console.error('Failed to load staff:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStaff()
  }, [])

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">PERSONEL</h1>
      </div>

      {/* Yeni Personel Butonu */}
      <div>
        <Link
          href="/dashboard/staff/new"
          className="inline-flex items-center px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Personel Oluştur
        </Link>
      </div>

      {/* Personel Listesi */}
      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-500 text-white text-sm">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">TARİH</th>
                <th className="p-3 text-left">PERSONEL ADI</th>
                <th className="p-3 text-left">POZİSYON</th>
                <th className="p-3 text-left">TELEFON</th>
                <th className="p-3 text-left">ADRES</th>
                <th className="p-3 text-left">DURUM</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((person) => (
              <tr
                key={person.id}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="p-3 text-sm text-right">{person.id.slice(-6)}</td>
                <td className="p-3 text-sm">{formatDate(person.createdAt)}</td>
                <td className="p-3 text-sm">
                  <span className="font-bold text-black">{person.name}</span>
                </td>
                <td className="p-3 text-sm">
                  <span className="font-bold">{person.position}</span>
                </td>
                <td className="p-3 text-sm">{person.phone}</td>
                <td className="p-3 text-sm">
                  {person.address} {person.district}
                </td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      person.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {person.status ? "Çalışıyor" : "Ayrıldı"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {!loading && (
        <div className="text-sm text-gray-600">
          Listelenen Personel Sayısı: <strong>{staff.length}</strong>
        </div>
      )}
    </div>
  );
}

