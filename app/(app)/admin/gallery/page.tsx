"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

type GalleryItem = {
  id: string;
  src: string;
  title: string | null;
  description: string | null;
  order: number;
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<
    { file: File; preview: string; title: string; description: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const result = await res.json();
      if (result.success) {
        setGallery(result.data);
      } else {
        setError(result.message || "Failed to fetch gallery items");
      }
    } catch (err) {
      setError("An error occurred while fetching gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newUploads: {
      file: File;
      preview: string;
      title: string;
      description: string;
    }[] = [];

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit for base64
    let hasLargeFiles = false;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          hasLargeFiles = true;
          console.warn(
            `File ${file.name} is too large: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
          return; // Skip this file
        }

        const reader = new FileReader();
        reader.onload = () => {
          newUploads.push({
            file,
            preview: reader.result as string,
            title: file.name.split(".")[0], // Default title from filename
            description: "",
          });
          if (
            newUploads.length ===
            Array.from(files).filter(
              (f) => f.size <= MAX_FILE_SIZE && f.type.startsWith("image/")
            ).length
          ) {
            setPendingUploads((prev) => [...prev, ...newUploads]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (hasLargeFiles) {
      alert(
        "Some files were skipped because they are larger than 2MB. Please use smaller images or compress them first."
      );
    }

    setShowUploadModal(true);
  };

  // Drag and drop for upload
  const handleUploadDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleUploadDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUploadDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  // Remove pending upload
  const removePendingUpload = (index: number) => {
    setPendingUploads((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images
  const handleUpload = async () => {
    if (pendingUploads.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const total = pendingUploads.length;
      for (const [index, upload] of pendingUploads.entries()) {
        const response = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            src: upload.preview,
            title: upload.title,
            description: upload.description,
            order: gallery.length + index,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || result.error || "Failed to upload image"
          );
        }

        setUploadProgress(((index + 1) / total) * 100);
      }

      fetchGallery();
      setPendingUploads([]);
      setShowUploadModal(false);
      toast.success("Images uploaded successfully");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Select/deselect item
  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all
  const selectAll = () => {
    if (selectedItems.length === gallery.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(gallery.map((item) => item.id));
    }
  };

  // Delete selected
  const deleteSelected = () => {
    if (selectedItems.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedItems) {
        await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      }
      fetchGallery();
      setSelectedItems([]);
      toast.success("Items deleted successfully");
    } catch (err) {
      toast.error("Failed to delete some items");
    } finally {
      setIsDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  // Delete single item
  const deleteItem = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${itemToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchGallery();
        toast.success("Image deleted successfully");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Edit item metadata
  const saveEdit = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/gallery/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingItem.title,
          description: editingItem.description,
        }),
      });

      if (res.ok) {
        setGallery((prev) =>
          prev.map((item) => (item.id === editingItem.id ? editingItem : item))
        );
        setEditingItem(null);
        toast.success("Changes saved successfully");
      }
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  // Drag and drop reorder
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === id) return;

    const draggedIndex = gallery.findIndex((item) => item.id === draggedItem);
    const targetIndex = gallery.findIndex((item) => item.id === id);

    if (draggedIndex !== targetIndex) {
      const newGallery = [...gallery];
      const [removed] = newGallery.splice(draggedIndex, 1);
      newGallery.splice(targetIndex, 0, removed);
      setGallery(newGallery);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your image gallery
          </p>
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
              Drag and drop images here, or{" "}
              <span className="text-blue-600">browse</span>
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
              checked={
                selectedItems.length === gallery.length && gallery.length > 0
              }
              onCheckedChange={selectAll}
            />
            <span className="text-sm text-gray-600">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : `${gallery.length} images`}
            </span>
          </div>
          <p className="text-sm text-gray-500">Drag images to reorder</p>
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
                alt={item.title ?? undefined}
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
                    e.stopPropagation();
                    setEditingItem(item);
                  }}
                  className="bg-white hover:bg-gray-100 text-gray-700 rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="bg-white hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 truncate mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {gallery.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images in gallery</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload some images to get started
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[60vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upload Images
                </h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setPendingUploads([]);
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
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden"
                    >
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
                  setShowUploadModal(false);
                  setPendingUploads([]);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Image Details
                </h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Preview */}
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={editingItem.src}
                  alt={editingItem.title ?? undefined}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div>
                <Label
                  htmlFor="edit-title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingItem.title ?? ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description ?? ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              className="mt-2 sm:mt-0"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Image"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={showBulkDeleteConfirm}
        onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Images</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItems.length} images?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowBulkDeleteConfirm(false)}
              className="mt-2 sm:mt-0"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedItems.length} Images`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
