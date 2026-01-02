"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample messages data
const initialMessages = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    subject: "Question about donation process",
    status: "Unread",
    receivedAt: "2024-12-28T14:30:00",
  },
  {
    id: 2,
    name: "Fatima Ibrahim",
    email: "fatima.ibrahim@gmail.com",
    subject: "Volunteer registration inquiry",
    status: "Read",
    receivedAt: "2024-12-27T10:15:00",
  },
  {
    id: 3,
    name: "Mohamed Ali",
    email: "mohamed.ali@email.com",
    subject: "Event sponsorship opportunity",
    status: "Replied",
    receivedAt: "2024-12-26T16:45:00",
  },
  {
    id: 4,
    name: "Aisha Khan",
    email: "aisha.khan@outlook.com",
    subject: "Requesting prayer times information",
    status: "Unread",
    receivedAt: "2024-12-28T09:00:00",
  },
  {
    id: 5,
    name: "Yusuf Rahman",
    email: "yusuf.rahman@email.com",
    subject: "Feedback on recent community event",
    status: "Read",
    receivedAt: "2024-12-25T11:30:00",
  },
  {
    id: 6,
    name: "Zainab Saleh",
    email: "zainab.saleh@gmail.com",
    subject: "Marriage hall booking inquiry",
    status: "Unread",
    receivedAt: "2024-12-28T08:00:00",
  },
  {
    id: 7,
    name: "Omar Faisal",
    email: "omar.faisal@email.com",
    subject: "Zakat distribution process",
    status: "Read",
    receivedAt: "2024-12-24T13:20:00",
  },
  {
    id: 8,
    name: "Mariam Begum",
    email: "mariam.begum@outlook.com",
    subject: "Islamic education classes for children",
    status: "Replied",
    receivedAt: "2024-12-23T15:00:00",
  },
  {
    id: 9,
    name: "Hassan Ibrahim",
    email: "hassan.ibrahim@email.com",
    subject: "Membership renewal query",
    status: "Unread",
    receivedAt: "2024-12-28T07:30:00",
  },
  {
    id: 10,
    name: "Khadija Hassan",
    email: "khadija.hassan@gmail.com",
    subject: "Thank you for the scholarship",
    status: "Read",
    receivedAt: "2024-12-22T10:00:00",
  },
];

const statuses = ["Unread", "Read", "Replied"];

const statusStyles: Record<string, string> = {
  Unread: "bg-blue-100 text-blue-700",
  Read: "bg-gray-100 text-gray-600",
  Replied: "bg-green-100 text-green-700",
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: string;
  receivedAt: string;
};

const ITEMS_PER_PAGE = 6;

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter messages
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [messages, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMessages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMessages, currentPage]);

  // Unread count
  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  // Selection
  const toggleSelect = (id: number) => {
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
  const openMessage = (id: number) => {
    router.push(`/admin/messages/${id}`);
  };

  // Toggle read status
  const toggleReadStatus = (id: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Unread" ? "Read" : "Unread" }
          : m
      )
    );
  };

  // Delete message
  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // Bulk delete
  const handleBulkDelete = () => {
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
  };

  // Bulk mark read/unread
  const handleBulkMarkRead = (read: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id)
          ? { ...m, status: read ? "Read" : "Unread" }
          : m
      )
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread messages`
              : "No unread messages"}
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
              <TableHead>Subject</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMessages.length === 0 ? (
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
                    msg.status === "Unread" && "bg-blue-50/30"
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
                      {msg.status === "Unread" ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            msg.status === "Unread"
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
                    <p
                      className={cn(
                        "text-sm truncate max-w-[250px]",
                        msg.status === "Unread"
                          ? "font-medium text-gray-900"
                          : "text-gray-600"
                      )}
                    >
                      {msg.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusStyles[msg.status])}>
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-sm text-gray-500"
                    suppressHydrationWarning
                  >
                    {formatDate(msg.receivedAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(msg.id)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title={
                          msg.status === "Unread"
                            ? "Mark as Read"
                            : "Mark as Unread"
                        }
                      >
                        {msg.status === "Unread" ? (
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
        {filteredMessages.length > 0 && (
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
    </div>
  );
}
