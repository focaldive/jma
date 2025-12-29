"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const years = [2024, 2023, 2022, 2021, 2020]

const categories = [
  "Education",
  "Health",
  "Food Aid",
  "Infrastructure",
  "Welfare",
  "Livelihood",
  "Emergency",
]

export default function CreateProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    description: "",
    location: "",
    category: "",
    amount: "",
    notes: "",
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

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.year) newErrors.year = "Year is required"
    if (!formData.month) newErrors.month = "Month is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    console.log("Creating project:", formData)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/projects")
    }, 1000)
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    console.log("Saving draft:", formData)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/projects")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/projects")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Create New Project
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="rounded-xl border-gray-200"
              >
                Save as Draft
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {/* Date Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Period</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleSelectChange("year", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.year && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Month <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.month}
                  onValueChange={(value) => handleSelectChange("month", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.month && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.month && (
                  <p className="text-red-500 text-sm mt-1">{errors.month}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description..."
                  className={cn(
                    "mt-2 rounded-xl bg-gray-50 border-gray-200",
                    errors.description && "border-red-500"
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location..."
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.location && "border-red-500"
                    )}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "mt-2 rounded-xl bg-gray-50 border-gray-200",
                        errors.category && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount (LKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount..."
                className={cn(
                  "mt-2 rounded-xl bg-gray-50 border-gray-200",
                  errors.amount && "border-red-500"
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter the total project budget in Sri Lankan Rupees
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes about the project..."
                rows={4}
                className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
