"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { CarouselIndicators } from "./CarouselIndicators";

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
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationType, setDonationType] = useState("one-time");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === heroContent.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const amounts = [
    { value: 40000, label: "Rs 40,000" },
    { value: 20000, label: "Rs 20,000" },
    { value: 10000, label: "Rs 10,000" },
    { value: 4000, label: "Rs 4,000" },
    { value: 2000, label: "Rs 2,000" },
    { value: 1200, label: "Rs 1,200" },
  ];

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const handleAmountSelection = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 overflow-hidden mx-auto"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={heroContent[currentIndex].image.src}
            alt={heroContent[currentIndex].image.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative container mx-auto px-4 py-24">
        <div className="flex flex-col gap-10 lg:flex-row justify-between items-center mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium"
            >
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
              FEATURED INITIATIVE
            </motion.span>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1 className="text-4xl lg:text-6xl font-bold text-white uppercase leading-tight tracking-tight">
                  {heroContent[currentIndex].title}
                </motion.h1>

                <motion.p className="text-lg text-white/90 leading-relaxed max-w-xl mt-4">
                  {heroContent[currentIndex].description}
                </motion.p>

                <motion.div className="mt-8">
                  <Link href={heroContent[currentIndex].link}>
                    <Button
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:scale-105 transition-transform duration-200"
                    >
                      {heroContent[currentIndex].cta} →
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0 max-w-md">
              <div className="space-y-8">
                <RadioGroup
                  value={donationType}
                  onValueChange={setDonationType}
                  className="flex gap-3 justify-center"
                >
                  {["one-time", "monthly"].map((type) => (
                    <div key={type}>
                      <RadioGroupItem
                        value={type}
                        id={type}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type}
                        className="flex items-center justify-center px-6 py-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-teal-50
                          peer-data-[state=checked]:bg-teal-50 
                          peer-data-[state=checked]:border-teal-600
                          peer-data-[state=checked]:shadow-sm"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Make a Difference Today
                  </h3>
                  <p className="text-gray-600">
                    Your donation supports our mission to help those in need
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {amounts.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant="outline"
                      onClick={() => handleAmountSelection(value)}
                      className={`
                        w-full transition-all duration-200 hover:bg-teal-50 hover:border-teal-600
                        ${
                          selectedAmount === value
                            ? "bg-teal-50 border-teal-600 shadow-sm"
                            : ""
                        }
                      `}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    Rs
                  </span>
                </div>

                <Button className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200 py-6 text-lg font-medium rounded-lg">
                  Complete Donation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <CarouselIndicators
        total={heroContent.length}
        current={currentIndex}
        onSelect={(index: number) => setCurrentIndex(index)}
      />
    </motion.section>
  );
}

export default HeroSection;
