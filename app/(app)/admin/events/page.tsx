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
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  CalendarDays,
  MapPin,
  LayoutGrid,
  LayoutList,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "list" | "grid"

// Sample events data
const eventsData = [
  { id: 1, name: "Annual Charity Gala 2024", date: "2024-12-28", location: "Colombo Grand Hotel", category: "Fundraiser", status: "Upcoming" },
  { id: 2, name: "Community Health Camp", date: "2024-12-15", location: "Kandy Community Center", category: "Health", status: "Completed" },
  { id: 3, name: "Ramadan Iftar Gathering", date: "2025-03-15", location: "JMA Main Hall", category: "Religious", status: "Upcoming" },
  { id: 4, name: "Youth Leadership Workshop", date: "2024-11-20", location: "Galle Youth Center", category: "Education", status: "Completed" },
  { id: 5, name: "Orphan Support Day", date: "2024-12-01", location: "Batticaloa Orphanage", category: "Welfare", status: "Completed" },
  { id: 6, name: "New Year Celebration", date: "2025-01-01", location: "Colombo Convention Center", category: "Community", status: "Upcoming" },
  { id: 7, name: "Blood Donation Drive", date: "2024-10-25", location: "Jaffna Hospital", category: "Health", status: "Completed" },
  { id: 8, name: "Scholarship Award Ceremony", date: "2025-02-10", location: "Colombo University Hall", category: "Education", status: "Upcoming" },
  { id: 9, name: "Emergency Relief Meeting", date: "2024-09-15", location: "JMA Office", category: "Welfare", status: "Cancelled" },
  { id: 10, name: "Eid Festival Celebration", date: "2025-04-01", location: "JMA Main Hall", category: "Religious", status: "Upcoming" },
  { id: 11, name: "Winter Clothes Distribution", date: "2024-11-30", location: "Nuwara Eliya", category: "Welfare", status: "Completed" },
  { id: 12, name: "Career Guidance Seminar", date: "2025-01-20", location: "Colombo Skills Center", category: "Education", status: "Upcoming" },
  { id: 13, name: "Mosque Inauguration", date: "2024-08-10", location: "Puttalam", category: "Religious", status: "Completed" },
  { id: 14, name: "Sports Day Event", date: "2024-07-15", location: "Colombo Sports Complex", category: "Community", status: "Cancelled" },
  { id: 15, name: "Fundraiser Dinner", date: "2025-02-28", location: "Hilton Colombo", category: "Fundraiser", status: "Upcoming" },
]

const categories = ["Fundraiser", "Health", "Religious", "Education", "Welfare", "Community"]
const statuses = ["Upcoming", "Completed", "Cancelled"]

const categoryStyles: Record<string, string> = {
  Fundraiser: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Health: "bg-green-100 text-green-700 hover:bg-green-100",
  Religious: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Education: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Welfare: "bg-pink-100 text-pink-700 hover:bg-pink-100",
  Community: "bg-orange-100 text-orange-700 hover:bg-orange-100",
}

const statusStyles: Record<string, string> = {
  Upcoming: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Completed: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
}

const ITEMS_PER_PAGE = 8

export default function EventsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  // Filter data
  const filteredEvents = useMemo(() => {
    let result = [...eventsData]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((event) =>
        event.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((event) => event.status === statusFilter)
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return result
  }, [searchQuery, categoryFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredEvents, currentPage])

  const handleEdit = (id: number) => {
    router.push(`/admin/events/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    console.log("Deleting event:", id)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">Manage upcoming and past events</p>
        </div>
        <Button
          onClick={() => router.push("/admin/events/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by event name or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown)
                  setShowStatusDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[140px] justify-between"
              >
                <span>{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showCategoryDropdown && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => {
                      setCategoryFilter("all")
                      setShowCategoryDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                      categoryFilter === "all" && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setCategoryFilter(category)
                        setShowCategoryDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                        categoryFilter === category && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {category}
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
                  setShowCategoryDropdown(false)
                }}
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
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead className="w-30">Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-28">Category</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No events found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEvents.map((event) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {event.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          {formatDate(event.date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-medium",
                            categoryStyles[event.category] || "bg-gray-100 text-gray-700"
                          )}
                        >
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-medium",
                            statusStyles[event.status] || "bg-gray-100 text-gray-700"
                          )}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event.id)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
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
          {filteredEvents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of{" "}
                {filteredEvents.length} events
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
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div>
          {paginatedEvents.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md hover:border-gray-200 relative group"
                >
                  {/* Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button onClick={() => handleEdit(event.id)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <Badge className={cn("text-xs mb-3", statusStyles[event.status] || "bg-gray-100 text-gray-700")}>
                    {event.status}
                  </Badge>

                  {/* Content */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3">{event.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge className={cn("text-xs", categoryStyles[event.category] || "bg-gray-100 text-gray-700")}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredEvents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of{" "}
                {filteredEvents.length} events
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
      )}
    </div>
  )
}
