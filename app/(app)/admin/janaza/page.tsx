"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Eye,
  Cross,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statuses = ["UPCOMING", "COMPLETED", "CANCELLED"];

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  COMPLETED: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
};

const ITEMS_PER_PAGE = 6;

// Define the Janaza interface based on Prism schema
interface JanazaNotice {
  id: string;
  deceasedName: string;
  age: number | null;
  prayerDate: string | null;
  prayerTime: string | null;
  prayerLocation: string | null;
  burialLocation: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  notes: string | null;
  status: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function JanazaPage() {
  const router = useRouter();
  const [janazaData, setJanazaData] = useState<JanazaNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchJanazaAndSet = async () => {
      try {
        const response = await fetch("/api/janaza", {
          cache: "no-store", // Ensure fresh data
        });
        const data = await response.json();
        if (data.success) {
          setJanazaData(data.notices);
        }
      } catch (error) {
        console.error("Failed to fetch janaza notices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJanazaAndSet();
  }, []);

  // Filter data
  const filteredJanaza = useMemo(() => {
    let result = [...janazaData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.deceasedName.toLowerCase().includes(query) ||
          (item.prayerLocation &&
            item.prayerLocation.toLowerCase().includes(query)) ||
          (item.contactName && item.contactName.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [janazaData, searchQuery, statusFilter]); // Sorted by createdAt desc from API by default

  // Pagination
  const totalPages = Math.ceil(filteredJanaza.length / ITEMS_PER_PAGE);
  const paginatedJanaza = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJanaza.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJanaza, currentPage]);

  const handleView = (id: string) => {
    router.push(`/admin/janaza/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/janaza/new/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const response = await fetch(`/api/janaza/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setJanazaData((prev) => prev.filter((item) => item.id !== id));
        // Optional: Show toast success
      } else {
        alert("Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Error deleting notice");
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "-";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Janaza Announcements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage funeral prayer announcements
          </p>
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
                setSearchQuery(e.target.value);
                setCurrentPage(1);
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
              <span>
                {statusFilter === "all" ? "All Status" : statusFilter}
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showStatusDropdown && (
              <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setShowStatusDropdown(false);
                    setCurrentPage(1);
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
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                      setCurrentPage(1);
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
                    <p className="text-gray-500">
                      No janaza announcements found
                    </p>
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
                    <TableCell className="text-gray-600">{item.age}</TableCell>
                    <TableCell
                      className="text-gray-600"
                      suppressHydrationWarning
                    >
                      {formatDate(item.prayerDate)}
                    </TableCell>
                    <TableCell
                      className="text-gray-600"
                      suppressHydrationWarning
                    >
                      {formatTime(item.prayerTime)}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-[200px] truncate">
                      {item.prayerLocation}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          statusStyles[item.status] ||
                            "bg-gray-100 text-gray-700"
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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
  );
}
