"use client"

import { useState, useMemo } from "react"
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
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  ArrowUpDown,
  Users,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample donors data
const donorsData = [
  { id: 1, name: "Ahmed Mohamed", address: "123 Main Street, Colombo 03", country: "Sri Lanka", amount: 150000 },
  { id: 2, name: "Fathima Begum", address: "45 Beach Road, Galle", country: "Sri Lanka", amount: 75000 },
  { id: 3, name: "Ibrahim Khan", address: "78 Park Avenue, Dubai", country: "UAE", amount: 500000 },
  { id: 4, name: "Zainab Ali", address: "12 Queens Road, London", country: "UK", amount: 250000 },
  { id: 5, name: "Mohamed Rafi", address: "90 Orchard Road, Singapore", country: "Singapore", amount: 180000 },
  { id: 6, name: "Amina Hassan", address: "33 Hill Street, Kandy", country: "Sri Lanka", amount: 95000 },
  { id: 7, name: "Yusuf Rahman", address: "567 Bay Street, Toronto", country: "Canada", amount: 320000 },
  { id: 8, name: "Khadija Noor", address: "21 Sunset Blvd, Los Angeles", country: "USA", amount: 420000 },
  { id: 9, name: "Abdul Kareem", address: "88 Marine Drive, Mumbai", country: "India", amount: 125000 },
  { id: 10, name: "Safiya Jaffar", address: "15 King Street, Melbourne", country: "Australia", amount: 280000 },
  { id: 11, name: "Hamza Ismail", address: "42 Flower Road, Colombo 07", country: "Sri Lanka", amount: 65000 },
  { id: 12, name: "Mariam Saleh", address: "99 Palm Street, Jeddah", country: "Saudi Arabia", amount: 380000 },
  { id: 13, name: "Omar Farooq", address: "55 Victoria Street, Kuala Lumpur", country: "Malaysia", amount: 145000 },
  { id: 14, name: "Aisha Begum", address: "77 Green Lane, Dhaka", country: "Bangladesh", amount: 85000 },
  { id: 15, name: "Hassan Ali", address: "34 Ocean View, Maldives", country: "Maldives", amount: 210000 },
]

type SortField = "name" | "country" | "amount"
type SortOrder = "asc" | "desc"

const ITEMS_PER_PAGE = 8

export default function DonorsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort data
  const filteredDonors = useMemo(() => {
    let result = [...donorsData]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((donor) =>
        donor.name.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "country":
          comparison = a.country.localeCompare(b.country)
          break
        case "amount":
          comparison = a.amount - b.amount
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [searchQuery, sortField, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE)
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDonors.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredDonors, currentPage])

  // Total donations calculation
  const totalDonations = useMemo(() => {
    return filteredDonors.reduce((sum, donor) => sum + donor.amount, 0)
  }, [filteredDonors])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

 

  const handleDelete = (id: number) => {
    console.log("Deleting donor:", id)
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your donor database</p>
        </div>
       
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by donor name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className={cn(
                      "w-4 h-4",
                      sortField === "name" ? "text-blue-600" : "text-gray-400"
                    )} />
                  </div>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors w-32"
                  onClick={() => handleSort("country")}
                >
                  <div className="flex items-center gap-2">
                    Country
                    <ArrowUpDown className={cn(
                      "w-4 h-4",
                      sortField === "country" ? "text-blue-600" : "text-gray-400"
                    )} />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors w-36 text-right"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    <ArrowUpDown className={cn(
                      "w-4 h-4",
                      sortField === "amount" ? "text-blue-600" : "text-gray-400"
                    )} />
                  </div>
                </TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDonors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No donors found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDonors.map((donor) => (
                  <TableRow
                    key={donor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {donor.name}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {donor.address}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {donor.country}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatAmount(donor.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/donors/${donor.id}`)}
                          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(donor.id)}
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

        {/* Footer with Total and Pagination */}
        {filteredDonors.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredDonors.length)} of{" "}
                {filteredDonors.length} donors
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700 font-medium">Total Donations:</span>
                <span className="text-lg font-bold text-green-700">{formatAmount(totalDonations)}</span>
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
