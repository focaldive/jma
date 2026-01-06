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
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
  Shield,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Key,
  UserCog,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Monitor,
  Globe,
  Calendar,
  Filter,
  LayoutList,
  LayoutGrid,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ActionType =
  | "Create"
  | "Update"
  | "Delete"
  | "Login"
  | "Logout"
  | "PasswordChange"
  | "RoleChange"
  | "FailedLogin";
type ResourceType =
  | "News"
  | "Projects"
  | "Events"
  | "Donations"
  | "Settings"
  | "Users"
  | "Messages"
  | "Auth";
type StatusType = "Success" | "Failed" | "Warning";
type ViewMode = "list" | "feed";

interface ActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  action: ActionType;
  resource: ResourceType;
  resourceId?: string;
  description: string;
  details?: string;
  ipAddress: string;
  device?: string;
  userAgent?: string; // Replaces device/browser usually
  browser?: string;
  status: StatusType; // Derived usually
  timestamp: string;
  isSecurityEvent: boolean;
}

// Style mappings
const actionStyles: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Create: { bg: "bg-green-100", text: "text-green-700", icon: Plus },
  Update: { bg: "bg-blue-100", text: "text-blue-700", icon: Pencil },
  Delete: { bg: "bg-red-100", text: "text-red-700", icon: Trash2 },
  Login: { bg: "bg-emerald-100", text: "text-emerald-700", icon: LogIn },
  Logout: { bg: "bg-gray-100", text: "text-gray-700", icon: LogOut },
  PasswordChange: { bg: "bg-purple-100", text: "text-purple-700", icon: Key },
  RoleChange: { bg: "bg-orange-100", text: "text-orange-700", icon: UserCog },
  FailedLogin: { bg: "bg-red-100", text: "text-red-700", icon: AlertTriangle },
  // Default fallback
  Default: { bg: "bg-gray-100", text: "text-gray-700", icon: Activity },
};

const statusStyles: Record<
  StatusType,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Success: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  Failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  Warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: AlertTriangle,
  },
};

const ITEMS_PER_PAGE = 20;

export default function ActivityLogsPage() {
  const router = useRouter();
  // State
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<string | "all">("all");
  const [resourceFilter, setResourceFilter] = useState<string | "all">("all");
  const [actionFilter, setActionFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [securityOnly, setSecurityOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Dropdowns
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (userFilter !== "all") params.append("userId", userFilter);
      if (resourceFilter !== "all") params.append("resource", resourceFilter);
      if (actionFilter !== "all") params.append("action", actionFilter);
      if (securityOnly) params.append("securityOnly", "true");
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        // Transform API data to frontend model
        const transformedLogs = data.logs.map((log: any) => ({
          id: log.id,
          userId: log.userId,
          // ... rest of mapping
          userName: log.adminUser?.name || "System/Unknown",
          userEmail: log.adminUser?.email || "N/A",
          userAvatar: log.adminUser?.avatar,
          action: log.action,
          resource: log.resource,
          description: log.description,
          details: log.details,
          ipAddress: log.ipAddress || "Unknown",
          userAgent: log.userAgent,
          timestamp: log.createdAt,
          isSecurityEvent: log.isSecurityEvent,
          status: log.action === "FailedLogin" ? "Failed" : "Success",
        }));
        setLogs(transformedLogs);
      } else {
        console.error("API Error:", data.message);
        setError(data.message || "Failed to fetch logs");
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setError("Network or server error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [
    userFilter,
    resourceFilter,
    actionFilter,
    securityOnly,
    dateFrom,
    dateTo,
  ]); // refetch on filter change

  // Filter logs locally for search (or server side if preferred, currently server filters specific fields)
  // We keep search client-side for immediate feedback on the returned set
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(query) ||
          log.userEmail.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.resource.toLowerCase().includes(query)
      );
    }

    // Status filter is client-side derived currently
    if (statusFilter !== "all") {
      result = result.filter((log) => log.status === statusFilter);
    }

    return result;
  }, [logs, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // Handlers
  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "Timestamp",
      "User",
      "Email",
      "Action",
      "Resource",
      "Description",
      "Status",
      "IP Address",
    ];
    const rows = filteredLogs.map((log) => [
      formatDateTime(log.timestamp),
      log.userName,
      log.userEmail,
      log.action,
      log.resource,
      log.description,
      log.status,
      log.ipAddress,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `activity-logs-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setUserFilter("all");
    setResourceFilter("all");
    setActionFilter("all");
    setStatusFilter("all");
    setSecurityOnly(false);
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasActiveFilters =
    userFilter !== "all" ||
    resourceFilter !== "all" ||
    actionFilter !== "all" ||
    statusFilter !== "all" ||
    securityOnly ||
    dateFrom ||
    dateTo;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/settings")}
            className="hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Activity Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLoading ? "Loading..." : `${filteredLogs.length} activities`} •{" "}
              {filteredLogs.filter((l) => l.isSecurityEvent).length} security
              events
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-gray-200 rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-0 z-30">
        <div className="flex flex-col gap-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user, email, or description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>

              {/* Security Filter Toggle */}
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <Checkbox
                  checked={securityOnly}
                  onCheckedChange={(checked) => {
                    setSecurityOnly(checked as boolean);
                    setCurrentPage(1);
                  }}
                />
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700">Security Events</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  <X className="w-4 h-4 mr-1" /> Clear Filters
                </Button>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("feed")}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    viewMode === "feed"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-medium">Error loading logs: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Loading activity logs...</p>
        </div>
      ) : (
        <>
          {/* Logs List View */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead className="w-1/3">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No activity logs found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log) => {
                      const ActionIcon =
                        actionStyles[log.action]?.icon ||
                        actionStyles.Default.icon;
                      const statusStyle =
                        statusStyles[log.status] || statusStyles.Success;
                      return (
                        <TableRow key={log.id} className="hover:bg-gray-50">
                          <TableCell className="whitespace-nowrap text-gray-500 text-sm">
                            {formatDateTime(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {log.userAvatar ? (
                                <img
                                  src={log.userAvatar}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                  {log.userName.charAt(0)}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-gray-900">
                                  {log.userName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {log.userEmail}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs gap-1",
                                actionStyles[log.action]?.bg || "bg-gray-100",
                                actionStyles[log.action]?.text ||
                                  "text-gray-700"
                              )}
                            >
                              <ActionIcon className="w-3 h-3" />
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-50 text-gray-600"
                            >
                              {log.resource}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {log.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs gap-1",
                                statusStyle.bg,
                                statusStyle.text
                              )}
                            >
                              <statusStyle.icon className="w-3 h-3" />
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(log)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Logs Feed View (Timeline) */}
          {viewMode === "feed" && (
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {paginatedLogs.map((log) => {
                const ActionIcon =
                  actionStyles[log.action]?.icon || actionStyles.Default.icon;
                return (
                  <div
                    key={log.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-blue-600 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <time className="font-caveat font-medium text-blue-600 text-sm">
                          {formatDateTime(log.timestamp)}
                        </time>
                        {log.isSecurityEvent && (
                          <Shield className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-start gap-3">
                        {log.userAvatar ? (
                          <img
                            src={log.userAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full mt-1"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold mt-1 max-w-[32px]">
                            {log.userName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 font-medium text-sm">
                            <span className="font-bold">{log.userName}</span>{" "}
                            {log.description.toLowerCase()}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            IP: {log.ipAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
                {filteredLogs.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Log Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {selectedLog.userAvatar ? (
                  <img
                    src={selectedLog.userAvatar}
                    alt=""
                    className="w-12 h-12 rounded-full "
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                    {selectedLog.userName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedLog.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedLog.userEmail}
                  </p>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">Action</span>
                  <Badge
                    className={cn(
                      "mt-1",
                      actionStyles[selectedLog.action]?.bg,
                      actionStyles[selectedLog.action]?.text
                    )}
                  >
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Status</span>
                  <Badge className="mt-1 bg-gray-100 text-gray-700">
                    {selectedLog.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 block">Timestamp</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDateTime(selectedLog.timestamp)}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 block">
                    Description
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedLog.description}
                  </p>
                </div>
              </div>

              {/* Technical Details */}
              <div className="p-3 bg-gray-900 rounded-xl text-gray-300 font-mono text-xs overflow-x-auto">
                <p>IP: {selectedLog.ipAddress}</p>
                <p>User-Agent: {selectedLog.userAgent}</p>
                <p className="mt-2 text-white font-bold">Details Payload:</p>
                <pre className="mt-1 text-green-400 whitespace-pre-wrap">
                  {selectedLog.details || "No additional details"}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <Button onClick={() => setShowDetailModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
