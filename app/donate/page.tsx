"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/donate/header"
import { DonationForm } from "@/components/donate/donation-form"
import { DonationInfo } from "@/components/donate/donation-info"
import { DonorForm } from "@/components/donate/donor-form"
import { PromiseCard } from "@/components/donate/promotion"
import { NewsletterSignup } from "@/components/donate/newsletter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DonationPage() {
  const [donationType, setDonationType] = useState<string>("normal")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <motion.div
          className="max-w-5xl mx-auto space-y-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />

          {/* Donation Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Card className="border-2 border-primary/10 shadow-md">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Select Donation Type</h2>
                <Tabs defaultValue="normal" className="w-full" onValueChange={(value) => setDonationType(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="normal">Normal Donation</TabsTrigger>
                    <TabsTrigger value="live">Live Appeal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="normal" className="space-y-4">
                    <p className="text-sm ">
                      Your donation will support our ongoing programs and initiatives to help those in need.
                    </p>
                  </TabsContent>
                  <TabsContent value="live" className="space-y-4">
                    <p className="text-sm ">
                      Your donation will go directly to our current live appeal campaign for immediate assistance.
                    </p>

                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:block"
              >
                <DonationInfo donationType={donationType} />
              </motion.div>
              <DonorForm />
              <PromiseCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <DonationForm donationType={donationType} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:hidden"
              >
                <DonationInfo donationType={donationType} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <NewsletterSignup />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

