"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
  FolderKanban,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample projects data
const projectsData = [
  { id: 1, year: 2024, month: "December", description: "Orphan Education Support Program", location: "Colombo", category: "Education", amount: 250000 },
  { id: 2, year: 2024, month: "November", description: "Community Health Camp", location: "Kandy", category: "Health", amount: 180000 },
  { id: 3, year: 2024, month: "November", description: "Ramadan Food Distribution", location: "Galle", category: "Food Aid", amount: 320000 },
  { id: 4, year: 2024, month: "October", description: "Youth Skills Training Workshop", location: "Jaffna", category: "Education", amount: 150000 },
  { id: 5, year: 2024, month: "October", description: "Clean Water Well Construction", location: "Batticaloa", category: "Infrastructure", amount: 450000 },
  { id: 6, year: 2024, month: "September", description: "Widow Support Initiative", location: "Trincomalee", category: "Welfare", amount: 200000 },
  { id: 7, year: 2024, month: "September", description: "School Supplies Distribution", location: "Kurunegala", category: "Education", amount: 95000 },
  { id: 8, year: 2024, month: "August", description: "Medical Equipment Donation", location: "Colombo", category: "Health", amount: 500000 },
  { id: 9, year: 2023, month: "December", description: "Winter Relief Campaign", location: "Nuwara Eliya", category: "Welfare", amount: 275000 },
  { id: 10, year: 2023, month: "November", description: "Livelihood Support for Farmers", location: "Anuradhapura", category: "Livelihood", amount: 380000 },
  { id: 11, year: 2023, month: "October", description: "Mosque Renovation Project", location: "Puttalam", category: "Infrastructure", amount: 620000 },
  { id: 12, year: 2023, month: "September", description: "Scholarship Fund Distribution", location: "Matara", category: "Education", amount: 180000 },
  { id: 13, year: 2023, month: "August", description: "Emergency Flood Relief", location: "Ratnapura", category: "Emergency", amount: 420000 },
  { id: 14, year: 2023, month: "July", description: "Vocational Training Center", location: "Negombo", category: "Education", amount: 350000 },
  { id: 15, year: 2022, month: "December", description: "Elderly Care Program", location: "Gampaha", category: "Welfare", amount: 165000 },
]

const years = [2024, 2023, 2022]
const categories = ["Education", "Health", "Food Aid", "Infrastructure", "Welfare", "Livelihood", "Emergency"]

const categoryStyles: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Health: "bg-green-100 text-green-700 hover:bg-green-100",
  "Food Aid": "bg-orange-100 text-orange-700 hover:bg-orange-100",
  Infrastructure: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Welfare: "bg-pink-100 text-pink-700 hover:bg-pink-100",
  Livelihood: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Emergency: "bg-red-100 text-red-700 hover:bg-red-100",
}

const ITEMS_PER_PAGE = 8

export default function ProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState<number | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data
  const filteredProjects = useMemo(() => {
    let result = [...projectsData]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((project) =>
        project.description.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query)
      )
    }

    if (yearFilter !== "all") {
      result = result.filter((project) => project.year === yearFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((project) => project.category === categoryFilter)
    }

    return result
  }, [searchQuery, yearFilter, categoryFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProjects, currentPage])

  // Total amount calculation
  const totalAmount = useMemo(() => {
    return filteredProjects.reduce((sum, project) => sum + project.amount, 0)
  }, [filteredProjects])

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProjects.map((project) => project.id))
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
    console.log("Deleting:", selectedIds)
    setSelectedIds([])
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/projects/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    console.log("Deleting:", id)
  }

  const isAllSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((project) => selectedIds.includes(project.id))

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all project activities</p>
        </div>
        <Button
          onClick={() => router.push("/admin/projects/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by description or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Year Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown)
                  setShowCategoryDropdown(false)
                }}
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>{yearFilter === "all" ? "All Years" : yearFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showYearDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => {
                      setYearFilter("all")
                      setShowYearDropdown(false)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                      yearFilter === "all" && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Years
                  </button>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setYearFilter(year)
                        setShowYearDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                        yearFilter === year && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown)
                  setShowYearDropdown(false)
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
          </div>
        </div>
      </div>

      {/* Table */}
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
                <TableHead className="w-20">Year</TableHead>
                <TableHead className="w-28">Month</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-32">Location</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-32 text-right">Amount</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No projects found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      selectedIds.includes(project.id) && "bg-blue-50/50"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(project.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(project.id, checked as boolean)
                        }
                        aria-label={`Select ${project.description}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {project.year}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.month}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {project.description}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          categoryStyles[project.category] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {project.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatAmount(project.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(project.id)
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
                            handleDelete(project.id)
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

        {/* Footer with Total and Pagination */}
        {filteredProjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of{" "}
                {filteredProjects.length} projects
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700 font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-blue-700">{formatAmount(totalAmount)}</span>
              </div>
            </div>

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
