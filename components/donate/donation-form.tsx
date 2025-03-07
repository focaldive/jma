"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PayPalDonation } from "./paypal-donation"
import { validateClientEnv } from "@/utils/env-validation"
import type { ReactPayPalScriptOptions } from "@paypal/react-paypal-js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const donationAmounts = [10, 20, 50, 100]
const donationReasons = [
  { value: "education", label: "Education" },
  { value: "employability", label: "Employability" },
  { value: "fitra", label: "Fitra" },
  { value: "projects", label: "Projects" },
  { value: "zakat", label: "Zakat" },
  { value: "qurban", label: "Qurban" },
  { value: "general", label: "General Support" },
]

interface DonationFormProps {
  donationType: string
}

export function DonationForm({ donationType }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(20)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [donationReason, setDonationReason] = useState<string>("general")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [envError, setEnvError] = useState<string>("")
  const [paypalScriptOptions, setPaypalScriptOptions] = useState<ReactPayPalScriptOptions | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal")

  useEffect(() => {
    try {
      const env = validateClientEnv()
      if (!env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        throw new Error("PayPal Client ID is missing in environment variables.")
      }

      setPaypalScriptOptions({
        clientId: env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.trim(),
        currency: "USD",
      })
    } catch (error) {
      if (error instanceof Error) {
        setEnvError(error.message)
      } else {
        setEnvError("An unknown error occurred while configuring PayPal.")
      }
      console.error("Environment validation error:", error)
    }
  }, [])

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value)
      if (value) {
        setSelectedAmount(0) // Clear selected amount when custom amount is entered
      }
    }
  }

  if (envError) {
    return (
      <Card className="shadow-md border-2 border-red-100">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {envError}
              <p className="mt-2">
                Please check your environment variables and ensure the NEXT_PUBLIC_PAYPAL_CLIENT_ID is set correctly.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!paypalScriptOptions) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>Loading payment options...</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md border-2 border-primary/10">
      <CardContent className="p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Thank you for your generous donation! You will receive a confirmation email shortly.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Select Donation Amount</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {donationAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                onClick={() => {
                  setSelectedAmount(amount)
                  setCustomAmount("") // Clear custom amount when selecting a preset amount
                }}
                className="h-12"
              >
                ${amount.toFixed(2)}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Other Amount (USD)</Label>
            <Input
              id="custom-amount"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              type="text"
              inputMode="decimal"
              className="text-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Donation Purpose</h2>
          <Select value={donationReason} onValueChange={setDonationReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a reason for your donation" />
            </SelectTrigger>
            <SelectContent>
              {donationReasons.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {donationType === "live"
              ? "Your donation will support our current live appeal for immediate assistance."
              : "Your donation will help us continue our mission and support those in need."}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                PayPal
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                Credit Card
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-6">
          {paymentMethod === "paypal" ? (
            <PayPalDonation
              paypalScriptOptions={paypalScriptOptions}
              customAmount={customAmount}
              selectedAmount={selectedAmount}
              donationReason={donationReason}
              donationType={donationType}
              setError={setError}
              setSuccess={setSuccess}
              setCustomAmount={setCustomAmount}
              setSelectedAmount={setSelectedAmount}
            />
          ) : (
            <Button className="w-full h-12 text-base" size="lg">
              Proceed to Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

