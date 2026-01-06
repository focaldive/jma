"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Loader2, User, Trash2 } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  linkedin: string | null;
  twitter: string | null;
  order: number;
  isActive: boolean;
  showOnSite: boolean;
};

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
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

  // Load existing data
  useEffect(() => {
    const loadMember = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/team/${memberId}`);
        const result = await res.json();

        if (result.success) {
          const member: TeamMember = result.data;
          setFormData({
            name: member.name,
            role: member.role,
            department: member.department || "",
            bio: member.bio || "",
            phone: member.phone || "",
            email: member.email || "",
            linkedin: member.linkedin || "",
            twitter: member.twitter || "",
            order: member.order,
            isActive: member.isActive,
            showOnSite: member.showOnSite,
          });
          setFormImage(member.image);
          setUploadedImagePath(member.image);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading team member:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (memberId) {
      loadMember();
    }
  }, [memberId]);

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
          toast.error(result.message || "Failed to upload image");
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        toast.error("Failed to upload image");
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
      const res = await fetch(`/api/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: uploadedImagePath,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Team member updated successfully!");
        router.push("/admin/team");
      } else {
        toast.error(result.message || "Failed to update team member");
      }
    } catch (err) {
      console.error("Error updating team member:", err);
      toast.error("Failed to update team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await fetch(`/api/team/${memberId}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Team member deleted successfully!");
        router.push("/admin/team");
      } else {
        toast.error(result.message || "Failed to delete team member");
      }
    } catch (err) {
      toast.error("Failed to delete team member");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading team member...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Team Member Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The team member with ID &quot;{memberId}&quot; does not exist.
          </p>
          <Button
            onClick={() => router.push("/admin/team")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Team
          </Button>
        </div>
      </div>
    );
  }

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
                Edit Team Member
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
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
                  "Save Changes"
                )}
              </Button>
            </div>
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
            <p className="text-sm text-gray-500 mt-2">Click to change photo</p>
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
