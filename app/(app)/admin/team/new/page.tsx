"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Loader2, User } from "lucide-react";

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formImage, setFormImage] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    bio: "",
    phone: "",
    email: "",
    linkedin: "",
    twitter: "",
    order: 0,
    isActive: true,
    showOnSite: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (result.success) {
          setUploadedImagePath(result.filePath);
        } else {
          alert(result.message || "Failed to upload image");
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Failed to upload image");
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: uploadedImagePath,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Team member added successfully!");
        router.push("/admin/team");
      } else {
        alert(result.message || "Failed to add team member");
      }
    } catch (err) {
      console.error("Error adding team member:", err);
      alert("Failed to add team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/team")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Team Member
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Team Member"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden"
            >
              {formImage ? (
                <img
                  src={formImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="Enter full name"
                className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Role/Position <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  if (errors.role) setErrors({ ...errors, role: "" });
                }}
                placeholder="e.g., Executive Director, Volunteer Coordinator"
                className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                  errors.role ? "border-red-500" : ""
                }`}
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="e.g., Administration, Programs, Fundraising"
                className="mt-2 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>

            {/* Bio */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Biography
              </Label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Brief description about the team member..."
                rows={4}
                className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+94 77 123 4567"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  LinkedIn URL
                </Label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Twitter URL
                </Label>
                <Input
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/username"
                  className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Order */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Display Order
              </Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="mt-2 rounded-xl bg-gray-50 border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Active Status
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Inactive members won't be shown anywhere
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Show on Public Site
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Control visibility on the public website
                  </p>
                </div>
                <Switch
                  checked={formData.showOnSite}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showOnSite: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
