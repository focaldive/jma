"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  User,
  CreditCard,
  Calendar,
  Hash,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Extended donation data with more details

import { useEffect, useState } from "react";

interface Donation {
  id: string;
  transactionId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  bankName?: string;
  status: string;
  date: string;
  time: string;
  referenceNumber: string;
  notes: string;
  receiptUrl?: string;
}
const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
}

const statusIcons = {
  Completed: CheckCircle,
  Pending: Clock,
  Failed: CheckCircle,
}

export default function DonationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const txnId = params.id as string;
  const [donation, setDonation] = useState<Donation | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/data/donation.json");
      const data = await res.json();

      const found = data.find(
        (item: Donation) => item.id === txnId
      );

      setDonation(found || null);
    };

    loadData();
  }, [txnId]);
  if (!donation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Donation Not Found</h2>
        <p className="text-gray-500">The donation you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/admin/donations")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donations
        </Button>
      </div>
    )
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const StatusIcon = statusIcons[donation.status as keyof typeof statusIcons]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/donations")}
            className="rounded-xl border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donation Details</h1>
            <p className="text-sm text-gray-500 mt-1">{donation.transactionId}</p>
          </div>
        </div>
        <Badge
          className={cn(
            "px-4 py-2 text-sm font-medium",
            statusStyles[donation.status as keyof typeof statusStyles]
          )}
        >
          <StatusIcon className="w-4 h-4 mr-2" />
          {donation.status}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <p className="text-blue-100 text-sm mb-1">Donation Amount</p>
              <p className="text-4xl font-bold">{formatAmount(donation.amount, donation.currency)}</p>
              <p className="text-blue-100 text-sm mt-2">{donation.currency}</p>
            </div>
          </Card>

          {/* Donor Information */}
          <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Donor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{donation.donorName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900">{donation.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{donation.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{donation.paymentMethod}</p>
                  {donation.bankName && (
                    <p className="text-sm text-gray-500">{donation.bankName}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes/Message */}
          {donation.notes && (
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  Message from Donor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-gray-700 italic">"{donation.notes}"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Transaction Details */}
        <div className="space-y-6">
          {/* Transaction Details Card */}
          <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono font-medium text-gray-900">{donation.transactionId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="font-mono font-medium text-gray-900">{donation.referenceNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900 text-sm">{formatDateTime(donation.date, donation.time)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{donation.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {donation.receiptUrl ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              ) : (
                <Button className="w-full rounded-xl" variant="outline" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Receipt Not Available
                </Button>
              )}
              <Button variant="outline" className="w-full rounded-xl border-gray-200">
                Send Confirmation Email
              </Button>
              {donation.status === "Pending" && (
                <Button variant="outline" className="w-full rounded-xl border-green-200 text-green-600 hover:bg-green-50">
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
