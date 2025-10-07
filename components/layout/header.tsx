"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  ChevronDown,
  Menu
} from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [notifications] = useState([
    { id: 1, title: "Yeni servis kaydı", time: "2 dakika önce", unread: true },
    { id: 2, title: "Stok uyarısı", time: "1 saat önce", unread: true },
    { id: 3, title: "Ödeme alındı", time: "3 saat önce", unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Search and title */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              ServisPro AI
            </h1>
            <p className="text-sm text-gray-500">
              Akıllı servis yönetimi - Her şey kontrolünüzde
            </p>
          </div>
        </div>

        {/* Center - Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Servis, müşteri, stok ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Sun className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@servispro.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </header>
  )
}