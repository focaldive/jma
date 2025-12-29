"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Building2,
  Link2,
  Check,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TabKey = "general" | "bank" | "social"

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "bank", label: "Bank Details", icon: Building2 },
  { key: "social", label: "Social Links", icon: Link2 },
]

// Demo data
const initialData = {
  general: {
    siteName: "JMA - Jama'athul Muslim Association",
    email: "info@jma.lk",
    phone: "+94 11 234 5678",
    address: "123 Main Street, Colombo 03, Sri Lanka",
  },
  bank: {
    bankName: "Bank of Ceylon",
    accountHolder: "Jama'athul Muslim Association",
    accountNumber: "12345678901234",
    branch: "Colombo Main Branch",
    swiftCode: "BABOROLUXXX",
  },
  social: {
    facebook: "https://facebook.com/jmaofficial",
    instagram: "https://instagram.com/jmaofficial",
    twitter: "https://twitter.com/jmaofficial",
    youtube: "https://youtube.com/@jmaofficial",
    linkedin: "https://linkedin.com/company/jmaofficial",
  },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Form states
  const [generalData, setGeneralData] = useState(initialData.general)
  const [bankData, setBankData] = useState(initialData.bank)
  const [socialData, setSocialData] = useState(initialData.social)

  // Errors
  const [generalErrors, setGeneralErrors] = useState<Record<string, string>>({})
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({})

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Validate General
  const validateGeneral = () => {
    const errors: Record<string, string> = {}
    if (!generalData.siteName.trim()) errors.siteName = "Site name is required"
    if (!generalData.email.trim()) errors.email = "Email is required"
    if (!generalData.phone.trim()) errors.phone = "Phone is required"
    setGeneralErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Bank
  const validateBank = () => {
    const errors: Record<string, string> = {}
    if (!bankData.bankName.trim()) errors.bankName = "Bank name is required"
    if (!bankData.accountHolder.trim()) errors.accountHolder = "Account holder is required"
    if (!bankData.accountNumber.trim()) errors.accountNumber = "Account number is required"
    setBankErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save handlers
  const handleSaveGeneral = async () => {
    if (!validateGeneral()) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Saving general:", generalData)
    setIsSaving(false)
    showSuccessToast("General settings saved successfully!")
  }

  const handleSaveBank = async () => {
    if (!validateBank()) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Saving bank:", bankData)
    setIsSaving(false)
    showSuccessToast("Bank details saved successfully!")
  }

  const handleSaveSocial = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Saving social:", socialData)
    setIsSaving(false)
    showSuccessToast("Social links saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your site settings and configurations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative",
                  activeTab === tab.key
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    Site Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={generalData.siteName}
                    onChange={(e) => {
                      setGeneralData({ ...generalData, siteName: e.target.value })
                      if (generalErrors.siteName) setGeneralErrors({ ...generalErrors, siteName: "" })
                    }}
                    placeholder="Your organization name"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", generalErrors.siteName && "border-red-500")}
                  />
                  {generalErrors.siteName && <p className="text-red-500 text-sm mt-1">{generalErrors.siteName}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={generalData.email}
                    onChange={(e) => {
                      setGeneralData({ ...generalData, email: e.target.value })
                      if (generalErrors.email) setGeneralErrors({ ...generalErrors, email: "" })
                    }}
                    placeholder="contact@example.com"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", generalErrors.email && "border-red-500")}
                  />
                  {generalErrors.email && <p className="text-red-500 text-sm mt-1">{generalErrors.email}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={generalData.phone}
                    onChange={(e) => {
                      setGeneralData({ ...generalData, phone: e.target.value })
                      if (generalErrors.phone) setGeneralErrors({ ...generalErrors, phone: "" })
                    }}
                    placeholder="+94 11 234 5678"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", generalErrors.phone && "border-red-500")}
                  />
                  {generalErrors.phone && <p className="text-red-500 text-sm mt-1">{generalErrors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Address
                  </Label>
                  <Textarea
                    value={generalData.address}
                    onChange={(e) => setGeneralData({ ...generalData, address: e.target.value })}
                    placeholder="Full address"
                    rows={3}
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={handleSaveGeneral} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === "bank" && (
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Bank details will be displayed on donation pages for bank transfers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-gray-400" />
                    Bank Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={bankData.bankName}
                    onChange={(e) => {
                      setBankData({ ...bankData, bankName: e.target.value })
                      if (bankErrors.bankName) setBankErrors({ ...bankErrors, bankName: "" })
                    }}
                    placeholder="Bank of Ceylon"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", bankErrors.bankName && "border-red-500")}
                  />
                  {bankErrors.bankName && <p className="text-red-500 text-sm mt-1">{bankErrors.bankName}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Account Holder Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={bankData.accountHolder}
                    onChange={(e) => {
                      setBankData({ ...bankData, accountHolder: e.target.value })
                      if (bankErrors.accountHolder) setBankErrors({ ...bankErrors, accountHolder: "" })
                    }}
                    placeholder="Account holder name"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", bankErrors.accountHolder && "border-red-500")}
                  />
                  {bankErrors.accountHolder && <p className="text-red-500 text-sm mt-1">{bankErrors.accountHolder}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={bankData.accountNumber}
                    onChange={(e) => {
                      setBankData({ ...bankData, accountNumber: e.target.value })
                      if (bankErrors.accountNumber) setBankErrors({ ...bankErrors, accountNumber: "" })
                    }}
                    placeholder="12345678901234"
                    className={cn("mt-2 rounded-xl bg-gray-50 border-gray-200", bankErrors.accountNumber && "border-red-500")}
                  />
                  {bankErrors.accountNumber && <p className="text-red-500 text-sm mt-1">{bankErrors.accountNumber}</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Branch</Label>
                  <Input
                    value={bankData.branch}
                    onChange={(e) => setBankData({ ...bankData, branch: e.target.value })}
                    placeholder="Branch name"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">SWIFT / IBAN Code</Label>
                  <Input
                    value={bankData.swiftCode}
                    onChange={(e) => setBankData({ ...bankData, swiftCode: e.target.value })}
                    placeholder="BABOROLUXXX"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={handleSaveBank} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    value={socialData.facebook}
                    onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    value={socialData.instagram}
                    onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourpage"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-gray-800" />
                    Twitter / X
                  </Label>
                  <Input
                    value={socialData.twitter}
                    onChange={(e) => setSocialData({ ...socialData, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourpage"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    value={socialData.youtube}
                    onChange={(e) => setSocialData({ ...socialData, youtube: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    value={socialData.linkedin}
                    onChange={(e) => setSocialData({ ...socialData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button onClick={handleSaveSocial} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-xl shadow-lg">
            <Check className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
