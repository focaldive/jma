"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  MailOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Enum matching Prisma schema
enum MessageStatus {
  NEW = "NEW",
  READ = "READ",
  REPLIED = "REPLIED",
  ARCHIVED = "ARCHIVED",
  SPAM = "SPAM",
}

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  READ: "bg-gray-100 text-gray-600",
  REPLIED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-yellow-100 text-yellow-700",
  SPAM: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  NEW: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
  SPAM: "Spam",
};

type ContactSubmission = {
  id: string; // Prisma uses Cuid (string)
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string; // ISO Date string
  priority: string;
};

const ITEMS_PER_PAGE = 10;

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/contact", window.location.origin);
      if (statusFilter !== "all") {
        url.searchParams.set("status", statusFilter);
      }

      const res = await fetch(url.toString());
      const result = await res.json();

      if (result.success) {
        setMessages(result.data);
      } else {
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]); // Re-fetch when status filter changes (server-side filtering)

  // Filter messages (Client-side search)
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          (m.subject && m.subject.toLowerCase().includes(query))
      );
    }

    // Note: Status filtering is handled by API/useEffect, but client-side search refines it.

    return result; // Already sorted by createdAt desc from API
  }, [messages, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMessages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMessages, currentPage]);

  // Unread count (based on current fetch)
  const unreadCount = messages.filter(
    (m) => m.status === MessageStatus.NEW
  ).length;

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedMessages.map((m) => m.id));
    }
  };

  // View message - navigate to detail page
  const openMessage = (id: string) => {
    router.push(`/admin/messages/${id}`);
  };

  // Toggle read status
  const toggleReadStatus = async (id: string, currentStatus: MessageStatus) => {
    const newStatus =
      currentStatus === MessageStatus.NEW
        ? MessageStatus.READ
        : MessageStatus.NEW;

    // Optimistic update
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(
          `Message marked as ${
            newStatus === MessageStatus.NEW ? "unread" : "read"
          }`
        );
      } else {
        // Revert
        setMessages((msgs) =>
          msgs.map((m) => (m.id === id ? { ...m, status: currentStatus } : m))
        );
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      // Revert
      setMessages((msgs) =>
        msgs.map((m) => (m.id === id ? { ...m, status: currentStatus } : m))
      );
      toast.error("Failed to update status");
    }
  };

  // Delete message
  const handleDelete = (id: string) => {
    setMessageToDelete(id);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    setDeleting(messageToDelete);
    try {
      const res = await fetch(`/api/contact/${messageToDelete}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setMessages((msgs) => msgs.filter((m) => m.id !== messageToDelete));
        toast.success("Message deleted successfully");
        setMessageToDelete(null);
      } else {
        toast.error(result.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  // Bulk actions (Placeholders)
  const handleBulkDelete = () => {
    toast.info("Bulk delete not yet implemented");
  };

  const handleBulkMarkRead = (read: boolean) => {
    toast.info("Bulk update not yet implemented");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage contact form submissions
          </p>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or subject..."
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
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>
                  {statusFilter === "all"
                    ? "All Status"
                    : statusLabels[statusFilter] || statusFilter}
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
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                      statusFilter === "all" && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Status
                  </button>
                  {Object.values(MessageStatus).map((s) => (
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
                      {statusLabels[s] || s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMarkRead(true)}
                className="rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" /> Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkMarkRead(false)}
                className="rounded-xl"
              >
                <EyeOff className="w-4 h-4 mr-2" /> Mark Unread
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete ({selectedIds.length}
                )
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedMessages.length > 0 &&
                    selectedIds.length === paginatedMessages.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-24">Time</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-500 mt-2">Loading messages...</p>
                </TableCell>
              </TableRow>
            ) : paginatedMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50",
                    msg.status === MessageStatus.NEW && "bg-blue-50/30"
                  )}
                  onClick={() => openMessage(msg.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(msg.id)}
                      onCheckedChange={() => toggleSelect(msg.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {msg.status === MessageStatus.NEW ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            msg.status === MessageStatus.NEW
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          {msg.name}
                        </p>
                        <p className="text-xs text-gray-500">{msg.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">{msg.phone || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusStyles[msg.status])}>
                      {statusLabels[msg.status] || msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500"
                    suppressHydrationWarning
                  >
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500"
                    suppressHydrationWarning
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(msg.id, msg.status)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title={
                          msg.status === MessageStatus.NEW
                            ? "Mark as Read"
                            : "Mark as Unread"
                        }
                      >
                        {msg.status === MessageStatus.NEW ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
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
        {filteredMessages.length > 0 && !loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)}{" "}
              of {filteredMessages.length}
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

      <Dialog
        open={!!messageToDelete}
        onOpenChange={(open) => !open && setMessageToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setMessageToDelete(null)}
              className="mt-2 sm:mt-0"
              disabled={!!deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!!deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Message"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
