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
  Plus,
  Trash2,
  Pencil,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Mail,
  Calendar,
  LayoutGrid,
  LayoutList,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  isActive: boolean;
  avatar: string | null;
  createdAt: string;
}

const roles = ["ADMIN", "EDITOR", "VIEWER"];
const statuses = ["Active", "Disabled"];

const roleStyles: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  EDITOR: "bg-blue-100 text-blue-700",
  VIEWER: "bg-gray-100 text-gray-700",
};

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Disabled: "bg-red-100 text-red-700",
};

const ITEMS_PER_PAGE = 6;

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "Active";
      result = result.filter(
        (u) => (u.isActive ? "Active" : "Disabled") === statusFilter
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id));
    }
  };

  // Actions
  const handleView = (user: UserType) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/settings/users/${id}/edit`);
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      // TODO: Add API call to delete user
    }
  };

  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    // TODO: Add API call to bulk delete
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusLabel = (isActive: boolean) =>
    isActive ? "Active" : "Disabled";

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
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLoading ? "Loading..." : `${filteredUsers.length} users total`}
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/admin/settings/users/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
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
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="border-gray-200 rounded-xl min-w-[110px] justify-between"
              >
                <span>{roleFilter === "all" ? "All Roles" : roleFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showRoleDropdown && (
                <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => {
                      setRoleFilter("all");
                      setShowRoleDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                      roleFilter === "all" && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All Roles
                  </button>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRoleFilter(r);
                        setShowRoleDropdown(false);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                        roleFilter === r && "bg-blue-50 text-blue-600"
                      )}
                    >
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
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
                <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
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

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete ({selectedIds.length}
                )
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
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : (
        <>
          {/* Users List View */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          paginatedUsers.length > 0 &&
                          selectedIds.length === paginatedUsers.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-24">Role</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-28">Created</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(user.id)}
                            onCheckedChange={() => toggleSelect(user.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name || "User"}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900">
                              {user.name || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs",
                              roleStyles[user.role] || "bg-gray-100"
                            )}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs",
                              statusStyles[getStatusLabel(user.isActive)]
                            )}
                          >
                            {getStatusLabel(user.isActive)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(user)}
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(user)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
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
              {filteredUsers.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredUsers.length
                    )}{" "}
                    of {filteredUsers.length}
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
                            currentPage === page &&
                              "bg-blue-600 hover:bg-blue-700"
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
          )}

          {/* Users Grid View */}
          {viewMode === "grid" && (
            <div>
              {paginatedUsers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={cn(
                        "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md hover:border-gray-200 relative group",
                        selectedIds.includes(user.id) &&
                          "ring-2 ring-blue-500 border-blue-200"
                      )}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 left-4">
                        <Checkbox
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                          className="bg-white"
                        />
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button
                          onClick={() => handleView(user)}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* User Info */}
                      <div className="flex flex-col items-center text-center pt-4">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || "User"}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-gray-100">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mt-3">
                          {user.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 truncate w-full">
                          {user.email}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <Badge
                            className={cn(
                              "text-xs",
                              roleStyles[user.role] || "bg-gray-100"
                            )}
                          >
                            {user.role}
                          </Badge>
                          <Badge
                            className={cn(
                              "text-xs",
                              statusStyles[getStatusLabel(user.isActive)]
                            )}
                          >
                            {getStatusLabel(user.isActive)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredUsers.length
                    )}{" "}
                    of {filteredUsers.length}
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
                            currentPage === page &&
                              "bg-blue-600 hover:bg-blue-700"
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
          )}

          {/* View Modal */}
          {showViewModal && selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name || "User"}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-gray-100">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mt-3">
                      {selectedUser.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={cn(
                          "text-xs",
                          roleStyles[selectedUser.role] || "bg-gray-100"
                        )}
                      >
                        {selectedUser.role}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          statusStyles[getStatusLabel(selectedUser.isActive)]
                        )}
                      >
                        {getStatusLabel(selectedUser.isActive)}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    {/* Removed Phone */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedUser.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                    className="rounded-xl"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedUser.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delete User?
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Are you sure you want to delete{" "}
                    <strong>{selectedUser.name}</strong>? This action cannot be
                    undone.
                  </p>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
