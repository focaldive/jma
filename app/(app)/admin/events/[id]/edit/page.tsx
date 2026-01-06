"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  CalendarDays,
  MapPin,
  Image as ImageIcon,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const categories = [
  "Fundraiser",
  "Health",
  "Religious",
  "Education",
  "Welfare",
  "Community",
  "Workshop",
  "Charity",
];

const categoryStyles: Record<string, string> = {
  Fundraiser: "bg-purple-100 text-purple-700",
  Health: "bg-green-100 text-green-700",
  Religious: "bg-blue-100 text-blue-700",
  Education: "bg-yellow-100 text-yellow-700",
  Welfare: "bg-pink-100 text-pink-700",
  Community: "bg-orange-100 text-orange-700",
  Workshop: "bg-indigo-100 text-indigo-700",
  Charity: "bg-teal-100 text-teal-700",
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventNotFound, setEventNotFound] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    date: "",
    endDate: "",
    time: "",
    location: "",
    address: "",
    isPublished: false,
    isFeatured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const result = await response.json();

        if (result.success) {
          const event = result.data;
          setFormData({
            title: event.title || "",
            slug: event.slug || "",
            description: event.description || "",
            category: event.category || "",
            date: event.date
              ? new Date(event.date).toISOString().split("T")[0]
              : "",
            endDate: event.endDate
              ? new Date(event.endDate).toISOString().split("T")[0]
              : "",
            time: event.time || "",
            location: event.location || "",
            address: event.address || "",
            isPublished: event.isPublished || false,
            isFeatured: event.isFeatured || false,
          });
          setFeaturedImage(event.image);
          setEventNotFound(false);
        } else {
          setEventNotFound(true);
          toast.error(result.message || "Failed to fetch event details.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setEventNotFound(true);
        toast.error("An error occurred while fetching the event.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Start date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publish: boolean = formData.isPublished) => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      ...formData,
      image: featuredImage,
      isPublished: publish,
    };

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Event updated successfully!");
        router.push("/admin/events");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while updating the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPreviewDate = (dateStr: string) => {
    if (!dateStr) return "Date not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading event...</span>
        </div>
      </div>
    );
  }

  if (eventNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The event with ID &quot;{eventId}&quot; does not exist.
          </p>
          <Button
            onClick={() => router.push("/admin/events")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/events")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Event
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="rounded-xl border-gray-200"
              >
                {formData.isPublished ? "Set to Draft" : "Save as Draft"}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Event Details
              </h2>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title..."
                    className={cn(
                      "mt-2 rounded-xl bg-gray-50 border-gray-200",
                      errors.title && "border-red-500"
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="slug"
                    className="text-sm font-medium text-gray-700"
                  >
                    URL Slug <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="event-url-slug"
                      className={cn(
                        "pl-9 rounded-xl bg-gray-50 border-gray-200",
                        errors.slug && "border-red-500"
                      )}
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={cn(
                        "mt-2 rounded-xl bg-gray-50 border-gray-200",
                        errors.date && "border-red-500"
                      )}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="endDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      End Date (Optional)
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="mt-2 rounded-xl bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="time"
                      className="text-sm font-medium text-gray-700"
                    >
                      Display Time (e.g., 10:00 AM)
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="e.g. 10:00 AM - 2:00 PM"
                        className="pl-9 rounded-xl bg-gray-50 border-gray-200"
                      />
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-700"
                    >
                      Location Name
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Community Hall"
                        className="pl-9 rounded-xl bg-gray-50 border-gray-200"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Address (Optional)
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full physical address..."
                    rows={2}
                    className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-gray-700">
                Event Banner Image (Optional)
              </Label>
              <div className="mt-3">
                {featuredImage ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag and drop an image, or{" "}
                            <span className="text-blue-600">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Detailed Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed event description..."
                rows={8}
                className="mt-2 rounded-xl bg-gray-50 border-gray-200 resize-none"
              />
            </div>
          </div>

          {/* Sidebar - Controls & Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Published
                    </Label>
                    <p className="text-xs text-gray-500">
                      Make this event public
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isPublished", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Featured
                    </Label>
                    <p className="text-xs text-gray-500">Show on homepage</p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isFeatured", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Event Preview
              </h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-blue-300" />
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <p className="font-semibold text-gray-900 line-clamp-2">
                    {formData.title || "Event Title"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {formatPreviewDate(formData.date)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {formData.location || "Location not set"}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.isPublished ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-none">
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-none">
                        Draft
                      </Badge>
                    )}
                    {formData.category && (
                      <Badge
                        className={cn(
                          "text-xs border-none",
                          categoryStyles[formData.category]
                        )}
                      >
                        {formData.category}
                      </Badge>
                    )}
                    {formData.isFeatured && (
                      <Badge className="bg-amber-100 text-amber-700 border-none">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
