"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Play,
  LayoutGrid,
  List,
  GripVertical,
  Loader2,
  Youtube,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample video data
const initialVideos = [
  { id: 1, title: "Annual Charity Gala Highlights 2024", description: "Watch the highlights from our annual charity gala event featuring dinner and fundraising activities.", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", youtubeId: "dQw4w9WgXcQ", category: "Events", status: "Published", duration: "15:32" },
  { id: 2, title: "Community Health Camp Documentary", description: "A documentary covering the free health camp organized for community members.", thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg", youtubeId: "9bZkp7q19f0", category: "Health", status: "Published", duration: "23:45" },
  { id: 3, title: "Ramadan Iftar 2024", description: "Community iftar gathering during the holy month of Ramadan.", thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg", youtubeId: "kJQP7kiw5Fk", category: "Religious", status: "Published", duration: "8:20" },
  { id: 4, title: "Youth Leadership Workshop", description: "Leadership and skill development workshop for young community members.", thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg", youtubeId: "RgKAFK5djSk", category: "Education", status: "Draft", duration: "45:10" },
  { id: 5, title: "Eid Celebration 2024", description: "Eid prayers and celebration moments from the mosque.", thumbnail: "https://img.youtube.com/vi/fRh_vgS2dFE/hqdefault.jpg", youtubeId: "fRh_vgS2dFE", category: "Religious", status: "Published", duration: "12:55" },
  { id: 6, title: "Scholarship Award Ceremony", description: "Annual scholarship award ceremony for deserving students.", thumbnail: "https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg", youtubeId: "CevxZvSJLk8", category: "Education", status: "Draft", duration: "35:20" },
]

const categories = ["Events", "Health", "Religious", "Education", "Community", "Charity"]
const statuses = ["Published", "Draft"]

type Video = {
  id: number
  title: string
  description: string
  thumbnail: string
  youtubeId: string
  category: string
  status: string
  duration: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("videoViewMode")
    if (savedView === "grid" || savedView === "list") {
      setViewMode(savedView)
    }
  }, [])

  // Save view preference to localStorage
  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode)
    localStorage.setItem("videoViewMode", mode)
  }

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = [...videos]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((v) =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((v) => v.category === categoryFilter)
    }

    return result
  }, [videos, searchQuery, statusFilter, categoryFilter])

  // Extract YouTube ID from URL
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Add new video
  const handleAddVideo = async () => {
    const youtubeId = extractYoutubeId(newVideoUrl)
    if (!youtubeId) {
      alert("Invalid YouTube URL")
      return
    }

    setIsLoading(true)

    // Simulate fetching metadata (in real app, use YouTube oEmbed API)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newVideo: Video = {
      id: Date.now(),
      title: `New Video ${videos.length + 1}`,
      description: "Click edit to add description",
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      youtubeId,
      category: "Events",
      status: "Draft",
      duration: "0:00",
    }

    setVideos((prev) => [newVideo, ...prev])
    setNewVideoUrl("")
    setShowAddModal(false)
    setIsLoading(false)
    setEditingVideo(newVideo)
    setShowEditModal(true)
  }

  // Save edited video
  const handleSaveEdit = () => {
    if (!editingVideo) return
    setVideos((prev) =>
      prev.map((v) => (v.id === editingVideo.id ? editingVideo : v))
    )
    setEditingVideo(null)
    setShowEditModal(false)
  }

  // Delete video
  const handleDelete = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  // Drag and drop reorder
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === id) return

    const draggedIndex = videos.findIndex((v) => v.id === draggedItem)
    const targetIndex = videos.findIndex((v) => v.id === id)

    if (draggedIndex !== targetIndex) {
      const newVideos = [...videos]
      const [removed] = newVideos.splice(draggedIndex, 1)
      newVideos.splice(targetIndex, 0, removed)
      setVideos(newVideos)
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your video gallery</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="border-gray-200 rounded-xl min-w-[120px] justify-between"
              >
                <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showStatusDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setStatusFilter("all"); setShowStatusDropdown(false) }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Status
                  </button>
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setShowStatusDropdown(false) }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", statusFilter === s && "bg-blue-50 text-blue-600")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="border-gray-200 rounded-xl min-w-[130px] justify-between"
              >
                <span>{categoryFilter === "all" ? "All Categories" : categoryFilter}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              {showCategoryDropdown && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setCategoryFilter("all"); setShowCategoryDropdown(false) }}
                    className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", categoryFilter === "all" && "bg-blue-50 text-blue-600")}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategoryFilter(c); setShowCategoryDropdown(false) }}
                      className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", categoryFilter === c && "bg-blue-50 text-blue-600")}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              draggable
              onDragStart={(e) => handleDragStart(e, video.id)}
              onDragOver={(e) => handleDragOver(e, video.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-move transition-all",
                draggedItem === video.id && "opacity-50 scale-95"
              )}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play overlay */}
                <div
                  onClick={() => { setPreviewVideo(video); setShowPreviewModal(true) }}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white/90 rounded-full">
                    <Play className="w-6 h-6 text-gray-900 fill-gray-900" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md">
                  {video.duration}
                </div>

                {/* Drag handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1.5 bg-white/90 rounded-lg shadow-sm">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={cn(
                    "text-xs",
                    video.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {video.status}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                <p className="text-sm text-gray-500 truncate mt-1">{video.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">{video.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setPreviewVideo(video); setShowPreviewModal(true) }}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingVideo(video); setShowEditModal(true) }}
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
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-24">Duration</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="w-16 h-10 rounded-lg overflow-hidden">
                      <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{video.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{video.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{video.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{video.duration}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      video.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPreviewVideo(video); setShowPreviewModal(true) }}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingVideo(video); setShowEditModal(true) }}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No videos found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new video</p>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add New Video</h2>
                <button
                  onClick={() => { setShowAddModal(false); setNewVideoUrl("") }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">YouTube URL</Label>
                <div className="mt-2 relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <Input
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="pl-11 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Paste a YouTube video URL to add it to your gallery
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowAddModal(false); setNewVideoUrl("") }} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideoUrl || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching...</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" /> Add Video</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditModal && editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full h-full  max-w-sm overflow-y-auto no-scrollbar">
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Video</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img src={editingVideo.thumbnail} alt="" className=" object-cover" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <Input
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  rows={3}
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <Select value={editingVideo.category} onValueChange={(v) => setEditingVideo({ ...editingVideo, category: v })}>
                    <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select value={editingVideo.status} onValueChange={(v) => setEditingVideo({ ...editingVideo, status: v })}>
                    <SelectTrigger className="mt-2 rounded-xl bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Save Changes</Button>
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
              <div className="flex items-center gap-3">
                <a
                  href={`https://youtube.com/watch?v=${previewVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open in YouTube
                </a>
                <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
