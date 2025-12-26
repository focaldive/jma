"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Heart,
  Newspaper,
  FolderKanban,
  CalendarDays,
  Cross,
  Images,
  Users,
  MessageSquare,
  Mail,
  Settings,
  Info,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Donations", icon: Heart, href: "/admin/donations" },
  { name: "News", icon: Newspaper, href: "/admin/news" },
  { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { name: "Events", icon: CalendarDays, href: "/admin/events" },
  { name: "Janaza", icon: Cross, href: "/admin/janaza" },
  { name: "Gallery", icon: Images, href: "/admin/gallery" },
  { name: "Team", icon: Users, href: "/admin/team" },
  { name: "Messages", icon: MessageSquare, href: "/admin/messages" },
  { name: "Newsletter", icon: Mail, href: "/admin/newsletter" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">J</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-900">JMA Admin</h1>
          <p className="text-xs text-gray-500">Management Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Info Card */}
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5" />
            <span className="font-semibold text-sm">Information!</span>
          </div>
          <p className="text-xs text-blue-100 mb-3">
            Welcome to JMA Admin Panel. Manage your organization efficiently.
          </p>
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1">
            Read More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
