"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Loader2,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statuses = ["Scheduled", "Pending", "Completed", "Cancelled"]

const statusStyles: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
}

// Sample Janaza data
const janazaData: Record<string, {
  deceasedName: string
  age: number
  prayerDate: string
  prayerTime: string
  prayerLocation: string
  burialLocation: string
  contactName: string
  contactPhone: string
  contactEmail: string
  notes: string
  status: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}> = {
  "1": {
    deceasedName: "Mohamed Cassim",
    age: 72,
    prayerDate: "2024-12-28",
    prayerTime: "14:00",
    prayerLocation: "Masjid Al-Noor, Colombo",
    burialLocation: "Kanatte Muslim Cemetery",
    contactName: "Ahmed Cassim",
    contactPhone: "+94 77 123 4567",
    contactEmail: "ahmed.cassim@email.com",
    notes: "Former community elder and philanthropist.",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-27T10:30:00",
    updatedAt: "2024-12-27T14:15:00",
  },
  "2": {
    deceasedName: "Fathima Noor",
    age: 65,
    prayerDate: "2024-12-27",
    prayerTime: "15:30",
    prayerLocation: "Masjid Al-Rahman, Kandy",
    burialLocation: "Kandy Muslim Cemetery",
    contactName: "Ibrahim Noor",
    contactPhone: "+94 76 234 5678",
    contactEmail: "ibrahim.noor@email.com",
    notes: "Beloved mother and grandmother.",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-26T08:00:00",
    updatedAt: "2024-12-27T16:00:00",
  },
  "3": {
    deceasedName: "Abdul Hameed",
    age: 80,
    prayerDate: "2024-12-29",
    prayerTime: "13:00",
    prayerLocation: "JMA Main Mosque, Galle",
    burialLocation: "Galle Muslim Cemetery",
    contactName: "Yusuf Hameed",
    contactPhone: "+94 71 345 6789",
    contactEmail: "yusuf.hameed@email.com",
    notes: "Retired teacher who served the community for 40 years.",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-28T09:00:00",
    updatedAt: "2024-12-28T09:00:00",
  },
  "4": {
    deceasedName: "Zainab Begum",
    age: 58,
    prayerDate: "2024-12-26",
    prayerTime: "14:30",
    prayerLocation: "Masjid Al-Falah, Jaffna",
    burialLocation: "Jaffna Muslim Cemetery",
    contactName: "Hassan Ali",
    contactPhone: "+94 77 456 7890",
    contactEmail: "hassan.ali@email.com",
    notes: "",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-25T11:30:00",
    updatedAt: "2024-12-26T15:00:00",
  },
  "5": {
    deceasedName: "Ismail Khan",
    age: 45,
    prayerDate: "2024-12-30",
    prayerTime: "12:00",
    prayerLocation: "Central Mosque, Batticaloa",
    burialLocation: "Batticaloa Muslim Cemetery",
    contactName: "Amina Khan",
    contactPhone: "+94 76 567 8901",
    contactEmail: "amina.khan@email.com",
    notes: "Prayer arrangements are still being confirmed.",
    status: "Pending",
    isPublished: false,
    createdAt: "2024-12-28T16:00:00",
    updatedAt: "2024-12-28T16:00:00",
  },
  "6": {
    deceasedName: "Mariam Saleh",
    age: 88,
    prayerDate: "2024-12-25",
    prayerTime: "15:00",
    prayerLocation: "Masjid Al-Taqwa, Negombo",
    burialLocation: "Negombo Muslim Cemetery",
    contactName: "Omar Saleh",
    contactPhone: "+94 71 678 9012",
    contactEmail: "omar.saleh@email.com",
    notes: "Respected community matriarch.",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-24T07:00:00",
    updatedAt: "2024-12-25T16:00:00",
  },
  "7": {
    deceasedName: "Rashid Ahmed",
    age: 67,
    prayerDate: "2024-12-31",
    prayerTime: "14:00",
    prayerLocation: "JMA Main Mosque, Colombo",
    burialLocation: "Kanatte Muslim Cemetery",
    contactName: "Fatima Ahmed",
    contactPhone: "+94 77 789 0123",
    contactEmail: "fatima.ahmed@email.com",
    notes: "Long-time JMA volunteer.",
    status: "Scheduled",
    isPublished: true,
    createdAt: "2024-12-29T10:00:00",
    updatedAt: "2024-12-29T10:00:00",
  },
  "8": {
    deceasedName: "Khadija Hassan",
    age: 75,
    prayerDate: "2024-12-24",
    prayerTime: "13:30",
    prayerLocation: "Masjid Al-Huda, Kurunegala",
    burialLocation: "Kurunegala Muslim Cemetery",
    contactName: "Yusuf Hassan",
    contactPhone: "+94 76 890 1234",
    contactEmail: "yusuf.hassan@email.com",
    notes: "",
    status: "Completed",
    isPublished: true,
    createdAt: "2024-12-23T14:00:00",
    updatedAt: "2024-12-24T14:00:00",
  },
}

export default function EditJanazaPage() {
  const router = useRouter()
  const params = useParams()
  const janazaId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [createdAt, setCreatedAt] = useState("")
  const [updatedAt, setUpdatedAt] = useState("")

  const [formData, setFormData] = useState({
    deceasedName: "",
    age: "",
    prayerDate: "",
    prayerTime: "",
    prayerLocation: "",
    burialLocation: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    status: "",
    isPublished: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing data
  useEffect(() => {
    const loadJanaza = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data = janazaData[janazaId]
      if (data) {
        setFormData({
          deceasedName: data.deceasedName,
          age: data.age.toString(),
          prayerDate: data.prayerDate,
          prayerTime: data.prayerTime,
          prayerLocation: data.prayerLocation,
          burialLocation: data.burialLocation,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          notes: data.notes,
          status: data.status,
          isPublished: data.isPublished,
        })
        setCreatedAt(data.createdAt)
        setUpdatedAt(data.updatedAt)
        setNotFound(false)
      } else {
        setNotFound(true)
      }
      setIsLoading(false)
    }

    if (janazaId) {
      loadJanaza()
    }
  }, [janazaId])

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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.deceasedName.trim()) newErrors.deceasedName = "Deceased name is required"
    if (!formData.age) newErrors.age = "Age is required"
    if (!formData.prayerDate) newErrors.prayerDate = "Prayer date is required"
    if (!formData.prayerTime) newErrors.prayerTime = "Prayer time is required"
    if (!formData.prayerLocation.trim()) newErrors.prayerLocation = "Prayer location is required"
    if (!formData.burialLocation.trim()) newErrors.burialLocation = "Burial location is required"
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required"
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required"
    if (!formData.status) newErrors.status = "Status is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    console.log("Saving draft:", { id: janazaId, ...formData, isPublished: false })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/janaza")
    }, 1000)
  }

  const handlePublish = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    console.log("Saving changes:", { id: janazaId, ...formData })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/janaza")
    }, 1000)
  }

  const formatPreviewDate = (dateStr: string) => {
    if (!dateStr) return "Date not set"
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatPreviewTime = (timeStr: string) => {
    if (!timeStr) return "Time not set"
    const [hours, minutes] = timeStr.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "-"
    return new Date(dateTimeStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading janaza details...</span>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Announcement Not Found</h2>
          <p className="text-gray-600 mb-4">The janaza announcement with ID &quot;{janazaId}&quot; does not exist.</p>
          <Button onClick={() => router.push("/admin/janaza")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Janaza List
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
                onClick={() => router.push("/admin/janaza")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Janaza Announcement
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
            {/* Deceased Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Deceased Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deceasedName" className="text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deceasedName"
                    name="deceasedName"
                    value={formData.deceasedName}
                    onChange={handleInputChange}
                    placeholder="Enter deceased name"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.deceasedName && "border-red-500"
                    )}
                  />
                  {errors.deceasedName && (
                    <p className="text-red-500 text-sm mt-1">{errors.deceasedName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.age && "border-red-500"
                    )}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Prayer Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                Prayer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prayerDate" className="text-sm font-medium text-gray-700">
                    Prayer Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prayerDate"
                    name="prayerDate"
                    type="date"
                    value={formData.prayerDate}
                    onChange={handleInputChange}
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.prayerDate && "border-red-500"
                    )}
                  />
                  {errors.prayerDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.prayerDate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="prayerTime" className="text-sm font-medium text-gray-700">
                    Prayer Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prayerTime"
                    name="prayerTime"
                    type="time"
                    value={formData.prayerTime}
                    onChange={handleInputChange}
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.prayerTime && "border-red-500"
                    )}
                  />
                  {errors.prayerTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.prayerTime}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="prayerLocation" className="text-sm font-medium text-gray-700">
                    Prayer Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prayerLocation"
                    name="prayerLocation"
                    value={formData.prayerLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Masjid Al-Noor, Colombo"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.prayerLocation && "border-red-500"
                    )}
                  />
                  {errors.prayerLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.prayerLocation}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="burialLocation" className="text-sm font-medium text-gray-700">
                    Burial Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="burialLocation"
                    name="burialLocation"
                    value={formData.burialLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Kanatte Muslim Cemetery"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.burialLocation && "border-red-500"
                    )}
                  />
                  {errors.burialLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.burialLocation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">
                    Contact Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Family contact name"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.contactName && "border-red-500"
                    )}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+94 77 123 4567"
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.contactPhone && "border-red-500"
                    )}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Email (Optional)
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Status & Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Notes</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="flex items-center pt-8">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="isPublished"
                        checked={formData.isPublished}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Published
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional information about the deceased or arrangements..."
                    rows={4}
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Preview & Timestamps */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Announcement Preview</h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-white text-center">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Inna Lillahi Wa Inna Ilayhi Rajioon</p>
                  <p className="text-lg font-semibold">
                    {formData.deceasedName || "Deceased Name"}
                  </p>
                  {formData.age && (
                    <p className="text-sm text-gray-300">Age: {formData.age} years</p>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatPreviewDate(formData.prayerDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {formatPreviewTime(formData.prayerTime)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {formData.prayerLocation || "Prayer location"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {formData.burialLocation || "Burial location"}
                  </div>
                  {formData.status && (
                    <div className="pt-2">
                      <Badge className={cn("text-xs", statusStyles[formData.status])}>
                        {formData.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Contact Preview</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  {formData.contactName || "Contact name"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {formData.contactPhone || "Phone number"}
                </div>
                {formData.contactEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {formData.contactEmail}
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Timestamps</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Created At</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatDateTime(createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatDateTime(updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
