"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  LayoutGrid,
  List,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  linkedin: string | null;
  twitter: string | null;
  order: number;
  isActive: boolean;
  showOnSite: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const savedView = localStorage.getItem("teamViewMode");
    if (savedView === "grid" || savedView === "list") {
      setViewMode(savedView);
    }
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      const result = await res.json();

      if (result.success) {
        setTeamMembers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setMemberToDelete(id);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    setDeleting(memberToDelete);
    try {
      const res = await fetch(`/api/team/${memberToDelete}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        fetchTeamMembers();
        toast.success("Team member deleted successfully!");
        setMemberToDelete(null);
      } else {
        toast.error(result.message || "Failed to delete team member");
      }
    } catch (err) {
      toast.error("Failed to delete team member");
    } finally {
      setDeleting(null);
    }
  };

  const toggleShowOnSite = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnSite: !member.showOnSite }),
      });

      const result = await res.json();

      if (result.success) {
        fetchTeamMembers();
        toast.success(
          `Team member ${!member.showOnSite ? "visible" : "hidden"} on site`
        );
      } else {
        toast.error(result.message || "Failed to update team member");
      }
    } catch (err) {
      toast.error("Failed to update team member");
    }
  };

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("teamViewMode", mode);
  };

  // Get unique departments
  const departments = Array.from(
    new Set(teamMembers.map((m) => m.department).filter(Boolean))
  );

  // Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email &&
        member.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members</p>
        </div>
        <Button
          onClick={() => router.push("/admin/team/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, or email..."
                className="pl-10 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>

            {/* Department Filter */}
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full sm:w-48 rounded-xl bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept!}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleViewChange("grid")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-500 mt-2">Loading team members...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {!member.isActive && (
                    <Badge className="bg-red-100 text-red-700 text-xs">
                      Inactive
                    </Badge>
                  )}
                  {!member.showOnSite && (
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                {member.department && (
                  <Badge variant="outline" className="text-xs mt-2">
                    {member.department}
                  </Badge>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/team/${member.id}/edit`)}
                    className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleShowOnSite(member)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    {member.showOnSite ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && !error && viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    {member.email && (
                      <p className="text-sm text-gray-500">{member.email}</p>
                    )}
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {member.department && (
                      <Badge variant="outline">{member.department}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge
                        className={cn(
                          "text-xs",
                          member.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {!member.showOnSite && (
                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/team/${member.id}/edit`)
                        }
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowOnSite(member)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        {member.showOnSite ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No team members found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery || departmentFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first team member to get started"}
          </p>
        </div>
      )}

      <Dialog
        open={!!memberToDelete}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team member? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setMemberToDelete(null)}
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
                "Delete Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
