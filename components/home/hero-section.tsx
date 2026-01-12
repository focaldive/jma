"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DonationInfo } from "@/components/donate/donation-info";
import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button-sdk";

const heroContent = [
  {
    image: {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Woman collecting water",
    },
    title: "Clean Water Initiative",
    description:
      "Help us provide clean and safe drinking water to communities in need. Your support can transform lives and improve health outcomes for thousands.",
    cta: "Support Clean Water",
    link: "/water-initiative",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Children in classroom",
    },
    title: "Education for All",
    description:
      "Empower the next generation through education. Your contribution helps build schools, provide supplies, and support teachers in underserved areas.",
    cta: "Empower Education",
    link: "/education-program",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1617450365226-9bf28c04e130?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Medical aid",
    },
    title: "Healthcare Access",
    description:
      "Bring vital medical care to those who need it most. Your donation supports mobile clinics, essential medicines, and healthcare professionals in remote areas.",
    cta: "Support Healthcare",
    link: "/healthcare-program",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Donation form state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    amount: "",
  });

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroContent.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(""); // Clear custom amount when preset is selected
  };

  const handleDonateClick = () => {
    // Reset errors
    const newErrors = { name: "", email: "", amount: "" };
    let hasError = false;

    // Validate form
    if (!donorName.trim()) {
      newErrors.name = "Please enter your name";
      hasError = true;
    }

    if (!donorEmail.trim()) {
      newErrors.email = "Please enter your email";
      hasError = true;
    }

    const finalAmount = customAmount
      ? parseFloat(customAmount)
      : selectedAmount;
    if (!finalAmount || finalAmount <= 0) {
      newErrors.amount = "Please select or enter a donation amount";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    // Show PayPal button
    setShowPayPal(true);
  };

  const handleDonationComplete = async (details: any) => {
    console.log("Donation completed:", details);

    try {
      // Split name into first and last
      const nameParts = donorName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: customAmount ? parseFloat(customAmount) : selectedAmount,
          firstName,
          lastName,
          email: donorEmail,
          paymentMethod: "PayPal",
          status: "COMPLETED",
          notes: `PayPal Order ID: ${details.id}`,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save donation to database");
      }
    } catch (error) {
      console.error("Error saving donation:", error);
    }

    alert(`Thank you ${donorName} for your donation!`);

    // Reset form
    setDonorName("");
    setDonorEmail("");
    setSelectedAmount(null);
    setCustomAmount("");
    setShowPayPal(false);
    setErrors({ name: "", email: "", amount: "" });
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gray-100 pt-8">
      <div className="min-h-screen flex items-center py-12 md:py-20">
        <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Left Column - Carousel (2/3 width) */}
          <div className="flex-1  relative min-h-[500px] md:min-h-[600px] lg:min-h-[100px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ml-4 md:ml-">
            {/* Background Slider - Only for Carousel */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={
                      heroContent[currentIndex].image.src || "/placeholder.svg"
                    }
                    alt={heroContent[currentIndex].image.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Content */}
            <div className="relative h-full flex items-center p-6 md:p-10 lg:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4 md:space-y-6 lg:space-y-8 w-full"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs md:text-sm font-medium"
                  >
                    <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
                    FEATURED INITIATIVE
                  </motion.div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-white leading-tight tracking-tight">
                    {heroContent[currentIndex].title}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                    {heroContent[currentIndex].description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 md:pt-4">
                    <Link href={heroContent[currentIndex].link}>
                      <Button
                        size="lg"
                        className="text-white border-0 rounded-full px-6 md:px-8 py-4 md:py-6 text-sm md:text-base lg:text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        {heroContent[currentIndex].cta}
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center gap-4 mt-6 md:mt-8 lg:mt-12">
                    <Button
                      size="icon"
                      onClick={handlePrev}
                      className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm h-10 w-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex gap-2">
                      {heroContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleDotClick(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            currentIndex === index
                              ? "bg-white w-8"
                              : "bg-white/40 hover:bg-white/60"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      size="icon"
                      onClick={handleNext}
                      className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm h-10 w-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column - Donation Form (1/3 width) */}
          <div className="flex items-center justify-end ml-auto pr-4 md:pr-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full"
            >
              {/* Glassmorphic Container */}
              <div className="bg-white w-[340px] rounded-2xl md:rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-[22px] p-5 md:p-6 space-y-4 md:space-y-5">
                  <h2 className="text-lg md:text-xl font-medium text-gray-900 text-center">
                    {showPayPal ? "Complete Donation" : "Make a Donation"}
                  </h2>

                  {/* Form Fields - Only show when NOT in PayPal mode */}
                  {!showPayPal ? (
                    <>
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="donor-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          id="donor-name"
                          type="text"
                          placeholder="Your full name"
                          value={donorName}
                          onChange={(e) => {
                            setDonorName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all text-sm md:text-base ${
                            errors.name
                              ? "border-red-500 focus:ring-2 focus:ring-red-500"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="donor-email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          id="donor-email"
                          type="email"
                          placeholder="your@email.com"
                          value={donorEmail}
                          onChange={(e) => {
                            setDonorEmail(e.target.value);
                            if (errors.email)
                              setErrors({ ...errors, email: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all text-sm md:text-base ${
                            errors.email
                              ? "border-red-500 focus:ring-2 focus:ring-red-500"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Custom Amount Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="custom-amount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Enter Custom Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                            $
                          </span>
                          <input
                            id="custom-amount"
                            type="text"
                            placeholder="0.00"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setSelectedAmount(null);
                              if (errors.amount)
                                setErrors({ ...errors, amount: "" });
                            }}
                            className={`w-full pl-7 pr-3 py-2.5 rounded-lg border-2 outline-none transition-all text-sm ${
                              errors.amount
                                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Amount Buttons */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Amount
                        </label>
                        {errors.amount &&
                          customAmount === "" &&
                          selectedAmount === null && (
                            <p className="text-red-500 text-xs">
                              {errors.amount}
                            </p>
                          )}
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleAmountSelect(50);
                              if (errors.amount)
                                setErrors({ ...errors, amount: "" });
                            }}
                            className={`px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg border-2 font-semibold transition-all duration-300 text-xs md:text-sm ${
                              selectedAmount === 50
                                ? "border-blue-600 bg-blue-600 text-white"
                                : errors.amount &&
                                  !customAmount &&
                                  !selectedAmount
                                ? "border-red-500 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            $50
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleAmountSelect(100);
                              if (errors.amount)
                                setErrors({ ...errors, amount: "" });
                            }}
                            className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 font-semibold transition-all duration-300 text-sm md:text-base ${
                              selectedAmount === 100
                                ? "border-blue-600 bg-blue-600 text-white"
                                : errors.amount &&
                                  !customAmount &&
                                  !selectedAmount
                                ? "border-red-500 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            $100
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleAmountSelect(1000);
                              if (errors.amount)
                                setErrors({ ...errors, amount: "" });
                            }}
                            className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg border-2 font-semibold transition-all duration-300 text-sm md:text-base ${
                              selectedAmount === 1000
                                ? "border-blue-600 bg-blue-600 text-white"
                                : errors.amount &&
                                  !customAmount &&
                                  !selectedAmount
                                ? "border-red-500 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            $1000
                          </button>
                        </div>
                      </div>

                      {/* Donate Action */}
                      <button
                        type="button"
                        onClick={handleDonateClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm"
                      >
                        Donate Now
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Donation Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                            Total Donation
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            ${customAmount || selectedAmount}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Donor:</span>
                            <span className="font-medium text-gray-900">
                              {donorName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-900">
                              {donorEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-600 mb-2">
                        Click below to proceed to PayPal checkout:
                      </div>

                      <PayPalDonateButton
                        hostedButtonId="YOUR_HOSTED_BUTTON_ID"
                        onComplete={handleDonationComplete}
                        sandbox={true}
                        className="w-full"
                        amount={
                          customAmount
                            ? parseFloat(customAmount)
                            : selectedAmount || 10
                        }
                        donorName={donorName}
                        donorEmail={donorEmail}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleDonationComplete({ id: `TEST-${Date.now()}` })
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow mt-2 text-sm transition-colors"
                      >
                        [TEST] Save to Database
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPayPal(false)}
                        className="w-full text-gray-500 hover:text-gray-800 text-sm font-medium py-2 transition-colors hover:underline"
                      >
                        ← Back to details
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    Your donation is secure and tax-deductible
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
