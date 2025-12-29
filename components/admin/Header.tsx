"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Calendar,
  Menu,
} from "lucide-react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("loggedIn")
    router.push("/login")
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left Section - Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Mobile Search Icon */}
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors sm:hidden">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date & Time - Hidden on mobile */}
        <div className="hidden xl:flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{currentDate}</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium text-gray-900">{currentTime}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50">
              <div className="px-4 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New donation received</p>
                        <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-3 border-t border-gray-100">
                <button className="w-full py-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-gray-100">
            <AvatarImage src="/assets/avatar.png" alt="Admin" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">AD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
        </div>

        {/* Logout - Desktop: Full button, Mobile: Icon only */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors sm:hidden"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
