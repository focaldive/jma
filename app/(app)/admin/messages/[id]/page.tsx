"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Trash2,
  Reply,
  Phone,
  Mail,
  User,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample messages data
const messagesData: Record<string, {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  receivedAt: string
}> = {
  "1": { name: "Ahmed Hassan", email: "ahmed.hassan@email.com", phone: "+94 77 123 4567", subject: "Question about donation process", message: "Assalamu Alaikum, I would like to know more about how to contribute to your organization. What are the available donation methods? Can I set up a recurring donation? Also, I'm interested in knowing how the funds are utilized for community projects. JazakAllah Khair.", status: "Unread", receivedAt: "2024-12-28T14:30:00" },
  "2": { name: "Fatima Ibrahim", email: "fatima.ibrahim@gmail.com", phone: "+94 76 234 5678", subject: "Volunteer registration inquiry", message: "Assalamu Alaikum, I am interested in volunteering for your upcoming community events. Could you please provide me with information about the registration process and the types of activities I can participate in? I have experience in event management and would love to contribute.", status: "Read", receivedAt: "2024-12-27T10:15:00" },
  "3": { name: "Mohamed Ali", email: "mohamed.ali@email.com", phone: "+94 71 345 6789", subject: "Event sponsorship opportunity", message: "Dear JMA Team, Our company would like to sponsor your upcoming charity gala. Please share details about sponsorship packages and benefits. We are committed to supporting community initiatives and believe this would be a great partnership opportunity.", status: "Replied", receivedAt: "2024-12-26T16:45:00" },
  "4": { name: "Aisha Khan", email: "aisha.khan@outlook.com", phone: "+94 77 456 7890", subject: "Requesting prayer times information", message: "Assalamu Alaikum, Could you please provide me with the updated prayer times for the month of January? Also, are there any special programs planned for the new year? JazakAllah Khair for your service to the community.", status: "Unread", receivedAt: "2024-12-28T09:00:00" },
  "5": { name: "Yusuf Rahman", email: "yusuf.rahman@email.com", phone: "", subject: "Feedback on recent community event", message: "Assalamu Alaikum, I attended the recent health camp organized by JMA and wanted to express my gratitude. The event was well-organized and the medical team was very professional. May Allah bless your efforts in serving the community.", status: "Read", receivedAt: "2024-12-25T11:30:00" },
  "6": { name: "Zainab Saleh", email: "zainab.saleh@gmail.com", phone: "+94 71 678 9012", subject: "Marriage hall booking inquiry", message: "Dear Admin, I would like to inquire about booking the marriage hall for my daughter's wedding in February. Could you please share the availability, pricing, and terms of booking? I would also like to know about the catering options available.", status: "Unread", receivedAt: "2024-12-28T08:00:00" },
  "7": { name: "Omar Faisal", email: "omar.faisal@email.com", phone: "+94 77 789 0123", subject: "Zakat distribution process", message: "Assalamu Alaikum, I want to understand how JMA distributes Zakat funds to those in need. Could you provide information about the verification process and how beneficiaries are identified? I want to ensure my Zakat is distributed according to Islamic guidelines.", status: "Read", receivedAt: "2024-12-24T13:20:00" },
  "8": { name: "Mariam Begum", email: "mariam.begum@outlook.com", phone: "+94 76 890 1234", subject: "Islamic education classes for children", message: "Dear JMA, I am interested in enrolling my children in Islamic education classes. Could you please provide details about the curriculum, schedule, and fees? Also, are there any weekend classes available? JazakAllah Khair.", status: "Replied", receivedAt: "2024-12-23T15:00:00" },
  "9": { name: "Hassan Ibrahim", email: "hassan.ibrahim@email.com", phone: "+94 77 901 2345", subject: "Membership renewal query", message: "Assalamu Alaikum, My JMA membership is expiring next month. How can I renew it? Are there any changes to the membership fees this year? Also, I would like to know about the benefits of membership.", status: "Unread", receivedAt: "2024-12-28T07:30:00" },
  "10": { name: "Khadija Hassan", email: "khadija.hassan@gmail.com", phone: "", subject: "Thank you for the scholarship", message: "Dear JMA Team, I am writing to express my heartfelt gratitude for awarding me the educational scholarship. This support will greatly help me pursue my studies. May Allah reward you for your generosity and continued support to students in need.", status: "Read", receivedAt: "2024-12-22T10:00:00" },
}

const statusStyles: Record<string, string> = {
  Unread: "bg-blue-100 text-blue-700",
  Read: "bg-gray-100 text-gray-600",
  Replied: "bg-green-100 text-green-700",
}

export default function MessageDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const messageId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [message, setMessage] = useState<typeof messagesData["1"] | null>(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const loadMessage = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))

      const data = messagesData[messageId]
      if (data) {
        setMessage(data)
        setStatus(data.status === "Unread" ? "Read" : data.status)
        setNotFound(false)
      } else {
        setNotFound(true)
      }
      setIsLoading(false)
    }

    if (messageId) {
      loadMessage()
    }
  }, [messageId])

  const toggleReadStatus = () => {
    setStatus((prev) => (prev === "Unread" ? "Read" : "Unread"))
  }

  const handleReply = () => {
    if (message) {
      window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`
    }
  }

  const handleDelete = () => {
    console.log("Deleting message:", messageId)
    router.push("/admin/messages")
  }

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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
          <span>Loading message...</span>
        </div>
      </div>
    )
  }

  if (notFound || !message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Not Found</h2>
          <p className="text-gray-600 mb-4">The message with ID &quot;{messageId}&quot; does not exist.</p>
          <Button onClick={() => router.push("/admin/messages")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Messages
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
            onClick={() => router.push("/admin/messages")}
            className="hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Message Details</h1>
            <p className="text-sm text-gray-500">View full message</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggleReadStatus} className="rounded-xl">
            {status === "Unread" ? (
              <><Eye className="w-4 h-4 mr-2" /> Mark as Read</>
            ) : (
              <><EyeOff className="w-4 h-4 mr-2" /> Mark as Unread</>
            )}
          </Button>
          <Button onClick={handleReply} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Reply className="w-4 h-4 mr-2" /> Reply
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>
            </div>
          </div>

          {/* Message Body */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Message</h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{message.message}</p>
            </div>
          </div>
        </div>

        {/* Sender Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Sender Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{message.name}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900">{message.email}</p>
                  </div>
                </div>

                {message.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900">{message.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Received</p>
                    <p className="text-gray-900">{formatFullDate(message.receivedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button onClick={handleReply} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl justify-start">
                <Reply className="w-4 h-4 mr-2" /> Reply to Message
              </Button>
              <Button variant="outline" onClick={() => window.location.href = `mailto:${message.email}`} className="w-full rounded-xl justify-start">
                <Mail className="w-4 h-4 mr-2" /> Send New Email
              </Button>
              {message.phone && (
                <Button variant="outline" onClick={() => window.location.href = `tel:${message.phone}`} className="w-full rounded-xl justify-start">
                  <Phone className="w-4 h-4 mr-2" /> Call Sender
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
