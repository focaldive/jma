"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
  X,
  Loader2,
  CalendarDays,
  MapPin,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Fundraiser",
  "Health",
  "Religious",
  "Education",
  "Welfare",
  "Community",
  "Workshop",
  "Charity",
]

const statuses = ["Upcoming", "Completed", "Cancelled"]

const categoryStyles: Record<string, string> = {
  Fundraiser: "bg-purple-100 text-purple-700",
  Health: "bg-green-100 text-green-700",
  Religious: "bg-blue-100 text-blue-700",
  Education: "bg-yellow-100 text-yellow-700",
  Welfare: "bg-pink-100 text-pink-700",
  Community: "bg-orange-100 text-orange-700",
  Workshop: "bg-indigo-100 text-indigo-700",
  Charity: "bg-teal-100 text-teal-700",
}

const statusStyles: Record<string, string> = {
  Upcoming: "bg-emerald-100 text-emerald-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
}

// Sample events data
const eventsData: Record<string, {
  name: string
  date: string
  location: string
  category: string
  status: string
  description: string
  featuredImage: string | null
}> = {
  "1": { name: "Annual Charity Gala 2024", date: "2024-12-28", location: "Colombo Grand Hotel", category: "Fundraiser", status: "Upcoming", description: "Join us for our annual charity gala event featuring dinner, entertainment, and fundraising activities.", featuredImage: null },
  "2": { name: "Community Health Camp", date: "2024-12-15", location: "Kandy Community Center", category: "Health", status: "Completed", description: "Free health checkups and medical consultations for the community.", featuredImage: null },
  "3": { name: "Ramadan Iftar Gathering", date: "2025-03-15", location: "JMA Main Hall", category: "Religious", status: "Upcoming", description: "Community iftar gathering during the holy month of Ramadan.", featuredImage: null },
  "4": { name: "Youth Leadership Workshop", date: "2024-11-20", location: "Galle Youth Center", category: "Education", status: "Completed", description: "A workshop focused on developing leadership skills among young community members.", featuredImage: null },
  "5": { name: "Orphan Support Day", date: "2024-12-01", location: "Batticaloa Orphanage", category: "Welfare", status: "Completed", description: "A day dedicated to supporting orphans with gifts, activities, and love.", featuredImage: null },
  "6": { name: "New Year Celebration", date: "2025-01-01", location: "Colombo Convention Center", category: "Community", status: "Upcoming", description: "Welcome the new year with the JMA community.", featuredImage: null },
  "7": { name: "Blood Donation Drive", date: "2024-10-25", location: "Jaffna Hospital", category: "Health", status: "Completed", description: "Blood donation drive in collaboration with local hospitals.", featuredImage: null },
  "8": { name: "Scholarship Award Ceremony", date: "2025-02-10", location: "Colombo University Hall", category: "Education", status: "Upcoming", description: "Award ceremony for scholarship recipients.", featuredImage: null },
  "9": { name: "Emergency Relief Meeting", date: "2024-09-15", location: "JMA Office", category: "Welfare", status: "Cancelled", description: "Meeting to discuss emergency relief operations.", featuredImage: null },
  "10": { name: "Eid Festival Celebration", date: "2025-04-01", location: "JMA Main Hall", category: "Religious", status: "Upcoming", description: "Celebrate Eid with the JMA community.", featuredImage: null },
  "11": { name: "Winter Clothes Distribution", date: "2024-11-30", location: "Nuwara Eliya", category: "Welfare", status: "Completed", description: "Distributing warm clothes to those in need.", featuredImage: null },
  "12": { name: "Career Guidance Seminar", date: "2025-01-20", location: "Colombo Skills Center", category: "Education", status: "Upcoming", description: "Career guidance and counseling seminar for youth.", featuredImage: null },
  "13": { name: "Mosque Inauguration", date: "2024-08-10", location: "Puttalam", category: "Religious", status: "Completed", description: "Inauguration of the newly built mosque.", featuredImage: null },
  "14": { name: "Sports Day Event", date: "2024-07-15", location: "Colombo Sports Complex", category: "Community", status: "Cancelled", description: "Annual sports day for the community.", featuredImage: null },
  "15": { name: "Fundraiser Dinner", date: "2025-02-28", location: "Hilton Colombo", category: "Fundraiser", status: "Upcoming", description: "Exclusive fundraiser dinner with special guests.", featuredImage: null },
}

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [eventNotFound, setEventNotFound] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    category: "",
    status: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing event data
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const event = eventsData[eventId]
      if (event) {
        setFormData({
          name: event.name,
          date: event.date,
          location: event.location,
          category: event.category,
          status: event.status,
          description: event.description,
        })
        setFeaturedImage(event.featuredImage)
        setEventNotFound(false)
      } else {
        setEventNotFound(true)
      }
      setIsLoading(false)
    }

    if (eventId) {
      loadEvent()
    }
  }, [eventId])

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

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Event name is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.status) newErrors.status = "Status is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    console.log("Saving draft:", { id: eventId, ...formData, featuredImage, isDraft: true })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/events")
    }, 1000)
  }

  const handlePublish = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    console.log("Publishing event:", { id: eventId, ...formData, featuredImage, isDraft: false })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/events")
    }, 1000)
  }

  const formatPreviewDate = (dateStr: string) => {
    if (!dateStr) return "Date not set"
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading event...</span>
        </div>
      </div>
    )
  }

  if (eventNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event with ID &quot;{eventId}&quot; does not exist.</p>
          <Button onClick={() => router.push("/admin/events")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/events")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Event
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Event Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter event name..."
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.name && "border-red-500"
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={cn(
                        "mt-2 rounded-xl bg-gray-50 border-gray-200",
                        errors.date && "border-red-500"
                      )}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location..."
                      className={cn(
                        "mt-2 rounded-xl bg-gray-50 border-gray-200",
                        errors.location && "border-red-500"
                      )}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger
                        className={cn(
                          "mt-2 rounded-xl bg-gray-50 border-gray-200",
                          errors.status && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-gray-700">
                Featured Image (Optional)
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

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description..."
                rows={5}
                className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
              />
            </div>
          </div>

          {/* Sidebar - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Event Preview</h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-blue-300" />
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <p className="font-semibold text-gray-900 line-clamp-2">
                    {formData.name || "Event Name"}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {formatPreviewDate(formData.date)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {formData.location || "Location not set"}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.category && (
                      <Badge className={cn("text-xs", categoryStyles[formData.category])}>
                        {formData.category}
                      </Badge>
                    )}
                    {formData.status && (
                      <Badge className={cn("text-xs", statusStyles[formData.status])}>
                        {formData.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
