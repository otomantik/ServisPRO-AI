"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"
import { 
  LayoutDashboard,
  Wrench,
  Users,
  Package,
  CreditCard,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Bell,
  HelpCircle,
  Wallet,
  FileText
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Servisler",
    href: "/dashboard/services",
    icon: Wrench,
    current: false,
  },
  {
    name: "Müşteriler",
    href: "/dashboard/customers",
    icon: Users,
    current: false,
  },
  {
    name: "Kasa",
    href: "/dashboard/kasa",
    icon: Wallet,
    current: false,
  },
  {
    name: "Faturalar",
    href: "/dashboard/alacaklar",
    icon: FileText,
    current: false,
  },
  {
    name: "Stoklar",
    href: "/dashboard/stock",
    icon: Package,
    current: false,
  },
  {
    name: "Periyodik Bakım",
    href: "/dashboard/maintenance",
    icon: Calendar,
    current: false,
  },
  {
    name: "Personel",
    href: "/dashboard/staff",
    icon: Users,
    current: false,
  },
  {
    name: "Kategoriler",
    href: "/dashboard/categories",
    icon: Settings,
    current: false,
  },
  {
    name: "Analitik",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: false,
  },
]

const bottomNavigation = [
  {
    name: "Ayarlar",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Yardım",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        collapsed && "lg:w-16"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ServisPro AI</h1>
                  <p className="text-xs text-gray-500">Akıllı Yönetim</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 w-5 h-5",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                      collapsed ? "mr-0" : "mr-3"
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gray-50 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 w-5 h-5",
                        isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600",
                        collapsed ? "mr-0" : "mr-3"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Profile */}
            {!collapsed && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                    <p className="text-xs text-gray-500 truncate">admin@servispro.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="bg-white shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </>
  )
}