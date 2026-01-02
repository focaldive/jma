"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/badge";
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
  Heart,
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  ArrowUpDown,
  Filter,
  Download,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  category: string | null;
  status: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

type SortField = "name" | "amount" | "date" | "status" | "category";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700 hover:bg-green-100",
  PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  FAILED: "bg-red-100 text-red-700 hover:bg-red-100",
  REFUNDED: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

export default function DonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Fetch donations from API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("/api/donations");
        const data = await res.json();
        if (data.success) {
          setDonations(data.donations);
        } else {
          setError(data.message || "Failed to fetch donations");
        }
      } catch (err) {
        setError("Failed to fetch donations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Calculate summary stats
  const stats = useMemo(() => {
    const completed = donations.filter((d) => d.status === "COMPLETED");
    const pending = donations.filter((d) => d.status === "PENDING");
    const totalCompleted = completed.reduce(
      (sum, d) => sum + Number(d.amount),
      0
    );
    return {
      total: totalCompleted,
      count: donations.length,
      average:
        completed.length > 0
          ? Math.round(totalCompleted / completed.length)
          : 0,
      pending: pending.reduce((sum, d) => sum + Number(d.amount), 0),
    };
  }, [donations]);

  // Get donor name
  const getDonorName = (donation: Donation) => {
    if (donation.isAnonymous) return "Anonymous";
    const name = [donation.firstName, donation.lastName]
      .filter(Boolean)
      .join(" ");
    return name || "Unknown";
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...donations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((d) => {
        const name = getDonorName(d).toLowerCase();
        const email = d.email?.toLowerCase() || "";
        const id = d.id.toLowerCase();
        return (
          name.includes(query) || email.includes(query) || id.includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = getDonorName(a).localeCompare(getDonorName(b));
          break;
        case "amount":
          comparison = Number(a.amount) - Number(b.amount);
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [donations, searchQuery, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all donation activities
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Donations"
          value={formatAmount(stats.total)}
          change="Completed donations"
          changeType="neutral"
          icon={Heart}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Total Count"
          value={stats.count}
          change="All transactions"
          changeType="neutral"
          icon={DollarSign}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Average Donation"
          value={formatAmount(stats.average)}
          change="Per completed donation"
          changeType="neutral"
          icon={TrendingUp}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Pending Amount"
          value={formatAmount(stats.pending)}
          change="Awaiting confirmation"
          changeType="neutral"
          icon={Clock}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="border-gray-200 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Status: {statusFilter === "all" ? "All" : statusFilter}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                {(
                  [
                    "all",
                    "COMPLETED",
                    "PENDING",
                    "FAILED",
                    "REFUNDED",
                  ] as StatusFilter[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
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
        </div>

        {/* Table */}
        <div className="max-h-[500px] overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-2">
                    Category
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {donations.length === 0
                      ? "No donations yet"
                      : "No donations found matching your criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((donation) => (
                  <TableRow
                    key={donation.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(`/admin/donations/${donation.id}`)
                    }
                  >
                    <TableCell className="font-mono text-sm text-gray-500">
                      {donation.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {getDonorName(donation)}
                    </TableCell>
                    <TableCell
                      className="font-semibold text-gray-900"
                      suppressHydrationWarning
                    >
                      {formatAmount(Number(donation.amount), donation.currency)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {donation.category || "General"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          statusStyles[donation.status] || statusStyles.PENDING
                        )}
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-gray-600"
                      suppressHydrationWarning
                    >
                      {formatDate(donation.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <span>
            Showing {filteredData.length} of {donations.length} donations
          </span>
          <span>
            Total:{" "}
            <span suppressHydrationWarning>
              {formatAmount(
                filteredData.reduce((sum, d) => sum + Number(d.amount), 0)
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
