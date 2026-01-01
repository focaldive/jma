"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, Loader2, User } from "lucide-react";

// Sample users data
const usersData: Record<
  string,
  {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    image: string;
  }
> = {
  "1": {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@jma.lk",
    phone: "+94 77 123 4567",
    role: "Admin",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  "2": {
    name: "Fatima Ibrahim",
    email: "fatima.ibrahim@jma.lk",
    phone: "+94 76 234 5678",
    role: "Editor",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  "3": {
    name: "Mohamed Ali",
    email: "mohamed.ali@jma.lk",
    phone: "+94 71 345 6789",
    role: "User",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  "4": {
    name: "Aisha Khan",
    email: "aisha.khan@jma.lk",
    phone: "+94 77 456 7890",
    role: "Editor",
    status: "Disabled",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  "5": {
    name: "Yusuf Rahman",
    email: "yusuf.rahman@jma.lk",
    phone: "+94 76 567 8901",
    role: "User",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  "6": {
    name: "Zainab Saleh",
    email: "zainab.saleh@jma.lk",
    phone: "+94 71 678 9012",
    role: "Admin",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  "7": {
    name: "Omar Faisal",
    email: "omar.faisal@jma.lk",
    phone: "+94 77 789 0123",
    role: "User",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
  "8": {
    name: "Mariam Begum",
    email: "mariam.begum@jma.lk",
    phone: "+94 76 890 1234",
    role: "Editor",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  "9": {
    name: "Hassan Ibrahim",
    email: "hassan.ibrahim@jma.lk",
    phone: "+94 77 901 2345",
    role: "User",
    status: "Disabled",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
  },
  "10": {
    name: "Khadija Hassan",
    email: "khadija.hassan@jma.lk",
    phone: "+94 71 012 3456",
    role: "User",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
  },
};

const roles = ["Admin", "Editor", "User"];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [formImage, setFormImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    role: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 300));

      const data = usersData[userId];
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          newPassword: "",
          confirmPassword: "",
          role: data.role,
          isActive: data.status === "Active",
        });
        setFormImage(data.image);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFormImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    // Password validation only if user is trying to change it
    if (formData.newPassword) {
      if (formData.newPassword.length < 8)
        errs.newPassword = "Password must be at least 8 characters";
      if (formData.newPassword !== formData.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) errs.role = "Role is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    console.log("Saving user:", { id: userId, ...formData, image: formImage });
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    router.push("/admin/settings/users");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading user...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The user with ID &quot;{userId}&quot; does not exist.
          </p>
          <Button
            onClick={() => router.push("/admin/settings/users")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Users
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
            onClick={() => router.push("/admin/settings/users")}
            className="hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-sm text-gray-500">Update user information</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Image Upload */}
        <div className="flex flex-col items-center mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="user@email.com"
              className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Phone</Label>
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
              New Password
            </Label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value });
                if (errors.newPassword)
                  setErrors({ ...errors, newPassword: "" });
              }}
              placeholder="Leave blank to keep current password"
              className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                errors.newPassword ? "border-red-500" : ""
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: "" });
              }}
              placeholder="Confirm new password"
              className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(v) => {
                setFormData({ ...formData, role: v });
                if (errors.role) setErrors({ ...errors, role: "" });
              }}
            >
              <SelectTrigger
                className={`mt-2 rounded-xl bg-gray-50 border-gray-200 ${
                  errors.role ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Account Status
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Toggle to enable or disable user account
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
