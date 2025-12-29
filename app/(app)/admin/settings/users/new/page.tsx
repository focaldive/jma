"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Loader2, User } from "lucide-react"

const roles = ["Admin", "Editor", "User"]

export default function AddUserPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formImage, setFormImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => setFormImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = "Name is required"
    if (!formData.email.trim()) errs.email = "Email is required"
    if (!formData.role) errs.role = "Role is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    const newUser = {
      ...formData,
      status: formData.isActive ? "Active" : "Disabled",
      image: formImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff`,
    }
    console.log("Creating user:", newUser)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
    router.push("/admin/settings/users")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/settings/users")} className="hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
            <p className="text-sm text-gray-500">Create a new user account</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create User"}
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Image Upload */}
        <div className="flex flex-col items-center mb-8">
          <div onClick={() => fileInputRef.current?.click()} className="relative w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden">
            {formImage ? <img src={formImage} alt="" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-400" />}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors">
              <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
            <Input
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }) }}
              placeholder="Enter full name"
              className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: "" }) }}
              placeholder="user@email.com"
              className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+94 77 123 4567"
              className="mt-2 rounded-xl bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></Label>
            <Select value={formData.role} onValueChange={(v) => { setFormData({ ...formData, role: v }); if (errors.role) setErrors({ ...errors, role: "" }) }}>
              <SelectTrigger className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${errors.role ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Account Status</p>
                <p className="text-xs text-gray-500 mt-1">Enable to activate user account immediately</p>
              </div>
              <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
