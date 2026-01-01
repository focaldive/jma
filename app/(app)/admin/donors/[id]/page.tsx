"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Loader2,
  User,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  status: string;
}

interface Donor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
  totalAmount: number;
  donationCount: number;
  donations: Donation[];
}

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function DonorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const donorId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donor, setDonor] = useState<Donor | null>(null);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await fetch(`/api/donors/${donorId}`);
        const data = await res.json();

        if (data.success) {
          setDonor(data.donor);
        } else {
          setError(data.message || "Donor not found");
        }
      } catch (err) {
        setError("Failed to fetch donor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (donorId) {
      fetchDonor();
    }
  }, [donorId]);

  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCountryName = (code: string | null) => {
    const countries: Record<string, string> = {
      us: "United States",
      ca: "Canada",
      uk: "United Kingdom",
      au: "Australia",
      lk: "Sri Lanka",
      other: "Other",
    };
    return code ? countries[code] || code : "Not specified";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading donor details...</span>
        </div>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Donor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || `The donor with ID "${donorId}" does not exist.`}
          </p>
          <Button
            onClick={() => router.push("/admin/donors")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Donors
          </Button>
        </div>
      </div>
    );
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
            <p className="text-sm text-gray-500">
              View and manage donor information
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {donor.name}
              </h2>
              <p className="text-sm text-gray-500">
                {getCountryName(donor.country)}
              </p>
            </div>

            <div className="space-y-4">
              {donor.address && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Address
                    </p>
                    <p className="text-sm text-gray-900">
                      {donor.address}
                      {donor.region && `, ${donor.region}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Country
                  </p>
                  <p className="text-sm text-gray-900">
                    {getCountryName(donor.country)}
                  </p>
                </div>
              </div>

              {donor.email && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm text-gray-900">{donor.email}</p>
                  </div>
                </div>
              )}

              {donor.phone && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900">{donor.phone}</p>
                  </div>
                </div>
              )}
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Donated
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {formatAmount(donor.totalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Total Donations
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {donor.donationCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Donation List */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Donation History
              </h3>
              {donor.donations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No donations found
                </div>
              ) : (
                <div className="space-y-4">
                  {donor.donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/donations/${donation.id}`)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {donation.category}
                            </p>
                            <Badge
                              className={cn(
                                "text-xs",
                                statusStyles[donation.status] ||
                                  statusStyles.PENDING
                              )}
                            >
                              {donation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(donation.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatAmount(donation.amount, donation.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
