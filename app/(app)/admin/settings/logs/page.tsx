"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
  Shield,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Key,
  UserCog,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Monitor,
  Globe,
  Calendar,
  Filter,
  LayoutList,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type ActionType = "Create" | "Update" | "Delete" | "Login" | "Logout" | "PasswordChange" | "RoleChange" | "FailedLogin"
type ResourceType = "News" | "Projects" | "Events" | "Donations" | "Settings" | "Users" | "Messages" | "Auth"
type StatusType = "Success" | "Failed" | "Warning"
type ViewMode = "list" | "feed"

interface ActivityLog {
  id: number
  userId: number
  userName: string
  userEmail: string
  userAvatar: string
  action: ActionType
  resource: ResourceType
  resourceId?: string
  description: string
  details?: string
  ipAddress: string
  device: string
  browser: string
  status: StatusType
  timestamp: string
  isSecurityEvent: boolean
}

// Demo data with comprehensive activity logs
const demoActivityLogs: ActivityLog[] = [
  {
    id: 1,
    userId: 1,
    userName: "Ahmed Hassan",
    userEmail: "ahmed.hassan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "Login",
    resource: "Auth",
    description: "User logged in successfully",
    details: "Two-factor authentication verified",
    ipAddress: "192.168.1.105",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-29T12:30:00",
    isSecurityEvent: true,
  },
  {
    id: 2,
    userId: 2,
    userName: "Fatima Ibrahim",
    userEmail: "fatima.ibrahim@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    action: "Create",
    resource: "News",
    resourceId: "NEWS-2024-001",
    description: "Created new news article",
    details: "Article: 'Annual Charity Event Announcement 2025'",
    ipAddress: "192.168.1.110",
    device: "Desktop",
    browser: "Firefox 121.0",
    status: "Success",
    timestamp: "2024-12-29T11:45:00",
    isSecurityEvent: false,
  },
  {
    id: 3,
    userId: 3,
    userName: "Mohamed Ali",
    userEmail: "mohamed.ali@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    action: "FailedLogin",
    resource: "Auth",
    description: "Failed login attempt",
    details: "Invalid password entered 3 times",
    ipAddress: "203.94.52.77",
    device: "Mobile",
    browser: "Safari 17.2",
    status: "Failed",
    timestamp: "2024-12-29T11:30:00",
    isSecurityEvent: true,
  },
  {
    id: 4,
    userId: 1,
    userName: "Ahmed Hassan",
    userEmail: "ahmed.hassan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "RoleChange",
    resource: "Users",
    resourceId: "USER-005",
    description: "Changed user role",
    details: "Changed Yusuf Rahman from 'User' to 'Editor'",
    ipAddress: "192.168.1.105",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-29T10:15:00",
    isSecurityEvent: true,
  },
  {
    id: 5,
    userId: 4,
    userName: "Aisha Khan",
    userEmail: "aisha.khan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    action: "Update",
    resource: "Events",
    resourceId: "EVT-2024-012",
    description: "Updated event details",
    details: "Modified venue and time for 'Community Iftar Gathering'",
    ipAddress: "192.168.1.115",
    device: "Tablet",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-29T09:45:00",
    isSecurityEvent: false,
  },
  {
    id: 6,
    userId: 5,
    userName: "Yusuf Rahman",
    userEmail: "yusuf.rahman@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    action: "Delete",
    resource: "Projects",
    resourceId: "PROJ-2023-008",
    description: "Deleted project",
    details: "Removed outdated project: 'Water Well Construction Phase 1'",
    ipAddress: "192.168.1.120",
    device: "Desktop",
    browser: "Edge 120.0",
    status: "Warning",
    timestamp: "2024-12-29T09:00:00",
    isSecurityEvent: false,
  },
  {
    id: 7,
    userId: 6,
    userName: "Zainab Saleh",
    userEmail: "zainab.saleh@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    action: "PasswordChange",
    resource: "Settings",
    description: "Password changed",
    details: "User changed their password successfully",
    ipAddress: "192.168.1.125",
    device: "Mobile",
    browser: "Chrome Mobile 120.0",
    status: "Success",
    timestamp: "2024-12-28T18:30:00",
    isSecurityEvent: true,
  },
  {
    id: 8,
    userId: 2,
    userName: "Fatima Ibrahim",
    userEmail: "fatima.ibrahim@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    action: "Create",
    resource: "Donations",
    resourceId: "DON-2024-156",
    description: "Recorded new donation",
    details: "Recorded donation of Rs. 50,000 from anonymous donor",
    ipAddress: "192.168.1.110",
    device: "Desktop",
    browser: "Firefox 121.0",
    status: "Success",
    timestamp: "2024-12-28T16:20:00",
    isSecurityEvent: false,
  },
  {
    id: 9,
    userId: 7,
    userName: "Omar Faisal",
    userEmail: "omar.faisal@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    action: "Logout",
    resource: "Auth",
    description: "User logged out",
    details: "Session ended normally",
    ipAddress: "192.168.1.130",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-28T15:00:00",
    isSecurityEvent: true,
  },
  {
    id: 10,
    userId: 1,
    userName: "Ahmed Hassan",
    userEmail: "ahmed.hassan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "Update",
    resource: "Settings",
    description: "Updated site settings",
    details: "Changed organization contact email and phone number",
    ipAddress: "192.168.1.105",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-28T14:30:00",
    isSecurityEvent: false,
  },
  {
    id: 11,
    userId: 8,
    userName: "Mariam Begum",
    userEmail: "mariam.begum@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    action: "Create",
    resource: "Messages",
    resourceId: "MSG-2024-089",
    description: "Replied to contact message",
    details: "Sent response to inquiry about volunteer opportunities",
    ipAddress: "192.168.1.135",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-28T13:15:00",
    isSecurityEvent: false,
  },
  {
    id: 12,
    userId: 1,
    userName: "Ahmed Hassan",
    userEmail: "ahmed.hassan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "RoleChange",
    resource: "Users",
    resourceId: "USER-004",
    description: "Changed user role",
    details: "Disabled account for Aisha Khan",
    ipAddress: "192.168.1.105",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Warning",
    timestamp: "2024-12-28T11:00:00",
    isSecurityEvent: true,
  },
  {
    id: 13,
    userId: 3,
    userName: "Mohamed Ali",
    userEmail: "mohamed.ali@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    action: "Login",
    resource: "Auth",
    description: "User logged in successfully",
    details: "Password reset link used for login",
    ipAddress: "192.168.1.140",
    device: "Mobile",
    browser: "Safari 17.2",
    status: "Success",
    timestamp: "2024-12-28T10:30:00",
    isSecurityEvent: true,
  },
  {
    id: 14,
    userId: 4,
    userName: "Aisha Khan",
    userEmail: "aisha.khan@jma.lk",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    action: "Update",
    resource: "News",
    resourceId: "NEWS-2024-098",
    description: "Updated news article",
    details: "Corrected typos in 'Ramadan Schedule 2024'",
    ipAddress: "192.168.1.115",
    device: "Desktop",
    browser: "Chrome 120.0",
    status: "Success",
    timestamp: "2024-12-27T16:45:00",
    isSecurityEvent: false,
  },
  {
    id: 15,
    userId: 9,
    userName: "Unknown User",
    userEmail: "unknown@attacker.com",
    userAvatar: "https://ui-avatars.com/api/?name=Unknown&background=ef4444&color=fff",
    action: "FailedLogin",
    resource: "Auth",
    description: "Suspicious login attempt blocked",
    details: "Multiple failed attempts from unknown IP address",
    ipAddress: "45.227.255.99",
    device: "Unknown",
    browser: "Unknown",
    status: "Failed",
    timestamp: "2024-12-27T03:22:00",
    isSecurityEvent: true,
  },
]

// Constants
const actionTypes: ActionType[] = ["Create", "Update", "Delete", "Login", "Logout", "PasswordChange", "RoleChange", "FailedLogin"]
const resourceTypes: ResourceType[] = ["News", "Projects", "Events", "Donations", "Settings", "Users", "Messages", "Auth"]
const statusTypes: StatusType[] = ["Success", "Failed", "Warning"]

// Unique users for filter
const uniqueUsers = Array.from(new Map(demoActivityLogs.map(log => [log.userId, { id: log.userId, name: log.userName, email: log.userEmail }])).values())

// Style mappings
const actionStyles: Record<ActionType, { bg: string; text: string; icon: React.ElementType }> = {
  Create: { bg: "bg-green-100", text: "text-green-700", icon: Plus },
  Update: { bg: "bg-blue-100", text: "text-blue-700", icon: Pencil },
  Delete: { bg: "bg-red-100", text: "text-red-700", icon: Trash2 },
  Login: { bg: "bg-emerald-100", text: "text-emerald-700", icon: LogIn },
  Logout: { bg: "bg-gray-100", text: "text-gray-700", icon: LogOut },
  PasswordChange: { bg: "bg-purple-100", text: "text-purple-700", icon: Key },
  RoleChange: { bg: "bg-orange-100", text: "text-orange-700", icon: UserCog },
  FailedLogin: { bg: "bg-red-100", text: "text-red-700", icon: AlertTriangle },
}

const statusStyles: Record<StatusType, { bg: string; text: string; icon: React.ElementType }> = {
  Success: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  Failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  Warning: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertTriangle },
}

const resourceStyles: Record<ResourceType, string> = {
  News: "bg-blue-50 text-blue-600",
  Projects: "bg-purple-50 text-purple-600",
  Events: "bg-pink-50 text-pink-600",
  Donations: "bg-green-50 text-green-600",
  Settings: "bg-gray-50 text-gray-600",
  Users: "bg-orange-50 text-orange-600",
  Messages: "bg-cyan-50 text-cyan-600",
  Auth: "bg-red-50 text-red-600",
}

const ITEMS_PER_PAGE = 10

export default function ActivityLogsPage() {
  const router = useRouter()
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState<number | "all">("all")
  const [resourceFilter, setResourceFilter] = useState<ResourceType | "all">("all")
  const [actionFilter, setActionFilter] = useState<ActionType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<StatusType | "all">("all")
  const [securityOnly, setSecurityOnly] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  
  // Dropdowns
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showResourceDropdown, setShowResourceDropdown] = useState(false)
  const [showActionDropdown, setShowActionDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  
  // Modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filter logs
  const filteredLogs = useMemo(() => {
    let result = [...demoActivityLogs]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(query) ||
          log.userEmail.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.resource.toLowerCase().includes(query)
      )
    }

    if (userFilter !== "all") {
      result = result.filter((log) => log.userId === userFilter)
    }

    if (resourceFilter !== "all") {
      result = result.filter((log) => log.resource === resourceFilter)
    }

    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((log) => log.status === statusFilter)
    }

    if (securityOnly) {
      result = result.filter((log) => log.isSecurityEvent)
    }

    if (dateFrom) {
      result = result.filter((log) => new Date(log.timestamp) >= new Date(dateFrom))
    }

    if (dateTo) {
      result = result.filter((log) => new Date(log.timestamp) <= new Date(dateTo + "T23:59:59"))
    }

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [searchQuery, userFilter, resourceFilter, actionFilter, statusFilter, securityOnly, dateFrom, dateTo])

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLogs, currentPage])

  // Handlers
  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setShowDetailModal(true)
  }

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Email", "Action", "Resource", "Description", "Status", "IP Address", "Device", "Browser"]
    const rows = filteredLogs.map((log) => [
      formatDateTime(log.timestamp),
      log.userName,
      log.userEmail,
      log.action,
      log.resource,
      log.description,
      log.status,
      log.ipAddress,
      log.device,
      log.browser,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setUserFilter("all")
    setResourceFilter("all")
    setActionFilter("all")
    setStatusFilter("all")
    setSecurityOnly(false)
    setDateFrom("")
    setDateTo("")
    setCurrentPage(1)
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return formatDateTime(dateStr)
  }

  const hasActiveFilters = userFilter !== "all" || resourceFilter !== "all" || actionFilter !== "all" || statusFilter !== "all" || securityOnly || dateFrom || dateTo

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/settings")} className="hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Activity Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredLogs.length} activities • {filteredLogs.filter((l) => l.isSecurityEvent).length} security events
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="border-gray-200 rounded-xl">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-0 z-30">
        <div className="flex flex-col gap-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user, email, or description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>

              {/* Security Filter Toggle */}
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <Checkbox
                  checked={securityOnly}
                  onCheckedChange={(checked) => {
                    setSecurityOnly(checked as boolean)
                    setCurrentPage(1)
                  }}
                />
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">Security Events</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 text-sm">
                  <X className="w-4 h-4 mr-1" /> Clear Filters
                </Button>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("feed")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "feed" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* User Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown)
                  setShowResourceDropdown(false)
                  setShowActionDropdown(false)
                  setShowStatusDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[140px] justify-between"
              >
                <span>{userFilter === "all" ? "All Users" : uniqueUsers.find((u) => u.id === userFilter)?.name}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showUserDropdown && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setUserFilter("all")
                      setShowUserDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", userFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Users
                  </button>
                  {uniqueUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setUserFilter(user.id)
                        setShowUserDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", userFilter === user.id && "bg-blue-50 text-blue-600")}
                    >
                      <span className="block font-medium">{user.name}</span>
                      <span className="block text-xs text-gray-500">{user.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Resource Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResourceDropdown(!showResourceDropdown)
                  setShowUserDropdown(false)
                  setShowActionDropdown(false)
                  setShowStatusDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[130px] justify-between"
              >
                <span>{resourceFilter === "all" ? "All Resources" : resourceFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showResourceDropdown && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
                  <button
                    onClick={() => {
                      setResourceFilter("all")
                      setShowResourceDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", resourceFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Resources
                  </button>
                  {resourceTypes.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setResourceFilter(r)
                        setShowResourceDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", resourceFilter === r && "bg-blue-50 text-blue-600")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActionDropdown(!showActionDropdown)
                  setShowUserDropdown(false)
                  setShowResourceDropdown(false)
                  setShowStatusDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[130px] justify-between"
              >
                <span>{actionFilter === "all" ? "All Actions" : actionFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showActionDropdown && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
                  <button
                    onClick={() => {
                      setActionFilter("all")
                      setShowActionDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", actionFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Actions
                  </button>
                  {actionTypes.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setActionFilter(a)
                        setShowActionDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", actionFilter === a && "bg-blue-50 text-blue-600")}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown)
                  setShowUserDropdown(false)
                  setShowResourceDropdown(false)
                  setShowActionDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showStatusDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
                  <button
                    onClick={() => {
                      setStatusFilter("all")
                      setShowStatusDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Status
                  </button>
                  {statusTypes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s)
                        setShowStatusDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === s && "bg-blue-50 text-blue-600")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 w-36 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  placeholder="From"
                />
              </div>
              <span className="text-gray-400">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-40 bg-gray-50 border-gray-200 rounded-xl text-sm"
                placeholder="To"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-56">User</TableHead>
                  <TableHead className="w-32">Action</TableHead>
                  <TableHead className="w-28">Resource</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-32">IP Address</TableHead>
                  <TableHead className="w-40">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No activity logs found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => {
                    const ActionIcon = actionStyles[log.action].icon
                    const StatusIcon = statusStyles[log.status].icon
                    return (
                      <TableRow
                        key={log.id}
                        onClick={() => handleViewDetails(log)}
                        className={cn(
                          "cursor-pointer hover:bg-gray-50 transition-colors",
                          log.isSecurityEvent && log.status === "Failed" && "bg-red-50/50 hover:bg-red-50",
                          log.action === "RoleChange" && "bg-orange-50/30 hover:bg-orange-50/50"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={log.userAvatar} alt={log.userName} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{log.userName}</p>
                              <p className="text-xs text-gray-500">{log.userEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs gap-1", actionStyles[log.action].bg, actionStyles[log.action].text)}>
                            <ActionIcon className="w-3 h-3" />
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", resourceStyles[log.resource])}>{log.resource}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-700 line-clamp-1">{log.description}</p>
                          {log.resourceId && <p className="text-xs text-gray-400">{log.resourceId}</p>}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs gap-1", statusStyles[log.status].bg, statusStyles[log.status].text)}>
                            <StatusIcon className="w-3 h-3" />
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 font-mono">{log.ipAddress}</TableCell>
                        <TableCell className="text-sm text-gray-500">{formatTimeAgo(log.timestamp)}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-lg">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn("rounded-lg w-8", currentPage === page && "bg-blue-600 hover:bg-blue-700")}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-lg">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Feed View */}
      {viewMode === "feed" && (
        <div className="space-y-4">
          {paginatedLogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <>
              {paginatedLogs.map((log) => {
                const ActionIcon = actionStyles[log.action].icon
                const StatusIcon = statusStyles[log.status].icon
                return (
                  <div
                    key={log.id}
                    onClick={() => handleViewDetails(log)}
                    className={cn(
                      "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all",
                      log.isSecurityEvent && log.status === "Failed" && "border-red-200 bg-red-50/30",
                      log.action === "RoleChange" && "border-orange-200 bg-orange-50/30"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <img src={log.userAvatar} alt={log.userName} className="w-12 h-12 rounded-full object-cover ring-4 ring-gray-100" />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900">{log.userName}</span>
                              <Badge className={cn("text-xs gap-1", actionStyles[log.action].bg, actionStyles[log.action].text)}>
                                <ActionIcon className="w-3 h-3" />
                                {log.action}
                              </Badge>
                              <Badge className={cn("text-xs", resourceStyles[log.resource])}>{log.resource}</Badge>
                              {log.isSecurityEvent && (
                                <Badge className="text-xs bg-red-100 text-red-700 gap-1">
                                  <Shield className="w-3 h-3" />
                                  Security
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mt-1">{log.description}</p>
                            {log.details && <p className="text-sm text-gray-500 mt-1">{log.details}</p>}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs gap-1", statusStyles[log.status].bg, statusStyles[log.status].text)}>
                              <StatusIcon className="w-3 h-3" />
                              {log.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(log.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {log.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {log.device} • {log.browser}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-lg">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={cn("rounded-lg w-8", currentPage === page && "bg-blue-600 hover:bg-blue-700")}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-lg">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Activity Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Activity Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedLog.userAvatar} alt={selectedLog.userName} className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-100" />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedLog.userName}</h3>
                  <p className="text-sm text-gray-500">{selectedLog.userEmail}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className={cn("text-xs gap-1", actionStyles[selectedLog.action].bg, actionStyles[selectedLog.action].text)}>
                  {(() => {
                    const ActionIcon = actionStyles[selectedLog.action].icon
                    return <ActionIcon className="w-3 h-3" />
                  })()}
                  {selectedLog.action}
                </Badge>
                <Badge className={cn("text-xs", resourceStyles[selectedLog.resource])}>{selectedLog.resource}</Badge>
                <Badge className={cn("text-xs gap-1", statusStyles[selectedLog.status].bg, statusStyles[selectedLog.status].text)}>
                  {(() => {
                    const StatusIcon = statusStyles[selectedLog.status].icon
                    return <StatusIcon className="w-3 h-3" />
                  })()}
                  {selectedLog.status}
                </Badge>
                {selectedLog.isSecurityEvent && (
                  <Badge className="text-xs bg-red-100 text-red-700 gap-1">
                    <Shield className="w-3 h-3" />
                    Security Event
                  </Badge>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">{selectedLog.description}</p>
                  {selectedLog.details && <p className="text-sm text-gray-500 mt-2">{selectedLog.details}</p>}
                </div>

                {selectedLog.resourceId && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Info className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Resource ID</p>
                      <p className="text-sm text-gray-900 font-mono">{selectedLog.resourceId}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs">IP Address</span>
                    </div>
                    <p className="text-sm font-mono text-gray-900">{selectedLog.ipAddress}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs">Device</span>
                    </div>
                    <p className="text-sm text-gray-900">{selectedLog.device}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs">Browser</span>
                    </div>
                    <p className="text-sm text-gray-900">{selectedLog.browser}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Timestamp</span>
                    </div>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
