"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Pencil,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  ChevronDown,
  User,
  Phone,
  MapPin,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample staff data
const initialStaff = [
  { id: 1, name: "Ahmed Hassan", phone: "+94 77 123 4567", city: "Colombo", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { id: 2, name: "Fatima Ibrahim", phone: "+94 76 234 5678", city: "Kandy", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { id: 3, name: "Mohamed Ali", phone: "+94 71 345 6789", city: "Galle", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { id: 4, name: "Aisha Khan", phone: "+94 77 456 7890", city: "Jaffna", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { id: 5, name: "Yusuf Rahman", phone: "+94 76 567 8901", city: "Batticaloa", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { id: 6, name: "Zainab Saleh", phone: "+94 71 678 9012", city: "Negombo", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
  { id: 7, name: "Omar Faisal", phone: "+94 77 789 0123", city: "Kurunegala", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
  { id: 8, name: "Mariam Begum", phone: "+94 76 890 1234", city: "Colombo", country: "Sri Lanka", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
]

const cities = ["Colombo", "Kandy", "Galle", "Jaffna", "Batticaloa", "Negombo", "Kurunegala"]

type Staff = {
  id: number
  name: string
  phone: string
  city: string
  country: string
  image: string
}

export default function TeamPage() {
  const router = useRouter()
  const [staff] = useState<Staff[]>(initialStaff)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

  useEffect(() => {
    const savedView = localStorage.getItem("staffViewMode")
    if (savedView === "grid" || savedView === "list") {
      setViewMode(savedView)
    }
  }, [])

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode)
    localStorage.setItem("staffViewMode", mode)
  }

  const filteredStaff = useMemo(() => {
    let result = [...staff]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((s) =>
        s.name.toLowerCase().includes(query) ||
        s.phone.includes(query)
      )
    }

    if (cityFilter !== "all") {
      result = result.filter((s) => s.city === cityFilter)
    }

    return result
  }, [staff, searchQuery, cityFilter])

  const handleEdit = (id: number) => {
    router.push(`/admin/team/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    console.log("Deleting staff:", id)
  }

  const openViewModal = (member: Staff) => {
    setSelectedStaff(member)
    setShowViewModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your staff members</p>
        </div>
        <Button
          onClick={() => router.push("/admin/team/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="border-gray-200 rounded-xl min-w-[130px] justify-between"
              >
                <span>{cityFilter === "all" ? "All Cities" : cityFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showCityDropdown && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setCityFilter("all"); setShowCityDropdown(false) }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", cityFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Cities
                  </button>
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCityFilter(c); setShowCityDropdown(false) }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", cityFilter === c && "bg-blue-50 text-blue-600")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleViewChange("grid")}
              className={cn("p-2 rounded-lg transition-colors", viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={cn("p-2 rounded-lg transition-colors", viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover ring-4 ring-gray-100"
                  />
                </div>

                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.phone}</p>
                <p className="text-sm text-gray-400 mt-1">{member.city}, {member.country}</p>

                <div className="flex items-center justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewModal(member)}
                    className="h-9 w-9 p-0 hover:bg-green-50 hover:text-green-600 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(member.id)}
                    className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{member.name}</TableCell>
                  <TableCell className="text-gray-600">{member.phone}</TableCell>
                  <TableCell className="text-gray-600">{member.city}</TableCell>
                  <TableCell className="text-gray-600">{member.country}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewModal(member)}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(member.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No staff members found</p>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Staff Details</h2>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 text-center">
              <img
                src={selectedStaff.image}
                alt={selectedStaff.name}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-gray-100"
              />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{selectedStaff.name}</h3>
              
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStaff.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{selectedStaff.city}, {selectedStaff.country}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowViewModal(false)} className="rounded-xl">Close</Button>
              <Button onClick={() => { setShowViewModal(false); handleEdit(selectedStaff.id) }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
