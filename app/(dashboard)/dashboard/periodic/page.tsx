import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getPeriodicMaintenances() {
  return await prisma.periodicMaintenance.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      devices: true,
    },
  });
}

export default async function PeriodicPage() {
  const maintenances = await getPeriodicMaintenances();

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="border-b border-[#1b2033] pb-3">
        <h1 className="text-2xl font-bold text-[#3d3d3d]">PERİYODİK BAKIM</h1>
      </div>

      {/* Yeni Bakım Butonu */}
      <div>
        <button className="inline-flex items-center px-4 py-2 bg-[#36ba82] text-white rounded hover:bg-[#29a470] transition">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Periyodik Bakım Oluştur
        </button>
      </div>

      {/* Bakım Listesi */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-500 text-white text-sm">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">FİRMA ADI</th>
              <th className="p-3 text-left">TELEFON</th>
              <th className="p-3 text-left">BAŞLANGIÇ</th>
              <th className="p-3 text-left">BİTİŞ</th>
              <th className="p-3 text-center">CİHAZ SAYISI</th>
              <th className="p-3 text-center">BAKIM SAYISI</th>
              <th className="p-3 text-right">FİYAT</th>
              <th className="p-3 text-left">DURUM</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenance) => (
              <tr
                key={maintenance.id}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="p-3 text-sm text-right">
                  {maintenance.id.slice(-6)}
                </td>
                <td className="p-3 text-sm">
                  <span className="font-bold text-black">
                    {maintenance.companyName}
                  </span>
                </td>
                <td className="p-3 text-sm">{maintenance.phone}</td>
                <td className="p-3 text-sm">{formatDate(maintenance.startDate)}</td>
                <td className="p-3 text-sm">{formatDate(maintenance.endDate)}</td>
                <td className="p-3 text-sm text-center font-bold">
                  {maintenance.devices.length}
                </td>
                <td className="p-3 text-sm text-center">
                  {maintenance.maintenanceCount}
                </td>
                <td className="p-3 text-sm text-right font-bold">
                  {formatCurrency(maintenance.pricePerMaintenance)}
                </td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      maintenance.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {maintenance.status ? "Aktif" : "Sonlandırıldı"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maintenances.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Kayıt Bulunamadı.</p>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          Listelenen Servis Sayısı: <strong>{maintenances.length}</strong>
        </div>
      )}
    </div>
  );
}

