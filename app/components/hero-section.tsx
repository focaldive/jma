"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [donationType, setDonationType] = useState("one-time");

  const amounts = [
    { value: 40000, label: "Rs 40,000" },
    { value: 20000, label: "Rs 20,000" },
    { value: 10000, label: "Rs 10,000" },
    { value: 4000, label: "Rs 4,000" },
    { value: 2000, label: "Rs 2,000" },
    { value: 1200, label: "Rs 1,200" },
  ];

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Woman collecting water"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
              LATEST UPDATES
            </span>

            <h1 className="text-4xl lg:text-6xl font-bold text-white uppercase leading-tight tracking-tight">
              Jaffna Muslim Association UK
            </h1>

            <p className="text-lg text-white/90 leading-relaxed max-w-xl">
              Founded in 2002, Jaffna Muslim Association is a non-profit charity
              organisation created to help the people who were displaced from
              the town of Jaffna in Sri Lanka in 1990
            </p>

            <Link href="/news">
              <Button
                variant="outline"
                className="mt-5 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:scale-105 transition-transform duration-200"
              >
                MORE INFORMATION →
              </Button>
            </Link>
          </div>

          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border-0">
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
                    onClick={() => setSelectedAmount(value)}
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

              <Button className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200 py-6 text-lg font-medium rounded-lg">
                Complete Donation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
