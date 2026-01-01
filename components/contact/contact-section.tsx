"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
  errors?: string[];
}

const teamMembers = [
  {
    name: "Mr. IMRAN JUNOOB",
    role: "PRESIDENT",
    phone: "+44 (0)75 1XX XXX",
    image: "/assets/pres.png",
  },
  {
    name: "Mr. SALMAN MOHAMED SHAWJEER",
    role: "VICE CHAIRMAN",
    phone: "+44 (0)78 2XX XXX",
    image:
      "https://jaffnamuslimuk.org/wp-content/uploads/elementor/thumbs/IMG-20210105-WA0156-p0xdpqm6tsgrry3arutcgijb7vxtgofd4mi7p26a48.jpg",
  },
  {
    name: "Mr. MUTHU MOHAMED GIAS",
    role: "TREASURER",
    phone: "+44 (0)78 8XX XXX",
    image:
      "https://jaffnamuslimuk.org/wp-content/uploads/2020/10/Gias-169x300.png",
  },
  {
    name: "Mr. RAMEEZ ANES",
    role: "VICE PRESIDENT",
    phone: "+44 (0)78 9XX XXX",
    image:
      "https://jaffnamuslimuk.org/wp-content/uploads/2020/10/Ramees-169x300.jpg",
  },
  {
    name: "Mr. MOHAMED RAJAH AJMUL",
    role: "ASSISTANT SECRETARY",
    phone: "+44 (0)75 7XX XXX",
    image:
      "https://jaffnamuslimuk.org/wp-content/uploads/elementor/thumbs/Ajmul-owe1ir36wum87qsouz4lkkk9aev7x91uoe8ldeq29s.jpg",
  },
  {
    name: "Mr. AMSHAR RAMZEEN",
    role: "ASSISTANT TREASURER",
    phone: "+44 (0)75 1XX XXX",
    image:
      "https://jaffnamuslimuk.org/wp-content/uploads/elementor/thumbs/IMG-20210707-WA0294-p9t32gdn2bvdnafv4nya364w3ppy5mr7y1cudl51j4.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({ type: "loading", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        // Reset form after successful submission
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: "Please fix the errors below:",
          errors: data.errors || ["Something went wrong"],
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
      {/* Hero Section */}
      <div className="space-y-8 text-center ">
        <motion.h1
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl"
        >
          Meet Our Team
        </motion.h1>
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Empowering and supporting the Jaffna Muslim community since 2002
          through humanitarian aid and sustainable development
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {/* Team Members */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            {/* <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-gray-900 mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dedicated individuals committed to serving the Jaffna Muslim
                community
              </p>
            </motion.div> */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {teamMembers.map((member, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0 space-y-4">
                      <div className="aspect-[4/5] relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-gray-600">{member.role}</p>
                        <p className="text-sm text-gray-500 leading-normal">
                          {member.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Contact Information */}
        <motion.div
          className="grid md:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className=" text-gray-900 mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Feel free to reach out to us through any of the following
                channels:
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="tel:+447861591459"
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+44 786 159 1459</span>
              </a>
              <a
                href="https://facebook.com"
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Bank Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Jaffna Muslim Association - UK</p>
                <p>Lloyds Bank</p>
                <p>Account Number: 00390943</p>
                <p>Sort Code: 30-94-66</p>
                <p>BIC: LOYDGB21464</p>
                <p>IBAN: GB22 LOYD 3094 6600 3909 43</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-6xl">
              Send a Message
            </h2>
            <p className="text-gray-600">
              We&apos;re here to help and support our community. Get in touch
              with us for any inquiries or assistance.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Status Messages */}
              {status.type === "success" && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}

              {status.type === "error" && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{status.message}</span>
                  </div>
                  {status.errors && status.errors.length > 0 && (
                    <ul className="list-disc list-inside text-sm ml-7">
                      {status.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Input
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status.type === "loading"}
                  className="border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={status.type === "loading"}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.type === "loading"}
                  className="border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="message"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status.type === "loading"}
                  className="min-h-[150px] border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                size="lg"
                disabled={status.type === "loading"}
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
