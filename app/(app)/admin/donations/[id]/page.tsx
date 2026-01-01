"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  User,
  CreditCard,
  Calendar,
  Hash,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Tag,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  category: string | null;
  paymentMethod: string | null;
  notes: string | null;
  message: string | null;
  status: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const statusIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  COMPLETED: CheckCircle,
  PENDING: Clock,
  FAILED: XCircle,
  REFUNDED: XCircle,
};

export default function DonationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const donationId = params.id as string;
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/donations/${donationId}`);
        const data = await res.json();

        if (data.success) {
          setDonation(data.donation);
        } else {
          setError(data.message || "Donation not found");
        }
      } catch (err) {
        setError("Failed to fetch donation");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/donations/${donationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setDonation(data.donation);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDonorName = () => {
    if (!donation) return "";
    if (donation.isAnonymous) return "Anonymous Donor";
    const name = [donation.firstName, donation.lastName]
      .filter(Boolean)
      .join(" ");
    return name || "Unknown Donor";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Donation Not Found
        </h2>
        <p className="text-gray-500">
          {error || "The donation you're looking for doesn't exist."}
        </p>
        <Button
          onClick={() => router.push("/admin/donations")}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donations
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[donation.status] || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900">
              Donation Details
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              ID: {donation.id}
            </p>
          </div>
        </div>
        <Badge
          className={cn(
            "px-4 py-2 text-sm font-medium",
            statusStyles[donation.status] || statusStyles.PENDING
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
              <p className="text-4xl font-bold">
                {formatAmount(Number(donation.amount), donation.currency)}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-blue-100 text-sm">
                  {donation.currency}
                </span>
                {donation.category && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    <Tag className="w-3 h-3 mr-1" />
                    {donation.category}
                  </Badge>
                )}
              </div>
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
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </p>
                  <p className="font-medium text-gray-900">{getDonorName()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </p>
                  <p className="font-medium text-gray-900">
                    {donation.email || "Not provided"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-900">
                    {donation.phone || "Not provided"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </p>
                  <p className="font-medium text-gray-900">
                    {donation.paymentMethod || "Not specified"}
                  </p>
                </div>
                {donation.address && (
                  <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </p>
                    <p className="font-medium text-gray-900">
                      {donation.address}
                      {donation.region && `, ${donation.region}`}
                      {donation.country && `, ${donation.country}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message from Donor */}
          {donation.message && (
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  Message from Donor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-gray-700 italic">"{donation.message}"</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {donation.notes && (
            <Card className="rounded-2xl shadow-sm border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Admin Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <p className="text-gray-700">{donation.notes}</p>
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
                  <p className="font-mono font-medium text-gray-900 text-sm break-all">
                    {donation.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {formatDate(donation.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {donation.paymentMethod || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Confirmation Email
              </Button>
              {donation.status === "PENDING" && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => handleStatusUpdate("COMPLETED")}
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Mark as Completed
                </Button>
              )}
              {donation.status === "COMPLETED" && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                  onClick={() => handleStatusUpdate("REFUNDED")}
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Mark as Refunded
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
