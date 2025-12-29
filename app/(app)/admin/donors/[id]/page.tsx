"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Loader2,
  Pencil,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample donors data with donation history
const donorsData: Record<string, {
  name: string
  address: string
  country: string
  email: string
  phone: string
  donations: { id: number; date: string; amount: number; purpose: string }[]
}> = {
  "1": {
    name: "Ahmed Mohamed",
    address: "123 Main Street, Colombo 03",
    country: "Sri Lanka",
    email: "ahmed.mohamed@email.com",
    phone: "+94 77 123 4567",
    donations: [
      { id: 1, date: "2024-12-15", amount: 50000, purpose: "Education Fund" },
      { id: 2, date: "2024-10-20", amount: 75000, purpose: "Ramadan Campaign" },
      { id: 3, date: "2024-06-10", amount: 25000, purpose: "Health Camp" },
    ],
  },
  "2": {
    name: "Fathima Begum",
    address: "45 Beach Road, Galle",
    country: "Sri Lanka",
    email: "fathima.begum@email.com",
    phone: "+94 71 234 5678",
    donations: [
      { id: 1, date: "2024-11-25", amount: 40000, purpose: "Orphan Support" },
      { id: 2, date: "2024-08-15", amount: 35000, purpose: "Food Distribution" },
    ],
  },
  "3": {
    name: "Ibrahim Khan",
    address: "78 Park Avenue, Dubai",
    country: "UAE",
    email: "ibrahim.khan@email.com",
    phone: "+971 50 123 4567",
    donations: [
      { id: 1, date: "2024-12-01", amount: 200000, purpose: "Mosque Construction" },
      { id: 2, date: "2024-09-15", amount: 150000, purpose: "Scholarship Fund" },
      { id: 3, date: "2024-05-10", amount: 100000, purpose: "Emergency Relief" },
      { id: 4, date: "2024-02-20", amount: 50000, purpose: "Winter Campaign" },
    ],
  },
  "4": {
    name: "Zainab Ali",
    address: "12 Queens Road, London",
    country: "UK",
    email: "zainab.ali@email.com",
    phone: "+44 20 1234 5678",
    donations: [
      { id: 1, date: "2024-11-10", amount: 150000, purpose: "Education Fund" },
      { id: 2, date: "2024-07-25", amount: 100000, purpose: "Health Initiative" },
    ],
  },
  "5": {
    name: "Mohamed Rafi",
    address: "90 Orchard Road, Singapore",
    country: "Singapore",
    email: "mohamed.rafi@email.com",
    phone: "+65 9123 4567",
    donations: [
      { id: 1, date: "2024-12-10", amount: 80000, purpose: "Youth Programs" },
      { id: 2, date: "2024-09-05", amount: 60000, purpose: "Community Health" },
      { id: 3, date: "2024-04-15", amount: 40000, purpose: "Food Aid" },
    ],
  },
  "6": {
    name: "Amina Hassan",
    address: "33 Hill Street, Kandy",
    country: "Sri Lanka",
    email: "amina.hassan@email.com",
    phone: "+94 76 345 6789",
    donations: [
      { id: 1, date: "2024-10-30", amount: 50000, purpose: "Widow Support" },
      { id: 2, date: "2024-06-20", amount: 45000, purpose: "Education" },
    ],
  },
  "7": {
    name: "Yusuf Rahman",
    address: "567 Bay Street, Toronto",
    country: "Canada",
    email: "yusuf.rahman@email.com",
    phone: "+1 416 123 4567",
    donations: [
      { id: 1, date: "2024-12-05", amount: 120000, purpose: "Infrastructure" },
      { id: 2, date: "2024-08-10", amount: 100000, purpose: "Emergency Relief" },
      { id: 3, date: "2024-03-25", amount: 100000, purpose: "Medical Equipment" },
    ],
  },
  "8": {
    name: "Khadija Noor",
    address: "21 Sunset Blvd, Los Angeles",
    country: "USA",
    email: "khadija.noor@email.com",
    phone: "+1 310 123 4567",
    donations: [
      { id: 1, date: "2024-11-20", amount: 200000, purpose: "Scholarship Fund" },
      { id: 2, date: "2024-07-15", amount: 150000, purpose: "Ramadan Campaign" },
      { id: 3, date: "2024-02-10", amount: 70000, purpose: "Winter Relief" },
    ],
  },
  "9": {
    name: "Abdul Kareem",
    address: "88 Marine Drive, Mumbai",
    country: "India",
    email: "abdul.kareem@email.com",
    phone: "+91 98 1234 5678",
    donations: [
      { id: 1, date: "2024-11-15", amount: 75000, purpose: "Education Fund" },
      { id: 2, date: "2024-08-20", amount: 50000, purpose: "Health Camp" },
    ],
  },
  "10": {
    name: "Safiya Jaffar",
    address: "15 King Street, Melbourne",
    country: "Australia",
    email: "safiya.jaffar@email.com",
    phone: "+61 4 1234 5678",
    donations: [
      { id: 1, date: "2024-12-08", amount: 130000, purpose: "Orphan Support" },
      { id: 2, date: "2024-09-25", amount: 100000, purpose: "Community Health" },
      { id: 3, date: "2024-05-15", amount: 50000, purpose: "Food Distribution" },
    ],
  },
  "11": {
    name: "Hamza Ismail",
    address: "42 Flower Road, Colombo 07",
    country: "Sri Lanka",
    email: "hamza.ismail@email.com",
    phone: "+94 77 456 7890",
    donations: [
      { id: 1, date: "2024-10-10", amount: 35000, purpose: "Youth Programs" },
      { id: 2, date: "2024-07-05", amount: 30000, purpose: "Education" },
    ],
  },
  "12": {
    name: "Mariam Saleh",
    address: "99 Palm Street, Jeddah",
    country: "Saudi Arabia",
    email: "mariam.saleh@email.com",
    phone: "+966 50 123 4567",
    donations: [
      { id: 1, date: "2024-12-01", amount: 180000, purpose: "Mosque Construction" },
      { id: 2, date: "2024-08-15", amount: 120000, purpose: "Ramadan Campaign" },
      { id: 3, date: "2024-04-20", amount: 80000, purpose: "Emergency Relief" },
    ],
  },
  "13": {
    name: "Omar Farooq",
    address: "55 Victoria Street, Kuala Lumpur",
    country: "Malaysia",
    email: "omar.farooq@email.com",
    phone: "+60 12 345 6789",
    donations: [
      { id: 1, date: "2024-11-05", amount: 85000, purpose: "Scholarship Fund" },
      { id: 2, date: "2024-06-30", amount: 60000, purpose: "Health Initiative" },
    ],
  },
  "14": {
    name: "Aisha Begum",
    address: "77 Green Lane, Dhaka",
    country: "Bangladesh",
    email: "aisha.begum@email.com",
    phone: "+880 17 1234 5678",
    donations: [
      { id: 1, date: "2024-10-25", amount: 45000, purpose: "Widow Support" },
      { id: 2, date: "2024-05-10", amount: 40000, purpose: "Food Aid" },
    ],
  },
  "15": {
    name: "Hassan Ali",
    address: "34 Ocean View, Maldives",
    country: "Maldives",
    email: "hassan.ali@email.com",
    phone: "+960 77 12345",
    donations: [
      { id: 1, date: "2024-12-12", amount: 110000, purpose: "Infrastructure" },
      { id: 2, date: "2024-09-18", amount: 60000, purpose: "Community Health" },
      { id: 3, date: "2024-04-05", amount: 40000, purpose: "Education Fund" },
    ],
  },
}

export default function DonorDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const donorId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [donorNotFound, setDonorNotFound] = useState(false)
  const [donor, setDonor] = useState<typeof donorsData["1"] | null>(null)

  useEffect(() => {
    const loadDonor = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const donorData = donorsData[donorId]
      if (donorData) {
        setDonor(donorData)
        setDonorNotFound(false)
      } else {
        setDonorNotFound(true)
      }
      setIsLoading(false)
    }

    if (donorId) {
      loadDonor()
    }
  }, [donorId])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const totalDonated = donor?.donations.reduce((sum, d) => sum + d.amount, 0) || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading donor details...</span>
        </div>
      </div>
    )
  }

  if (donorNotFound || !donor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Donor Not Found</h2>
          <p className="text-gray-600 mb-4">The donor with ID &quot;{donorId}&quot; does not exist.</p>
          <Button onClick={() => router.push("/admin/donors")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Donors
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
            onClick={() => router.push("/admin/donors")}
            className="hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donor Details</h1>
            <p className="text-sm text-gray-500">View and manage donor information</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/donors/${donorId}/edit`)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Donor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{donor.name}</h2>
              <p className="text-sm text-gray-500">{donor.country}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                  <p className="text-sm text-gray-900">{donor.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                  <p className="text-sm text-gray-900">{donor.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900">{donor.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-gray-900">{donor.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Total Summary */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donated</p>
                  <p className="text-3xl font-bold text-green-700">{formatAmount(totalDonated)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Donations</p>
                  <p className="text-3xl font-bold text-gray-900">{donor.donations.length}</p>
                </div>
              </div>
            </div>

            {/* Donation List */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
              <div className="space-y-4">
                {donor.donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{donation.purpose}</p>
                        <p className="text-sm text-gray-500">{formatDate(donation.date)}</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatAmount(donation.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
