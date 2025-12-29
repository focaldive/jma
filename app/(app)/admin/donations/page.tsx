"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample JSON data
const donationsData = [
  {
    id: 1,
    donorName: "Ahmed Mohamed",
    amount: 5000,
    paymentMethod: "Bank Transfer",
    date: "2024-12-20",
    status: "Completed",
    transactionId: "TXN-001234",
  },
  {
    id: 2,
    donorName: "Fathima Begum",
    amount: 2500,
    paymentMethod: "Card Payment",
    date: "2024-12-19",
    status: "Completed",
    transactionId: "TXN-001235",
  },
  {
    id: 3,
    donorName: "Ibrahim Khan",
    amount: 10000,
    paymentMethod: "Bank Transfer",
    date: "2024-12-18",
    status: "Pending",
    transactionId: "TXN-001236",
  },
  {
    id: 4,
    donorName: "Zainab Ali",
    amount: 1500,
    paymentMethod: "Cash",
    date: "2024-12-18",
    status: "Completed",
    transactionId: "TXN-001237",
  },
  {
    id: 5,
    donorName: "Mohamed Rafi",
    amount: 7500,
    paymentMethod: "Card Payment",
    date: "2024-12-17",
    status: "Failed",
    transactionId: "TXN-001238",
  },
  {
    id: 6,
    donorName: "Amina Hassan",
    amount: 3000,
    paymentMethod: "Bank Transfer",
    date: "2024-12-16",
    status: "Completed",
    transactionId: "TXN-001239",
  },
  {
    id: 7,
    donorName: "Yusuf Rahman",
    amount: 20000,
    paymentMethod: "Bank Transfer",
    date: "2024-12-15",
    status: "Completed",
    transactionId: "TXN-001240",
  },
  {
    id: 8,
    donorName: "Khadija Noor",
    amount: 4500,
    paymentMethod: "Card Payment",
    date: "2024-12-14",
    status: "Pending",
    transactionId: "TXN-001241",
  },
  {
    id: 9,
    donorName: "Abdul Kareem",
    amount: 6000,
    paymentMethod: "Cash",
    date: "2024-12-13",
    status: "Completed",
    transactionId: "TXN-001242",
  },
  {
    id: 10,
    donorName: "Safiya Jaffar",
    amount: 8500,
    paymentMethod: "Bank Transfer",
    date: "2024-12-12",
    status: "Completed",
    transactionId: "TXN-001243",
  },
  {
    id: 11,
    donorName: "Hamza Ismail",
    amount: 12000,
    paymentMethod: "Card Payment",
    date: "2024-12-11",
    status: "Failed",
    transactionId: "TXN-001244",
  },
  {
    id: 12,
    donorName: "Mariam Saleh",
    amount: 3500,
    paymentMethod: "Bank Transfer",
    date: "2024-12-10",
    status: "Completed",
    transactionId: "TXN-001245",
  },
];

type SortField = "donorName" | "amount" | "date" | "status";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "Completed" | "Pending" | "Failed";

const statusStyles = {
  Completed: "bg-green-100 text-green-700 hover:bg-green-100",
  Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Failed: "bg-red-100 text-red-700 hover:bg-red-100",
};

export default function DonationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Calculate summary stats
  const stats = useMemo(() => {
    const completed = donationsData.filter((d) => d.status === "Completed");
    const pending = donationsData.filter((d) => d.status === "Pending");
    return {
      total: completed.reduce((sum, d) => sum + d.amount, 0),
      count: donationsData.length,
      average: Math.round(
        completed.reduce((sum, d) => sum + d.amount, 0) / completed.length
      ),
      pending: pending.reduce((sum, d) => sum + d.amount, 0),
    };
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...donationsData];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.donorName.toLowerCase().includes(query) ||
          d.transactionId.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "donorName":
          comparison = a.donorName.localeCompare(b.donorName);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              placeholder="Search by name or transaction ID..."
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
                  ["all", "Completed", "Pending", "Failed"] as StatusFilter[]
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
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("donorName")}
                >
                  <div className="flex items-center gap-2">
                    Donor Name
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
                <TableHead>Payment Method</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
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
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No donations found matching your criteria
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
                    <TableCell className="font-medium text-gray-900">
                      {donation.donorName}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {formatAmount(donation.amount)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {donation.paymentMethod}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(donation.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          statusStyles[
                            donation.status as keyof typeof statusStyles
                          ]
                        )}
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-sm">
                      {donation.transactionId}
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
            Showing {filteredData.length} of {donationsData.length} donations
          </span>
          <span>
            Total:{" "}
            {formatAmount(filteredData.reduce((sum, d) => sum + d.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
