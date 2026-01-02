"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  ArrowUpDown,
  FileText,
  Loader2,
  Pencil,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featuredImage: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type SortField = "title" | "createdAt";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.success) {
          setArticles(data.articles);
        } else {
          setError(data.message || "Failed to fetch articles");
        }
      } catch (err) {
        setError("Failed to fetch articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filter and sort data
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [articles, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert(data.message || "Failed to delete article");
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      alert("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your news articles ({articles.length} total)
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/news/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown
                      className={cn(
                        "w-4 h-4",
                        sortField === "title"
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Category</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100 transition-colors w-36"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown
                      className={cn(
                        "w-4 h-4",
                        sortField === "createdAt"
                          ? "text-blue-600"
                          : "text-gray-400"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {articles.length === 0
                        ? "No articles yet. Create your first one!"
                        : "No articles found matching your search"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedArticles.map((article) => (
                  <TableRow
                    key={article.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-14 h-10 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-md">
                      {truncateContent(article.excerpt || article.content)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-gray-600"
                      suppressHydrationWarning
                    >
                      {formatDate(article.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/news/${article.id}/edit`)
                          }
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          {deleting === article.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Pagination */}
        {filteredArticles.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)}{" "}
              of {filteredArticles.length} articles
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1
              ).map((page) => (
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
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
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
