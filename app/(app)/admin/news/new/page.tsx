"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Link,
  ImagePlus,
  Quote,
  List,
  ListOrdered,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample authors data
const authors = [
  { id: 1, name: "Ahmed Mohamed" },
  { id: 2, name: "Fathima Begum" },
  { id: 3, name: "Ibrahim Khan" },
  { id: 4, name: "Zainab Ali" },
]

export default function CreateArticlePage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    author: "",
    excerpt: "",
    content: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setFeaturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setFeaturedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFeaturedImage(null)
  }

  // Rich text editor toolbar actions
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      applyFormat("createLink", url)
    }
  }

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      applyFormat("insertImage", url)
    }
  }

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.author) newErrors.author = "Author is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    console.log("Saving draft:", { ...formData, featuredImage, status: "Draft" })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/news")
    }, 1000)
  }

  const handlePublish = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    console.log("Publishing:", { ...formData, featuredImage, status: "Published" })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/news")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Create New Article
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="rounded-xl border-gray-200"
              >
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title..."
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.title && "border-red-500"
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-slug"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated from title. You can edit it manually.
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-gray-700">
                Featured Image
              </Label>
              <div className="mt-3">
                {featuredImage ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag and drop an image, or{" "}
                            <span className="text-blue-600">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Write a short summary..."
                rows={3}
                className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                A brief description shown in article previews
              </p>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </Label>

              {/* Toolbar */}
              <div className="mt-3 flex flex-wrap gap-1 p-2 bg-gray-50 rounded-t-xl border border-b-0 border-gray-200">
                <button
                  type="button"
                  onClick={() => applyFormat("bold")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("italic")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("underline")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Underline"
                >
                  <Underline className="w-4 h-4 text-gray-700" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                <button
                  type="button"
                  onClick={insertLink}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Insert Link"
                >
                  <Link className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={insertImage}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Insert Image"
                >
                  <ImagePlus className="w-4 h-4 text-gray-700" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                <button
                  type="button"
                  onClick={() => applyFormat("formatBlock", "blockquote")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Quote"
                >
                  <Quote className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("insertUnorderedList")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("insertOrderedList")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Editor */}
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const content = e.currentTarget.innerHTML
                  setFormData((prev) => ({ ...prev, content }))
                  if (errors.content) {
                    setErrors((prev) => ({ ...prev, content: "" }))
                  }
                }}
                className={cn(
                  "min-h-[300px] p-4 bg-white border border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 prose prose-sm max-w-none",
                  errors.content && "border-red-500"
                )}
                data-placeholder="Start writing your article content..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Author */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.category && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Appeals">Appeals</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Author <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.author}
                  onValueChange={(value) => handleSelectChange("author", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.author && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.author && (
                  <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                )}
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-blue-300" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900 line-clamp-2">
                    {formData.title || "Article Title"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {formData.excerpt || "Article excerpt will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add placeholder styles */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
