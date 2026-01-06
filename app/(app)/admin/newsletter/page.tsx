"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Trash2,
  Mail,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Type matching Prisma model (partial)
type Subscriber = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  source: string | null;
  ipAddress: string | null;
  isVerified: boolean;
  verifyToken: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  unsubscribeReason: string | null;
};

const ITEMS_PER_PAGE = 10;

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch subscribers from API
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/newsletter");
      const result = await res.json();

      if (result.success) {
        setSubscribers(result.data);
      } else {
        toast.error("Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    let result = [...subscribers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.email.toLowerCase().includes(query) ||
          (s.firstName && s.firstName.toLowerCase().includes(query)) ||
          (s.lastName && s.lastName.toLowerCase().includes(query))
      );
    }

    // Sort by most recent
    return result.sort(
      (a, b) =>
        new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
    );
  }, [subscribers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubscribers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubscribers, currentPage]);

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedSubscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSubscribers.map((s) => s.id));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} subscriber(s)?`
      )
    )
      return;

    try {
      setLoading(true);
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setSubscribers((prev) =>
          prev.filter((s) => !selectedIds.includes(s.id))
        );
        setSelectedIds([]);
      } else {
        toast.error(result.message || "Failed to delete subscribers");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      setLoading(true);
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        if (selectedIds.includes(id)) {
          setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
      } else {
        toast.error(result.message || "Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete subscriber");
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Email",
      "First Name",
      "Last Name",
      "Source",
      "Subscribed Date",
      "IP Address",
    ];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      s.firstName || "-",
      s.lastName || "-",
      s.source || "-",
      new Date(s.subscribedAt).toLocaleDateString(),
      s.ipAddress || "-",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredSubscribers.length} total subscribers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="rounded-xl border-gray-200"
            disabled={filteredSubscribers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedSubscribers.length > 0 &&
                    selectedIds.length === paginatedSubscribers.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-36">Subscribed</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-500 mt-2">Loading subscribers...</p>
                </TableCell>
              </TableRow>
            ) : paginatedSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subscribers found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(subscriber.id)}
                      onCheckedChange={() => toggleSelect(subscriber.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {subscriber.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {subscriber.ipAddress || "No IP"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.firstName || subscriber.lastName ? (
                      <span className="text-gray-700">
                        {[subscriber.firstName, subscriber.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No name</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {subscriber.source || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600" suppressHydrationWarning>
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subscriber.id)}
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
        {filteredSubscribers.length > 0 && !loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredSubscribers.length
              )}{" "}
              of {filteredSubscribers.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
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
