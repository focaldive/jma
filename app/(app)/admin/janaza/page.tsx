"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Eye,
  Cross,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample Janaza data
const janazaData = [
  {
    id: 1,
    deceasedName: "Mohamed Cassim",
    age: 72,
    prayerDate: "2024-12-28",
    prayerTime: "14:00",
    prayerLocation: "Masjid Al-Noor, Colombo",
    burialLocation: "Kanatte Muslim Cemetery",
    contactName: "Ahmed Cassim",
    contactPhone: "+94 77 123 4567",
    contactEmail: "ahmed.cassim@email.com",
    notes: "Former community elder and philanthropist",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-27T10:30:00",
    updatedAt: "2024-12-27T14:15:00",
  },
  {
    id: 2,
    deceasedName: "Fathima Noor",
    age: 65,
    prayerDate: "2024-12-27",
    prayerTime: "15:30",
    prayerLocation: "Masjid Al-Rahman, Kandy",
    burialLocation: "Kandy Muslim Cemetery",
    contactName: "Ibrahim Noor",
    contactPhone: "+94 76 234 5678",
    contactEmail: "ibrahim.noor@email.com",
    notes: "Beloved mother and grandmother",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-26T08:00:00",
    updatedAt: "2024-12-27T16:00:00",
  },
  {
    id: 3,
    deceasedName: "Abdul Hameed",
    age: 80,
    prayerDate: "2024-12-29",
    prayerTime: "13:00",
    prayerLocation: "JMA Main Mosque, Galle",
    burialLocation: "Galle Muslim Cemetery",
    contactName: "Yusuf Hameed",
    contactPhone: "+94 71 345 6789",
    contactEmail: "yusuf.hameed@email.com",
    notes: "Retired teacher, served the community for 40 years",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-28T09:00:00",
    updatedAt: "2024-12-28T09:00:00",
  },
  {
    id: 4,
    deceasedName: "Zainab Begum",
    age: 58,
    prayerDate: "2024-12-26",
    prayerTime: "14:30",
    prayerLocation: "Masjid Al-Falah, Jaffna",
    burialLocation: "Jaffna Muslim Cemetery",
    contactName: "Hassan Ali",
    contactPhone: "+94 77 456 7890",
    contactEmail: "hassan.ali@email.com",
    notes: "",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-25T11:30:00",
    updatedAt: "2024-12-26T15:00:00",
  },
  {
    id: 5,
    deceasedName: "Ismail Khan",
    age: 45,
    prayerDate: "2024-12-30",
    prayerTime: "12:00",
    prayerLocation: "Central Mosque, Batticaloa",
    burialLocation: "Batticaloa Muslim Cemetery",
    contactName: "Amina Khan",
    contactPhone: "+94 76 567 8901",
    contactEmail: "amina.khan@email.com",
    notes: "Unexpected passing, prayer arrangements pending confirmation",
    status: "Pending",
    isPublished: false,
    createdAt: "2024-12-28T16:00:00",
    updatedAt: "2024-12-28T16:00:00",
  },
  {
    id: 6,
    deceasedName: "Mariam Saleh",
    age: 88,
    prayerDate: "2024-12-25",
    prayerTime: "15:00",
    prayerLocation: "Masjid Al-Taqwa, Negombo",
    burialLocation: "Negombo Muslim Cemetery",
    contactName: "Omar Saleh",
    contactPhone: "+94 71 678 9012",
    contactEmail: "omar.saleh@email.com",
    notes: "Respected community matriarch",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-24T07:00:00",
    updatedAt: "2024-12-25T16:00:00",
  },
  {
    id: 7,
    deceasedName: "Rashid Ahmed",
    age: 67,
    prayerDate: "2024-12-31",
    prayerTime: "14:00",
    prayerLocation: "JMA Main Mosque, Colombo",
    burialLocation: "Kanatte Muslim Cemetery",
    contactName: "Fatima Ahmed",
    contactPhone: "+94 77 789 0123",
    contactEmail: "fatima.ahmed@email.com",
    notes: "Long-time JMA volunteer",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-29T10:00:00",
    updatedAt: "2024-12-29T10:00:00",
  },
  {
    id: 8,
    deceasedName: "Khadija Hassan",
    age: 75,
    prayerDate: "2024-12-24",
    prayerTime: "13:30",
    prayerLocation: "Masjid Al-Huda, Kurunegala",
    burialLocation: "Kurunegala Muslim Cemetery",
    contactName: "Yusuf Hassan",
    contactPhone: "+94 76 890 1234",
    contactEmail: "yusuf.hassan@email.com",
    notes: "",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-23T14:00:00",
    updatedAt: "2024-12-24T14:00:00",
  },
]

const statuses = ["Scheduled", "Completed", "Pending", "Cancelled"]

const statusStyles: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Completed: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
}

const ITEMS_PER_PAGE = 6

export default function JanazaPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data
  const filteredJanaza = useMemo(() => {
    let result = [...janazaData]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) =>
        item.deceasedName.toLowerCase().includes(query) ||
        item.prayerLocation.toLowerCase().includes(query) ||
        item.contactName.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter)
    }

    // Sort by prayer date (upcoming first)
    result.sort((a, b) => new Date(b.prayerDate).getTime() - new Date(a.prayerDate).getTime())

    return result
  }, [searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredJanaza.length / ITEMS_PER_PAGE)
  const paginatedJanaza = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredJanaza.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredJanaza, currentPage])

  const handleView = (id: number) => {
    router.push(`/admin/janaza/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/janaza/new/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    console.log("Deleting janaza:", id)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Janaza Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage funeral prayer announcements</p>
        </div>
        <Button
          onClick={() => router.push("/admin/janaza/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, location, or contact..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="border-gray-200 rounded-xl min-w-[130px] justify-between"
            >
              <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showStatusDropdown && (
              <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button
                  onClick={() => {
                    setStatusFilter("all")
                    setShowStatusDropdown(false)
                    setCurrentPage(1)
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                    statusFilter === "all" && "bg-blue-50 text-blue-600"
                  )}
                >
                  All Status
                </button>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                      statusFilter === status && "bg-blue-50 text-blue-600"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Deceased Name</TableHead>
                <TableHead className="w-16">Age</TableHead>
                <TableHead className="w-30">Prayer Date</TableHead>
                <TableHead className="w-24">Time</TableHead>
                <TableHead>Prayer Location</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24">Published</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJanaza.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Cross className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No janaza announcements found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJanaza.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {item.deceasedName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item.age}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(item.prayerDate)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatTime(item.prayerTime)}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-[200px] truncate">
                      {item.prayerLocation}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          statusStyles[item.status] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          item.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {item.isPublished ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                       
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
        </div>

        {/* Pagination */}
        {filteredJanaza.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredJanaza.length)} of{" "}
              {filteredJanaza.length} announcements
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "rounded-lg w-8",
                    currentPage === page && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
