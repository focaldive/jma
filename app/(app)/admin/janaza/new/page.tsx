"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function CreateJanazaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    console.log("Saving draft:", { ...formData, isPublished: false })
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/janaza")
    }, 1000)
  }

  const handlePublish = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    console.log("Publishing:", { ...formData, isPublished: true })
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
                Add New Janaza Announcement
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
                    Publishing...
                  </>
                ) : (
                  "Publish"
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
                        Publish immediately
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

          {/* Sidebar - Preview */}
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  )
}
