"use client"

import { useState, useMemo } from "react"
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
  X,
  Trash2,
  Mail,
  MailOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Reply,
  Phone,
  User,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample messages data
const initialMessages = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed.hassan@email.com", phone: "+94 77 123 4567", subject: "Question about donation process", message: "Assalamu Alaikum, I would like to know more about how to contribute to your organization. What are the available donation methods? Can I set up a recurring donation? Also, I'm interested in knowing how the funds are utilized for community projects. JazakAllah Khair.", status: "Unread", receivedAt: "2024-12-28T14:30:00" },
  { id: 2, name: "Fatima Ibrahim", email: "fatima.ibrahim@gmail.com", phone: "+94 76 234 5678", subject: "Volunteer registration inquiry", message: "Assalamu Alaikum, I am interested in volunteering for your upcoming community events. Could you please provide me with information about the registration process and the types of activities I can participate in? I have experience in event management and would love to contribute.", status: "Read", receivedAt: "2024-12-27T10:15:00" },
  { id: 3, name: "Mohamed Ali", email: "mohamed.ali@email.com", phone: "+94 71 345 6789", subject: "Event sponsorship opportunity", message: "Dear JMA Team, Our company would like to sponsor your upcoming charity gala. Please share details about sponsorship packages and benefits. We are committed to supporting community initiatives and believe this would be a great partnership opportunity.", status: "Replied", receivedAt: "2024-12-26T16:45:00" },
  { id: 4, name: "Aisha Khan", email: "aisha.khan@outlook.com", phone: "+94 77 456 7890", subject: "Requesting prayer times information", message: "Assalamu Alaikum, Could you please provide me with the updated prayer times for the month of January? Also, are there any special programs planned for the new year? JazakAllah Khair for your service to the community.", status: "Unread", receivedAt: "2024-12-28T09:00:00" },
  { id: 5, name: "Yusuf Rahman", email: "yusuf.rahman@email.com", phone: "", subject: "Feedback on recent community event", message: "Assalamu Alaikum, I attended the recent health camp organized by JMA and wanted to express my gratitude. The event was well-organized and the medical team was very professional. May Allah bless your efforts in serving the community.", status: "Read", receivedAt: "2024-12-25T11:30:00" },
  { id: 6, name: "Zainab Saleh", email: "zainab.saleh@gmail.com", phone: "+94 71 678 9012", subject: "Marriage hall booking inquiry", message: "Dear Admin, I would like to inquire about booking the marriage hall for my daughter's wedding in February. Could you please share the availability, pricing, and terms of booking? I would also like to know about the catering options available.", status: "Unread", receivedAt: "2024-12-28T08:00:00" },
  { id: 7, name: "Omar Faisal", email: "omar.faisal@email.com", phone: "+94 77 789 0123", subject: "Zakat distribution process", message: "Assalamu Alaikum, I want to understand how JMA distributes Zakat funds to those in need. Could you provide information about the verification process and how beneficiaries are identified? I want to ensure my Zakat is distributed according to Islamic guidelines.", status: "Read", receivedAt: "2024-12-24T13:20:00" },
  { id: 8, name: "Mariam Begum", email: "mariam.begum@outlook.com", phone: "+94 76 890 1234", subject: "Islamic education classes for children", message: "Dear JMA, I am interested in enrolling my children in Islamic education classes. Could you please provide details about the curriculum, schedule, and fees? Also, are there any weekend classes available? JazakAllah Khair.", status: "Replied", receivedAt: "2024-12-23T15:00:00" },
  { id: 9, name: "Hassan Ibrahim", email: "hassan.ibrahim@email.com", phone: "+94 77 901 2345", subject: "Membership renewal query", message: "Assalamu Alaikum, My JMA membership is expiring next month. How can I renew it? Are there any changes to the membership fees this year? Also, I would like to know about the benefits of membership.", status: "Unread", receivedAt: "2024-12-28T07:30:00" },
  { id: 10, name: "Khadija Hassan", email: "khadija.hassan@gmail.com", phone: "", subject: "Thank you for the scholarship", message: "Dear JMA Team, I am writing to express my heartfelt gratitude for awarding me the educational scholarship. This support will greatly help me pursue my studies. May Allah reward you for your generosity and continued support to students in need.", status: "Read", receivedAt: "2024-12-22T10:00:00" },
]

const statuses = ["Unread", "Read", "Replied"]

const statusStyles: Record<string, string> = {
  Unread: "bg-blue-100 text-blue-700",
  Read: "bg-gray-100 text-gray-600",
  Replied: "bg-green-100 text-green-700",
}

type Message = {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  receivedAt: string
}

const ITEMS_PER_PAGE = 6

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)

  // Filter messages
  const filteredMessages = useMemo(() => {
    let result = [...messages]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter)
    }

    return result.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  }, [messages, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE)
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMessages.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredMessages, currentPage])

  // Unread count
  const unreadCount = messages.filter((m) => m.status === "Unread").length

  // Selection
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedMessages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedMessages.map((m) => m.id))
    }
  }

  // View message
  const openMessage = (msg: Message) => {
    setSelectedMessage(msg)
    setShowDrawer(true)
    if (msg.status === "Unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "Read" } : m))
      )
    }
  }

  // Toggle read status
  const toggleReadStatus = (id: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Unread" ? "Read" : "Unread" }
          : m
      )
    )
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) =>
        prev ? { ...prev, status: prev.status === "Unread" ? "Read" : "Unread" } : null
      )
    }
  }

  // Delete message
  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setSelectedIds((prev) => prev.filter((i) => i !== id))
    if (selectedMessage?.id === id) {
      setShowDrawer(false)
      setSelectedMessage(null)
    }
  }

  // Bulk delete
  const handleBulkDelete = () => {
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)))
    setSelectedIds([])
  }

  // Bulk mark read/unread
  const handleBulkMarkRead = (read: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id) ? { ...m, status: read ? "Read" : "Unread" } : m
      )
    )
  }

  // Reply
  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread messages` : "No unread messages"}
          </p>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showStatusDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setStatusFilter("all"); setShowStatusDropdown(false); setCurrentPage(1) }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Status
                  </button>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); setCurrentPage(1) }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === s && "bg-blue-50 text-blue-600")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMarkRead(true)}
                className="rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMarkRead(false)}
                className="rounded-xl"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Mark Unread
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedIds.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={paginatedMessages.length > 0 && selectedIds.length === paginatedMessages.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50",
                    msg.status === "Unread" && "bg-blue-50/30"
                  )}
                  onClick={() => openMessage(msg)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(msg.id)}
                      onCheckedChange={() => toggleSelect(msg.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {msg.status === "Unread" ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className={cn("text-sm", msg.status === "Unread" ? "font-semibold text-gray-900" : "text-gray-700")}>{msg.name}</p>
                        <p className="text-xs text-gray-500">{msg.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className={cn("text-sm truncate max-w-[250px]", msg.status === "Unread" ? "font-medium text-gray-900" : "text-gray-600")}>
                      {msg.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusStyles[msg.status])}>{msg.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(msg.receivedAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(msg.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title={msg.status === "Unread" ? "Mark as Read" : "Mark as Unread"}
                      >
                        {msg.status === "Unread" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredMessages.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)} of {filteredMessages.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className={cn("rounded-lg w-8", currentPage === page && "bg-blue-600 hover:bg-blue-700")}>{page}</Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Message Drawer */}
      {showDrawer && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setShowDrawer(false)}>
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
              <button onClick={() => setShowDrawer(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedMessage.phone}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatFullDate(selectedMessage.receivedAt)}
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", statusStyles[selectedMessage.status])}>
                    {selectedMessage.status}
                  </Badge>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subject</p>
                <p className="font-medium text-gray-900">{selectedMessage.subject}</p>
              </div>

              {/* Message Body */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <Button onClick={() => handleReply(selectedMessage.email)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Reply className="w-4 h-4 mr-2" /> Reply
                </Button>
                <Button variant="outline" onClick={() => toggleReadStatus(selectedMessage.id)} className="rounded-xl">
                  {selectedMessage.status === "Unread" ? (
                    <><Eye className="w-4 h-4 mr-2" /> Mark as Read</>
                  ) : (
                    <><EyeOff className="w-4 h-4 mr-2" /> Mark as Unread</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
