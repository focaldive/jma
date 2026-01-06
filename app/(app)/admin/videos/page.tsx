"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  X,
  Pencil,
  Trash2,
  Play,
  Youtube,
  Upload,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Video = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  sourceType: string;
  youtubeUrl: string | null;
  videoFile: string | null;
  artist: string | null;
  duration: string | null;
  category: string | null;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
};

const categories = [
  "Events",
  "Health",
  "Religious",
  "Education",
  "Community",
  "Charity",
];

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [sourceType, setSourceType] = useState<"YOUTUBE" | "LOCAL">("YOUTUBE");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/videos");
      const result = await res.json();
      if (result.success) {
        setVideos(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  // Handle video upload
  const handleAddVideo = async () => {
    // Validation
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (sourceType === "YOUTUBE" && !youtubeUrl.trim()) {
      alert("Please enter a YouTube URL");
      return;
    }

    if (sourceType === "LOCAL" && !selectedFile) {
      alert("Please select a video file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let videoFilePath = null;

      // Upload file if local video
      if (sourceType === "LOCAL" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadResult.success) {
          throw new Error(
            uploadResult.message || "Failed to upload video file"
          );
        }

        videoFilePath = uploadResult.filePath;
      }

      // Create video record
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          sourceType,
          youtubeUrl: sourceType === "YOUTUBE" ? youtubeUrl : null,
          videoFile: videoFilePath,
          category: category || null,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create video");
      }

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      fetchVideos();
      alert("Video added successfully!");
    } catch (err: any) {
      console.error("Add video error:", err);
      alert(err.message || "Failed to add video");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle edit save
  const handleSaveEdit = async () => {
    if (!editingVideo) return;

    try {
      const res = await fetch(`/api/videos/${editingVideo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingVideo.title,
          description: editingVideo.description,
          category: editingVideo.category,
          isActive: editingVideo.isActive,
          isFeatured: editingVideo.isFeatured,
        }),
      });

      const result = await res.json();

      if (result.success) {
        fetchVideos();
        setEditingVideo(null);
        setShowEditModal(false);
        alert("Video updated successfully!");
      } else {
        alert(result.message || "Failed to update video");
      }
    } catch (err) {
      alert("Failed to update video");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        fetchVideos();
        alert("Video deleted successfully!");
      } else {
        alert(result.message || "Failed to delete video");
      }
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  // Reset form
  const resetForm = () => {
    setSourceType("YOUTUBE");
    setYoutubeUrl("");
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
  };

  // Get video URL for preview
  const getVideoUrl = (video: Video) => {
    if (video.sourceType === "YOUTUBE" && video.youtubeUrl) {
      const youtubeId = extractYoutubeId(video.youtubeUrl);
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    }
    return video.videoFile || "";
  };

  // Extract YouTube ID
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your video library
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-end gap-1 bg-gray-100 p-1 rounded-xl w-fit ml-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-500 mt-2">Loading videos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => {
            // Get thumbnail URL
            const getThumbnailUrl = () => {
              if (video.thumbnail) return video.thumbnail;
              if (video.sourceType === "YOUTUBE" && video.youtubeUrl) {
                const youtubeId = extractYoutubeId(video.youtubeUrl);
                return youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                  : null;
              }
              return null;
            };

            const thumbnailUrl = getThumbnailUrl();

            return (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div
                    onClick={() => {
                      setPreviewVideo(video);
                      setShowPreviewModal(true);
                    }}
                    className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white/90 rounded-full">
                      <Play className="w-6 h-6 text-gray-900 fill-gray-900" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        video.sourceType === "YOUTUBE"
                          ? "bg-red-100 text-red-700"
                          : "bg-purple-100 text-purple-700"
                      )}
                    >
                      {video.sourceType === "YOUTUBE" ? (
                        <>
                          <Youtube className="w-3 h-3 mr-1" />
                          YouTube
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 mr-1" />
                          Local
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {video.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    {video.category && (
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPreviewVideo(video);
                          setShowPreviewModal(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingVideo(video);
                          setShowEditModal(true);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(video.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {!loading && !error && viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Source</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => {
                // Get thumbnail URL
                const getThumbnailUrl = () => {
                  if (video.thumbnail) return video.thumbnail;
                  if (video.sourceType === "YOUTUBE" && video.youtubeUrl) {
                    const youtubeId = extractYoutubeId(video.youtubeUrl);
                    return youtubeId
                      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                      : null;
                  }
                  return null;
                };

                const thumbnailUrl = getThumbnailUrl();

                return (
                  <TableRow key={video.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {video.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {video.description || "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          video.sourceType === "YOUTUBE"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        )}
                      >
                        {video.sourceType === "YOUTUBE" ? "YouTube" : "Local"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {video.category && (
                        <Badge variant="outline">{video.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewVideo(video);
                            setShowPreviewModal(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingVideo(video);
                            setShowEditModal(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No videos yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first video to get started
          </p>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Add New Video
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Source Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Video Source
                </Label>
                <Select
                  value={sourceType}
                  onValueChange={(v: "YOUTUBE" | "LOCAL") => setSourceType(v)}
                >
                  <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YOUTUBE">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube Video
                      </div>
                    </SelectItem>
                    <SelectItem value="LOCAL">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-purple-500" />
                        Upload Video File
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* YouTube URL */}
              {sourceType === "YOUTUBE" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    YouTube URL
                  </Label>
                  <div className="mt-2 relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <Input
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="pl-11 rounded-xl bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* File Upload */}
              {sourceType === "LOCAL" && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Video File
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Max file size: 100MB. Supported formats: MP4, WebM, MOV, AVI
                  </p>
                </div>
              )}

              {/* Title */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Title *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Video
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  value={editingVideo.description || ""}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select
                  value={editingVideo.category || ""}
                  onValueChange={(v) =>
                    setEditingVideo({ ...editingVideo, category: v })
                  }
                >
                  <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
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

      {/* Preview Modal */}
      {showPreviewModal && previewVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">{previewVideo.title}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden">
              {previewVideo.sourceType === "YOUTUBE" ? (
                <iframe
                  src={getVideoUrl(previewVideo)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={previewVideo.videoFile || ""}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
