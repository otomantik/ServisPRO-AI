"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Users, 
  Wrench, 
  Package, 
  CreditCard, 
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Search
} from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Yeni Servis",
      description: "Yeni servis kaydı oluştur",
      icon: Wrench,
      href: "/dashboard/services/new",
      color: "bg-blue-500 hover:bg-blue-600",
      iconColor: "text-blue-600"
    },
    {
      title: "Müşteri Ekle",
      description: "Yeni müşteri kaydı ekle",
      icon: Users,
      href: "/dashboard/customers/new",
      color: "bg-green-500 hover:bg-green-600",
      iconColor: "text-green-600"
    },
    {
      title: "Kasa İşlemi",
      description: "Gelir/gider kaydı ekle",
      icon: CreditCard,
      href: "/dashboard/cash/new",
      color: "bg-purple-500 hover:bg-purple-600",
      iconColor: "text-purple-600"
    },
    {
      title: "Stok Ekle",
      description: "Yeni ürün stok kaydı",
      icon: Package,
      href: "/dashboard/stock/new",
      color: "bg-orange-500 hover:bg-orange-600",
      iconColor: "text-orange-600"
    },
    {
      title: "Periyodik Bakım",
      description: "Bakım planı oluştur",
      icon: Calendar,
      href: "/dashboard/maintenance/new",
      color: "bg-indigo-500 hover:bg-indigo-600",
      iconColor: "text-indigo-600"
    },
    {
      title: "Rapor Al",
      description: "Detaylı rapor oluştur",
      icon: FileText,
      href: "/dashboard/reports",
      color: "bg-gray-500 hover:bg-gray-600",
      iconColor: "text-gray-600"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Hızlı İşlemler
        </CardTitle>
        <CardDescription>
          Sık kullanılan işlemleri hızlıca gerçekleştirin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-all duration-200 border-2 hover:border-gray-300"
              >
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/services">
                <Search className="w-4 h-4 mr-2" />
                Servis Ara
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analitik
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
