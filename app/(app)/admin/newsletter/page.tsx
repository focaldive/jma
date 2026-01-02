"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
  Pencil,
  Trash2,
  Mail,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample subscriber data
const initialSubscribers = [
  {
    id: 1,
    email: "ahmed.cassim@email.com",
    status: "Verified",
    subscribedAt: "2024-12-15T10:30:00",
  },
  {
    id: 2,
    email: "fatima.noor@gmail.com",
    status: "Verified",
    subscribedAt: "2024-12-14T08:15:00",
  },
  {
    id: 3,
    email: "mohamed.ali@email.com",
    status: "Pending",
    subscribedAt: "2024-12-20T14:45:00",
  },
  {
    id: 4,
    email: "aisha.khan@outlook.com",
    status: "Verified",
    subscribedAt: "2024-12-10T09:00:00",
  },
  {
    id: 5,
    email: "yusuf.rahman@email.com",
    status: "Unsubscribed",
    subscribedAt: "2024-11-25T16:30:00",
  },
  {
    id: 6,
    email: "zainab.saleh@gmail.com",
    status: "Verified",
    subscribedAt: "2024-12-18T11:20:00",
  },
  {
    id: 7,
    email: "omar.faisal@email.com",
    status: "Pending",
    subscribedAt: "2024-12-22T13:00:00",
  },
  {
    id: 8,
    email: "mariam.begum@outlook.com",
    status: "Verified",
    subscribedAt: "2024-12-05T07:45:00",
  },
  {
    id: 9,
    email: "hassan.ibrahim@email.com",
    status: "Verified",
    subscribedAt: "2024-12-01T12:00:00",
  },
  {
    id: 10,
    email: "khadija.hassan@gmail.com",
    status: "Unsubscribed",
    subscribedAt: "2024-11-15T10:10:00",
  },
  {
    id: 11,
    email: "rashid.ahmed@email.com",
    status: "Pending",
    subscribedAt: "2024-12-23T15:30:00",
  },
  {
    id: 12,
    email: "amina.khan@outlook.com",
    status: "Verified",
    subscribedAt: "2024-12-08T08:00:00",
  },
];

const statuses = ["Verified", "Pending", "Unsubscribed"];

const statusStyles: Record<string, string> = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Unsubscribed: "bg-gray-100 text-gray-500",
};

type Subscriber = {
  id: number;
  email: string;
  status: string;
  subscribedAt: string;
};

const ITEMS_PER_PAGE = 8;

export default function NewsletterPage() {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(
    null
  );
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [isResending, setIsResending] = useState<number | null>(null);

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    let result = [...subscribers];

    if (searchQuery) {
      result = result.filter((s) =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
    );
  }, [subscribers, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubscribers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubscribers, currentPage]);

  // Selection
  const toggleSelect = (id: number) => {
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

  // Add subscriber
  const handleAddSubscriber = () => {
    if (!newEmail.trim()) return;
    const newSubscriber: Subscriber = {
      id: Date.now(),
      email: newEmail,
      status: newStatus,
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers((prev) => [newSubscriber, ...prev]);
    setNewEmail("");
    setNewStatus("Pending");
    setShowAddModal(false);
  };

  // Edit subscriber
  const handleSaveEdit = () => {
    if (!editingSubscriber) return;
    setSubscribers((prev) =>
      prev.map((s) => (s.id === editingSubscriber.id ? editingSubscriber : s))
    );
    setEditingSubscriber(null);
    setShowEditModal(false);
  };

  // Delete subscriber
  const handleDelete = (id: number) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // Bulk delete
  const handleBulkDelete = () => {
    setSubscribers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
  };

  // Resend verification
  const handleResendVerification = async (id: number) => {
    setIsResending(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(null);
    console.log("Verification email sent to subscriber:", id);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Email", "Status", "Subscribed Date"];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      s.status,
      new Date(s.subscribedAt).toLocaleDateString(),
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
          <h1 className="text-2xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredSubscribers.length} subscribers total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="rounded-xl border-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

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
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setShowStatusDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                      statusFilter === "all" && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Status
                  </button>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowStatusDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                        statusFilter === s && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
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
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-36">Subscribed Date</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
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
                  <TableCell className="font-medium text-gray-900">
                    {subscriber.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-medium",
                        statusStyles[subscriber.status]
                      )}
                    >
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600" suppressHydrationWarning>
                    {formatDate(subscriber.subscribedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {subscriber.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleResendVerification(subscriber.id)
                          }
                          disabled={isResending === subscriber.id}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          title="Resend verification"
                        >
                          {isResending === subscriber.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSubscriber(subscriber);
                          setShowEditModal(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
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
        {filteredSubscribers.length > 0 && (
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Subscriber
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="subscriber@email.com"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubscriber}
                disabled={!newEmail.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Add Subscriber
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Subscriber
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  value={editingSubscriber.email}
                  onChange={(e) =>
                    setEditingSubscriber({
                      ...editingSubscriber,
                      email: e.target.value,
                    })
                  }
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={editingSubscriber.status}
                  onValueChange={(v) =>
                    setEditingSubscriber({ ...editingSubscriber, status: v })
                  }
                >
                  <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
