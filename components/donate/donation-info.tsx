"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { MultiSelect } from "@/components/ui/multi-select" // Import multi-select component

const donationCategories = [
  { label: "Medical & Healthcare", value: "healthcare" },
  { label: "Food & Water Solution", value: "food_water" },
  { label: "Education", value: "education" },
  { label: "Sustainable Livelihoods", value: "livelihoods" },
  { label: "Orphans & Children's", value: "orphans" },
  { label: "Emergency Relief", value: "relief" },
  { label: "Zakat", value: "zakat" },
  { label: "Qurbani & Fitra", value: "qurbani" },
]

interface DonationInfoProps {
  donationType: string
}

export function DonationInfo({ donationType }: DonationInfoProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  return (
    <Card className="border-2 border-gray-200 shadow-md">
      <CardContent className="p-6 space-y-6">
        <h2 className="font-semibold text-lg mb-4">You Are Donating To:</h2>

        {/* Multi-Select Dropdown for Donation Categories */}
        <div className="space-y-2">
          <Label>Select Categories</Label>
          <MultiSelect
            options={donationCategories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Choose donation categories"
          />
        </div>

        {/* Live Donation Appeals */}
        {donationType === "live" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="font-semibold text-lg">Live Ongoing Appeals</h2>

            {/* Live Campaign 1 */}
            <Card className="border border-primary shadow-md relative">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-lg">Emergency Relief for Palestine</h3>
                <p className="text-sm text-gray-600">Providing urgent aid to families affected by conflict.</p>
                <Progress value={75} className="h-2 bg-gray-300" />
                <p className="text-sm font-semibold">Raised: $75,000 / Goal: $100,000</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1"
                >
                  Live
                </motion.div>
              </CardContent>
            </Card>

            {/* Live Campaign 2 */}
            <Card className="border border-primary shadow-md relative">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-lg">Clean Water Initiative for Africa</h3>
                <p className="text-sm text-gray-600">Providing access to clean drinking water in rural villages.</p>
                <Progress value={60} className="h-2 bg-gray-300" />
                <p className="text-sm font-semibold">Raised: $60,000 / Goal: $100,000</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1"
                >
                  Live
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
