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
  Newspaper,
  LayoutGrid,
  LayoutList,
  CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "list" | "grid"

// Sample news data
const newsData = [
  {
    id: 1,
    title: "Annual Charity Gala Raises Record Funds for Education",
    thumbnail: "/images/news/charity-gala.jpg",
    category: "Events",
    status: "Published",
    date: "2024-12-25",
  },
  {
    id: 2,
    title: "New Scholarship Program Announced for Underprivileged Students",
    thumbnail: "/images/news/scholarship.jpg",
    category: "Appeals",
    status: "Published",
    date: "2024-12-22",
  },
  {
    id: 3,
    title: "Community Health Camp Successfully Completed",
    thumbnail: "/images/news/health-camp.jpg",
    category: "Community",
    status: "Published",
    date: "2024-12-18",
  },
  {
    id: 4,
    title: "Ramadan Food Distribution Drive Planning Begins",
    thumbnail: "/images/news/ramadan-drive.jpg",
    category: "Events",
    status: "Draft",
    date: "2024-12-15",
  },
  {
    id: 5,
    title: "Youth Leadership Workshop Series Launched",
    thumbnail: "/images/news/youth-workshop.jpg",
    category: "Community",
    status: "Published",
    date: "2024-12-10",
  },
  {
    id: 6,
    title: "Partnership with International NGO for Clean Water Project",
    thumbnail: "/images/news/water-project.jpg",
    category: "Appeals",
    status: "Draft",
    date: "2024-12-05",
  },
  {
    id: 7,
    title: "Winter Relief Campaign for Flood Victims",
    thumbnail: "/images/news/winter-relief.jpg",
    category: "Appeals",
    status: "Published",
    date: "2024-12-01",
  },
  {
    id: 8,
    title: "Educational Support Program Expands to New Districts",
    thumbnail: "/images/news/education.jpg",
    category: "Community",
    status: "Published",
    date: "2024-11-28",
  },
]

type CategoryFilter = "all" | "Events" | "Appeals" | "Community"
type StatusFilter = "all" | "Draft" | "Published"

const categoryStyles = {
  Events: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Appeals: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  Community: "bg-blue-100 text-blue-700 hover:bg-blue-100",
}

const statusStyles = {
  Published: "bg-green-100 text-green-700 hover:bg-green-100",
  Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
}

const ITEMS_PER_PAGE = 5

export default function NewsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  // Filter data
  const filteredNews = useMemo(() => {
    let result = [...newsData]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((news) =>
        news.title.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== "all") {
      result = result.filter((news) => news.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((news) => news.status === statusFilter)
    }

    return result
  }, [searchQuery, categoryFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredNews.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredNews, currentPage])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedNews.map((news) => news.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id))
    }
  }

  const handleDeleteSelected = () => {
    // In a real app, this would call an API
    console.log("Deleting:", selectedIds)
    setSelectedIds([])
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/news/new/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    // In a real app, this would call an API with confirmation
    console.log("Deleting:", id)
  }

  const isAllSelected =
    paginatedNews.length > 0 &&
    paginatedNews.every((news) => selectedIds.includes(news.id))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">News Articles</h1>
        <Button
          onClick={() => router.push("/admin/news/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
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
                  {(["all", "Events", "Appeals", "Community"] as CategoryFilter[]).map(
                    (category) => (
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
                        {category === "all" ? "All Categories" : category}
                      </button>
                    )
                  )}
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
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showStatusDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  {(["all", "Draft", "Published"] as StatusFilter[]).map((status) => (
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
                      {status === "all" ? "All Status" : status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete Selected */}
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedIds.length})
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

      {/* Grid View */}
      {viewMode === "grid" && (
        <div>
          {paginatedNews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No articles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:border-gray-200 relative group"
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-blue-400" />
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button onClick={() => handleEdit(news.id)} className="p-1.5 rounded-lg bg-white/90 text-blue-600 hover:bg-blue-100 shadow-sm">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(news.id)} className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-red-100 shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn("text-xs", statusStyles[news.status as keyof typeof statusStyles])}>
                        {news.status}
                      </Badge>
                      <Badge className={cn("text-xs", categoryStyles[news.category as keyof typeof categoryStyles])}>
                        {news.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{news.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(news.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredNews.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredNews.length)} of{" "}
                {filteredNews.length} articles
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

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No articles found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNews.map((news) => (
                  <TableRow
                    key={news.id}
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      selectedIds.includes(news.id) && "bg-blue-50/50"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(news.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(news.id, checked as boolean)
                        }
                        aria-label={`Select ${news.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                        <Newspaper className="w-5 h-5 text-blue-400" />
                        {/* Replace with actual image when available */}
                        {/* <Image src={news.thumbnail} alt="" fill className="object-cover" /> */}
                      </div>
                    </TableCell>
          
                    <TableCell>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {news.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          categoryStyles[news.category as keyof typeof categoryStyles]
                        )}
                      >
                        {news.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          statusStyles[news.status as keyof typeof statusStyles]
                        )}
                      >
                        {news.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(news.id)
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(news.id)
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
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
        {filteredNews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredNews.length)} of{" "}
              {filteredNews.length} articles
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
    </div>
  )
}
