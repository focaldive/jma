"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);

      // Split name into first and last
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          source: "newsletter_component",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success(data.message);
        setEmail("");
        setName("");
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-blue-50/50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-medium text-gray-900">
            You're all set!
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for subscribing to our newsletter. We've added{" "}
            <span className="font-semibold text-gray-900">{email}</span> to our
            list.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSuccess(false)}
            className="mt-4 rounded-xl"
          >
            Subscribe another email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-100">
      <div className="container mx-auto px-4 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Left Side - Full Image */}
          <div className="relative h-64 lg:h-auto overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80"
              alt="Community gathering"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-blue-900/80 to-transparent" />
          </div>

          {/* Right Side - Newsletter Form */}
          <div className="flex items-center justify-center py-12 lg:py-20 px-6 lg:px-12 bg-gradient-to-br from-blue-50/30 to-white rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Stay Updated</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-medium text-gray-900 tracking-tight">
                  Join our community
                </h2>
                <p className="text-gray-500 text-base lg:text-lg leading-relaxed">
                  Subscribe to get the latest updates on our projects, events,
                  and community initiatives directly to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Full Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-4 h-14 rounded-2xl border-gray-200 bg-white focus:bg-white focus:border-blue-500 text-base transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-gray-200 bg-white focus:bg-white focus:border-blue-500 text-base transition-all duration-300"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-200 transition-all duration-300 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Subscribe Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
