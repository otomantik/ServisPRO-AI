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
  ChevronDown,
  Menu
} from "lucide-react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps = {}) {
  const [notifications] = useState([
    { id: 1, title: "Yeni servis kaydı", time: "2 dakika önce", unread: true },
    { id: 2, title: "Stok uyarısı", time: "1 saat önce", unread: true },
    { id: 3, title: "Ödeme alındı", time: "3 saat önce", unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden flex-shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Left side - Title (Desktop only) */}
        <div className="hidden lg:block flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">
            ServisPro AI
          </h1>
          <p className="text-sm text-gray-500">
            Akıllı servis yönetimi
          </p>
        </div>

        {/* Center - Global Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Servis, müşteri, stok ara..."
              className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
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
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@oto.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
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