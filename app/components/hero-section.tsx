"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Woman collecting water"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
              LATEST UPDATES
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white uppercase leading-tight">
              Jaffna Muslim Association UK
            </h1>
            <p className="text-lg text-white">
              Founded in 2002, Jaffna Muslim Association is a non-profit charity
              organisation created to help the people who were displaced from
              the town of Jaffna in Sri Lanka in 1990
            </p>
            <Link href="/news">
              <Button
                variant="outline"
                className="mt-5 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
              >
                MORE INFORMATION →
              </Button>
            </Link>
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <div className="space-y-6">
              <RadioGroup defaultValue="one-time" className="flex gap-2">
                <div>
                  <RadioGroupItem
                    value="one-time"
                    id="one-time"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="one-time"
                    className="flex items-center justify-center px-4 py-2 border rounded-md peer-data-[state=checked]:bg-teal-50 peer-data-[state=checked]:border-teal-600"
                  >
                    One time
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="flex items-center justify-center px-4 py-2 border rounded-md peer-data-[state=checked]:bg-teal-50 peer-data-[state=checked]:border-teal-600"
                  >
                    Monthly
                  </Label>
                </div>
              </RadioGroup>

              <p className="text-center text-gray-600">
                Your donation supports our mission
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[40000, 20000, 10000, 4000, 2000, 1200].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="w-full hover:bg-teal-50 hover:border-teal-600"
                  >
                    Rs {amount.toLocaleString()}
                  </Button>
                ))}
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Donate and Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
