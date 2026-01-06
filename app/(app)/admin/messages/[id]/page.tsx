"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Reply,
  Phone,
  Mail,
  User,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

enum MessageStatus {
  NEW = "NEW",
  READ = "READ",
  REPLIED = "REPLIED",
  ARCHIVED = "ARCHIVED",
  SPAM = "SPAM",
}

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  READ: "bg-gray-100 text-gray-600",
  REPLIED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-yellow-100 text-yellow-700",
  SPAM: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  NEW: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
  SPAM: "Spam",
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export default function MessageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState<ContactSubmission | null>(null);

  const fetchMessage = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/contact/${messageId}`);
      const result = await res.json();

      if (result.success) {
        setMessage(result.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching message:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messageId) {
      fetchMessage();
    }
  }, [messageId]);

  const toggleReadStatus = async () => {
    if (!message) return;

    const newStatus =
      message.status === MessageStatus.NEW
        ? MessageStatus.READ
        : MessageStatus.NEW;

    try {
      const res = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success(`Marked as ${statusLabels[newStatus]}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleReply = () => {
    if (message) {
      // Mark as replied when clicking reply
      //   if (message.status !== MessageStatus.REPLIED) {
      //      // Optional: Update status to REPLIED automatically?
      //      // keeping it simple for now
      //   }

      const subject = message.subject
        ? `Re: ${message.subject}`
        : "Re: Contact Inquiry";
      window.location.href = `mailto:${
        message.email
      }?subject=${encodeURIComponent(subject)}`;

      // We could also offer a prompt to update status to "REPLIED" here
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${messageId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Message deleted successfully");
        router.push("/admin/messages");
      } else {
        toast.error(result.message || "Failed to delete message");
      }
    } catch (error) {
      toast.error("Error deleting message");
    }
  };

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading message...</span>
        </div>
      </div>
    );
  }

  if (notFound || !message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Message Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The message with ID &quot;{messageId}&quot; does not exist.
          </p>
          <Button
            onClick={() => router.push("/admin/messages")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Messages
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
            onClick={() => router.push("/admin/messages")}
            className="hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Message Details
            </h1>
            <p className="text-sm text-gray-500">View full message</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={toggleReadStatus}
            className="rounded-xl"
            disabled={message.status === MessageStatus.REPLIED} // Maybe allow changing from replied back to unread?
          >
            {message.status === MessageStatus.NEW ? (
              <>
                <Eye className="w-4 h-4 mr-2" /> Mark as Read
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" /> Mark as Unread
              </>
            )}
          </Button>
          <Button
            onClick={handleReply}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Reply className="w-4 h-4 mr-2" /> Reply
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {message.subject || "(No Subject)"}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn("text-xs", statusStyles[message.status])}>
                {statusLabels[message.status]}
              </Badge>
            </div>
          </div>

          {/* Message Body */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Message</h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Technical Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">IP Address</p>
                <p className="text-gray-900">
                  {message.ipAddress || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">User Agent</p>
                <p
                  className="text-gray-900 truncate"
                  title={message.userAgent || ""}
                >
                  {message.userAgent || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sender Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Sender Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{message.name}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900">{message.email}</p>
                  </div>
                </div>

                {message.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900">{message.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Received</p>
                    <p className="text-gray-900">
                      {formatFullDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                onClick={handleReply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl justify-start"
              >
                <Reply className="w-4 h-4 mr-2" /> Reply to Message
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  (window.location.href = `mailto:${message.email}`)
                }
                className="w-full rounded-xl justify-start"
              >
                <Mail className="w-4 h-4 mr-2" /> Send New Email
              </Button>
              {message.phone && (
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `tel:${message.phone}`)
                  }
                  className="w-full rounded-xl justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" /> Call Sender
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
