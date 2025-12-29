"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Pencil,
  Loader2,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
    notes: "Former community elder and philanthropist. He dedicated his life to serving the Muslim community and will be greatly missed.",
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
    notes: "Beloved mother and grandmother. She raised a beautiful family and was known for her kindness.",
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
    notes: "Retired teacher who served the community for 40 years. He inspired generations of students.",
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
    notes: "Unexpected passing. Prayer arrangements are still being confirmed with the family.",
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
    notes: "Respected community matriarch who touched many lives with her wisdom and generosity.",
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
    notes: "Long-time JMA volunteer who dedicated countless hours to community service.",
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

const statusStyles: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Completed: "bg-gray-100 text-gray-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
}

export default function JanazaDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const janazaId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [janaza, setJanaza] = useState<typeof janazaData["1"] | null>(null)

  useEffect(() => {
    const loadJanaza = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data = janazaData[janazaId]
      if (data) {
        setJanaza(data)
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const formatDateTime = (dateTimeStr: string) => {
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

  if (notFound || !janaza) {
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
    <div className="space-y-6">
      {/* Page Header */}
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Janaza Details</h1>
            <p className="text-sm text-gray-500">View announcement information</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/janaza/${janazaId}/edit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deceased Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Deceased Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{janaza.deceasedName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age</p>
                <p className="text-lg font-semibold text-gray-900">{janaza.age} years</p>
              </div>
            </div>
          </div>

          {/* Prayer Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Prayer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Prayer Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(janaza.prayerDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Prayer Time</p>
                  <p className="text-sm font-medium text-gray-900">{formatTime(janaza.prayerTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Prayer Location</p>
                  <p className="text-sm font-medium text-gray-900">{janaza.prayerLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Burial Location</p>
                  <p className="text-sm font-medium text-gray-900">{janaza.burialLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Contact Name</p>
                  <p className="text-sm font-medium text-gray-900">{janaza.contactName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{janaza.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-900">{janaza.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {janaza.notes && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Notes
              </h2>
              <p className="text-gray-700 leading-relaxed">{janaza.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Status & Publishing</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={cn("font-medium", statusStyles[janaza.status])}>
                  {janaza.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Published</span>
                <div className="flex items-center gap-2">
                  {janaza.isPublished ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Yes</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">No</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Timestamps</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Created At</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatDateTime(janaza.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatDateTime(janaza.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
