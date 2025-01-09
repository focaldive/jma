"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const donationAmounts = [10, 20, 30, 40];

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-20 lg:py-40">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center space-y-4 px-4 sm:px-6">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Make a Donation
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your generosity can make a real difference. Every donation helps us
            support those in need and create lasting positive change in our
            community.
          </motion.p>
        </div>
        <br />
        {/* Donation Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg">
                    Select Donation Amount
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={
                          selectedAmount === amount ? "default" : "outline"
                        }
                        onClick={() => setSelectedAmount(amount)}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-amount">Other Amount (USD)</Label>
                    <Input
                      id="custom-amount"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-semibold text-lg">Payment Method</h2>
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit Card</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex gap-2">
                    <Image
                      src="/visa.svg?height=30&width=40"
                      alt="Visa"
                      width={40}
                      height={30}
                    />
                    <Image
                      src="/mastercard.svg?height=30&width=40"
                      alt="Mastercard"
                      width={40}
                      height={30}
                    />
                    <Image
                      src="/paypal.svg?height=30&width=40"
                      alt="Paypal"
                      width={40}
                      height={20}
                    />
                    <Image
                      src="/amex.svg?height=30&width=40"
                      alt="AmericanExpress"
                      width={40}
                      height={30}
                    />
                  </div>
                </div>

                <Button className="w-full">Donate Now</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg">
                    YOU ARE DONATING TO:
                  </h2>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                      Jaffna Muslim Fund for Education and Community Development
                    </h3>
                    <p className="text-sm text-muted-foreground">92% Funded</p>
                    <p className="text-sm font-semibold">Goal: $100,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg capitalize">
                    Donate without an account
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" />
                      <Input placeholder="Last Name" />
                    </div>
                    <Input type="email" placeholder="Email" />
                    <Input placeholder="Phone" />
                    <Input placeholder="Contact Address" />
                    <Input placeholder="Region" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm">
                      I accept the terms and conditions
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">
                  Our Promise to You
                </h2>
                <p className="text-sm text-muted-foreground">
                  Every donation made to our registered charities will be
                  utilized with utmost care and transparency. We ensure that
                  your contributions directly benefit those in need.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stay Connected Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Stay Connected</h2>
              <div className="flex gap-4">
                <Input placeholder="First Name" className="flex-1" />
                <Input placeholder="Last Name" className="flex-1" />
                <Input
                  type="email"
                  placeholder="Email address"
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
