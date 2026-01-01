"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowUpDown,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Donor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
  totalAmount: number;
  currency: string;
  donationCount: number;
  lastDonation: string;
}

type SortField = "name" | "country" | "amount";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 8;

export default function DonorsPage() {
  const router = useRouter();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch donors from API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch("/api/donors");
        const data = await res.json();
        if (data.success) {
          setDonors(data.donors);
        } else {
          setError(data.message || "Failed to fetch donors");
        }
      } catch (err) {
        setError("Failed to fetch donors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  // Filter and sort data
  const filteredDonors = useMemo(() => {
    let result = [...donors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (donor) =>
          donor.name.toLowerCase().includes(query) ||
          donor.email?.toLowerCase().includes(query) ||
          donor.country?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "country":
          comparison = (a.country || "").localeCompare(b.country || "");
          break;
        case "amount":
          comparison = a.totalAmount - b.totalAmount;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [donors, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE);
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDonors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDonors, currentPage]);

  // Total donations calculation
  const totalDonations = useMemo(() => {
    return filteredDonors.reduce((sum, donor) => sum + donor.totalAmount, 0);
  }, [filteredDonors]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor?")) return;
    console.log("Deleting donor:", id);
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getCountryName = (code: string | null) => {
    const countries: Record<string, string> = {
      us: "United States",
      ca: "Canada",
      uk: "United Kingdom",
      au: "Australia",
      lk: "Sri Lanka",
      other: "Other",
    };
    return code ? countries[code] || code : "Not specified";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your donor database ({donors.length} donors)
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or country..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
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
                    <ArrowUpDown
                      className={cn(
                        "w-4 h-4",
                        sortField === "name" ? "text-blue-600" : "text-gray-400"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors w-32"
                  onClick={() => handleSort("country")}
                >
                  <div className="flex items-center gap-2">
                    Country
                    <ArrowUpDown
                      className={cn(
                        "w-4 h-4",
                        sortField === "country"
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors w-36 text-right"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Total Amount
                    <ArrowUpDown
                      className={cn(
                        "w-4 h-4",
                        sortField === "amount"
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                    />
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
                    <p className="text-gray-500">
                      {donors.length === 0
                        ? "No donors yet"
                        : "No donors found matching your search"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDonors.map((donor) => (
                  <TableRow
                    key={donor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      <div>
                        <p>{donor.name}</p>
                        {donor.email && (
                          <p className="text-sm text-gray-500">{donor.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {donor.address || "Not provided"}
                      {donor.region && `, ${donor.region}`}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {getCountryName(donor.country)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {formatAmount(donor.totalAmount, donor.currency)}
                      <p className="text-xs text-gray-500 font-normal">
                        {donor.donationCount} donation
                        {donor.donationCount > 1 ? "s" : ""}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/donations/${donor.id}`)
                          }
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredDonors.length)}{" "}
                of {filteredDonors.length} donors
              </p>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700 font-medium">
                  Total Donations:
                </span>
                <span className="text-lg font-bold text-green-700">
                  {formatAmount(totalDonations)}
                </span>
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

              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1
              ).map((page) => (
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
