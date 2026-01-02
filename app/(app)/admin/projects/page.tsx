"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  FolderKanban,
  LayoutGrid,
  LayoutList,
  MapPin,
  Calendar,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

interface Project {
  id: string;
  title: string | null;
  image: string | null;
  year: number;
  month: string;
  description: string;
  location: string;
  currency: string;
  amount: number | string;
  status: string;
  beneficiaries: number | null;
  isPublished: boolean;
  createdAt: string;
}

const ITEMS_PER_PAGE = 8;

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter data
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title?.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, projects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const totalAmount = useMemo(() => {
    return filteredProjects.reduce((sum, project) => {
      const amt =
        typeof project.amount === "string"
          ? parseFloat(project.amount)
          : project.amount;
      return sum + amt;
    }, 0);
  }, [filteredProjects]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProjects.map((project) => project.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects(projects.filter((p) => p.id !== id));
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const isAllSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((project) => selectedIds.includes(project.id));

 const formatAmount = (amount: number | string, currency: string) => {
  const normalized = (currency || "USD").toUpperCase();

  const currencyMap: Record<string, string> = {
    RS: "LKR", // Sri Lankan Rupees
    INR: "INR",
    LKR: "LKR",
    USD: "USD",
    GBP: "GBP",
    EUR: "EUR",
  };

  const finalCurrency = currencyMap[normalized] || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: finalCurrency,
    minimumFractionDigits: 0,
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all project activities
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/projects/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
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

      {/* View Content */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No projects found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(project.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(project.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {project.title || project.description}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.location}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.month} {project.year}
                    </TableCell>
                    <TableCell
                      className="text-right font-semibold"
                      suppressHydrationWarning
                    >
                      {formatAmount(project.amount, project.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/projects/${project.id}/edit`)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="h-8 w-8 p-0 text-red-500"
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className="rounded-2xl overflow-hidden border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative bg-gray-100">
                {project.image ? (
                  <img
                    src={project.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() =>
                      router.push(`/admin/projects/${project.id}/edit`)
                    }
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-gray-900 line-clamp-1">
                  {project.title || "Untitled Project"}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5rem]">
                  {project.description}
                </p>
                <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {project.month} {project.year}
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                  <p
                    className="text-blue-600 font-bold"
                    suppressHydrationWarning
                  >
                    {formatAmount(project.amount, project.currency)}
                  </p>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      project.isPublished ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer with Total and Pagination */}
      {filteredProjects.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 mt-6 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <p className="text-sm text-gray-600">
              Showing {filteredProjects.length} projects
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-xl">
              <span className="text-sm text-blue-700 font-medium">
                Total Project Value:
              </span>
              <span
                className="text-lg font-bold text-blue-700"
                suppressHydrationWarning
              >
                {formatAmount(totalAmount, "GBP")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 rounded-xl",
                  currentPage === page && "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
