"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

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
          <h3 className="text-2xl font-bold text-gray-900">You're all set!</h3>
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
    <section className="w-full bg-white py-20 px-4 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Stay Updated</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Join our community
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              Subscribe to get the latest updates on our projects, events, and
              community initiatives directly to your inbox.
            </p>
          </div>

          <div className="flex-1 w-full md:max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-4 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 text-base transition-all duration-300 mb-3"
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
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 text-base transition-all duration-300"
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
    </section>
  );
}
