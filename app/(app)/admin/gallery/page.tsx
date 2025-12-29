"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  X,
  Pencil,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Plus,
  Check,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample gallery data
const initialGalleryData = [
  { id: 1, src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&h=300&fit=crop", title: "Community Iftar 2024", description: "Ramadan iftar gathering at JMA main hall" },
  { id: 2, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop", title: "Health Camp", description: "Free medical checkup camp for the community" },
  { id: 3, src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop", title: "Charity Distribution", description: "Distribution of essentials to families in need" },
  { id: 4, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop", title: "Youth Workshop", description: "Leadership workshop for young community members" },
  { id: 5, src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop", title: "Eid Celebration", description: "Eid prayers and celebration at the mosque" },
  { id: 6, src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop", title: "Food Drive", description: "Community food drive for Ramadan" },
  { id: 7, src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop", title: "Education Program", description: "Scholarship award ceremony for students" },
  { id: 8, src: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=300&fit=crop", title: "Community Gathering", description: "Annual community gathering event" },
]

type GalleryItem = {
  id: number
  src: string
  title: string
  description: string
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryData)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const newUploads: { file: File; preview: string }[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          newUploads.push({ file, preview: reader.result as string })
          if (newUploads.length === files.length) {
            setPendingUploads((prev) => [...prev, ...newUploads])
          }
        }
        reader.readAsDataURL(file)
      }
    })
    setShowUploadModal(true)
  }

  // Drag and drop for upload
  const handleUploadDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleUploadDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleUploadDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [])

  // Remove pending upload
  const removePendingUpload = (index: number) => {
    setPendingUploads((prev) => prev.filter((_, i) => i !== index))
  }

  // Upload images
  const handleUpload = async () => {
    if (pendingUploads.length === 0) return
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Add to gallery
    const newItems = pendingUploads.map((upload, index) => ({
      id: Date.now() + index,
      src: upload.preview,
      title: `New Image ${gallery.length + index + 1}`,
      description: "Click to edit description",
    }))

    setGallery((prev) => [...prev, ...newItems])
    setPendingUploads([])
    setShowUploadModal(false)
    setIsUploading(false)
    setUploadProgress(0)
  }

  // Select/deselect item
  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Select all
  const selectAll = () => {
    if (selectedItems.length === gallery.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(gallery.map((item) => item.id))
    }
  }

  // Delete selected
  const deleteSelected = () => {
    setGallery((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  // Delete single item
  const deleteItem = (id: number) => {
    setGallery((prev) => prev.filter((item) => item.id !== id))
  }

  // Edit item metadata
  const saveEdit = () => {
    if (!editingItem) return
    setGallery((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    )
    setEditingItem(null)
  }

  // Drag and drop reorder
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === id) return

    const draggedIndex = gallery.findIndex((item) => item.id === draggedItem)
    const targetIndex = gallery.findIndex((item) => item.id === id)

    if (draggedIndex !== targetIndex) {
      const newGallery = [...gallery]
      const [removed] = newGallery.splice(draggedIndex, 1)
      newGallery.splice(targetIndex, 0, removed)
      setGallery(newGallery)
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
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your image gallery</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <Button
              variant="outline"
              onClick={deleteSelected}
              className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedItems.length})
            </Button>
          )}
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleUploadDragOver}
        onDragLeave={handleUploadDragLeave}
        onDrop={handleUploadDrop}
        className={cn(
          "bg-white rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-gray-100 rounded-2xl">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drag and drop images here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Select All / Bulk Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedItems.length === gallery.length && gallery.length > 0}
              onCheckedChange={selectAll}
            />
            <span className="text-sm text-gray-600">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : `${gallery.length} images`}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Drag images to reorder
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all cursor-move",
              draggedItem === item.id && "opacity-50 scale-95",
              selectedItems.includes(item.id) && "ring-2 ring-blue-500"
            )}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Selection checkbox */}
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => toggleSelect(item.id)}
                  className="bg-white/90 border-gray-300"
                />
              </div>

              {/* Drag handle */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 bg-white/90 rounded-lg shadow-sm">
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingItem(item)
                  }}
                  className="bg-white hover:bg-gray-100 text-gray-700 rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(item.id)
                  }}
                  className="bg-white hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
              <p className="text-sm text-gray-500 truncate mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {gallery.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images in gallery</p>
          <p className="text-sm text-gray-400 mt-1">Upload some images to get started</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[60vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upload Images</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setPendingUploads([])
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {pendingUploads.length === 0 ? (
                <div
                  onDragOver={handleUploadDragOver}
                  onDragLeave={handleUploadDragLeave}
                  onDrop={handleUploadDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Drag and drop or click to select images
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {pendingUploads.map((upload, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                      <img
                        src={upload.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePendingUpload(index)}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white shadow-sm"
                      >
                        <X className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4  border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false)
                  setPendingUploads([])
                }}
                disabled={isUploading}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={pendingUploads.length === 0 || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-2 mr-2" />
                    Upload {pendingUploads.length} Images
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-  ">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p- border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Image Details</h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-2">
              {/* Preview */}
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src={editingItem.src}
                  alt={editingItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  rows={3}
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
