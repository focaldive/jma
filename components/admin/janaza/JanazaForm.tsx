"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statuses = ["UPCOMING", "COMPLETED", "CANCELLED"];

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

interface JanazaFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function JanazaForm({
  initialData,
  isEditing = false,
}: JanazaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    deceasedName: initialData?.deceasedName || "",
    age: initialData?.age || "",
    prayerDate: initialData?.prayerDate
      ? new Date(initialData.prayerDate).toISOString().split("T")[0]
      : "",
    prayerTime: initialData?.prayerTime || "",
    prayerLocation: initialData?.prayerLocation || "",
    burialLocation: initialData?.burialLocation || "",
    contactName: initialData?.contactName || "",
    contactPhone: initialData?.contactPhone || "",
    contactEmail: initialData?.contactEmail || "",
    notes: initialData?.notes || "",
    status: initialData?.status || "",
    isPublished: initialData?.isPublished || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.deceasedName.trim())
      newErrors.deceasedName = "Deceased name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.prayerDate) newErrors.prayerDate = "Prayer date is required";
    if (!formData.prayerTime) newErrors.prayerTime = "Prayer time is required";
    if (!formData.prayerLocation.trim())
      newErrors.prayerLocation = "Prayer location is required";
    if (!formData.burialLocation.trim())
      newErrors.burialLocation = "Burial location is required";
    if (!formData.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (isPublished && !validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/janaza/${initialData.id}` : "/api/janaza";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isPublished }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save notice");
      }

      toast.success(
        isPublished
          ? `Janaza notice ${isEditing ? "updated" : "published"} successfully`
          : "Draft saved successfully"
      );
      router.push("/admin/janaza");
      router.refresh();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

  const formatPreviewDate = (dateStr: string) => {
    if (!dateStr) return "Date not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPreviewTime = (timeStr: string) => {
    if (!timeStr) return "Time not set";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white border-gray-200 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update the details of the janaza notice"
                : "Fill in the details to create a janaza notice"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white border-gray-200 shadow-sm"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? "Update Notice" : "Publish Notice"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deceased Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Deceased Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="deceasedName"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deceasedName}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="age"
                  className="text-sm font-medium text-gray-700"
                >
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
                <Label
                  htmlFor="prayerDate"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.prayerDate}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="prayerTime"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.prayerTime}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="prayerLocation"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.prayerLocation}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="burialLocation"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.burialLocation}
                  </p>
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
                <Label
                  htmlFor="contactName"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactName}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="contactPhone"
                  className="text-sm font-medium text-gray-700"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactPhone}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="contactEmail"
                  className="text-sm font-medium text-gray-700"
                >
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status & Notes
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
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
                    <Label
                      htmlFor="isPublished"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Publish immediately
                    </Label>
                  </div>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-700"
                >
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
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Announcement Preview
            </h3>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 text-white text-center">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Inna Lillahi Wa Inna Ilayhi Rajioon
                </p>
                <p className="text-lg font-semibold">
                  {formData.deceasedName || "Deceased Name"}
                </p>
                {formData.age && (
                  <p className="text-sm text-gray-300">
                    Age: {formData.age} years
                  </p>
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
                    <Badge
                      className={cn("text-xs", statusStyles[formData.status])}
                    >
                      {formData.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Contact Preview
            </h3>
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
  );
}
