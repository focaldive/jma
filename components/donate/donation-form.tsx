import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PayPalDonation } from "./paypal-donation";
import { validateClientEnv } from "@/utils/env-validation";
import { PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const donationAmounts = [10, 20, 30, 40];
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "LKR", symbol: "LKR", name: "Srilankan Rupees" },
];

interface DonationFormProps {
  donationType: string;
}

export const DonationForm: React.FC<DonationFormProps> = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(40);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending"); // pending, processing, completed, failed
  const [envError, setEnvError] = useState<string>("");
  const [paypalScriptOptions, setPaypalScriptOptions] = useState<ReactPayPalScriptOptions | null>(null);

  const selectedCurrency = currencies.find((c) => c.code === currency) || currencies[0];

  useEffect(() => {
    try {
      const env = validateClientEnv();
      if (!env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        throw new Error("PayPal Client ID is missing in environment variables.");
      }

      setPaypalScriptOptions({
        clientId: env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.trim(),
        currency: currency,
        components: "buttons",
      });
    } catch (error) {
      setEnvError(error instanceof Error ? error.message : "An unknown error occurred while configuring PayPal.");
      console.error("Environment validation error:", error);
    }
  }, [currency]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const getFinalAmount = () => {
    return customAmount && !isNaN(Number.parseFloat(customAmount))
      ? Number.parseFloat(customAmount)
      : selectedAmount;
  };

  if (envError) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {envError}
              <p className="mt-2">
                Please check your environment variables and ensure the
                NEXT_PUBLIC_PAYPAL_CLIENT_ID is set correctly.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!paypalScriptOptions) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>Loading payment options...</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <Card>
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
            
            {/* Currency Selector */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-2 gap-3">
              {donationAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className="h-12"
                >
                  {selectedCurrency.symbol}{amount.toFixed(2)}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Other Amount ({currency})</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  id="custom-amount"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  type="text"
                  inputMode="decimal"
                  className="text-lg pl-8"
                />
              </div>
            </div>

            {/* Amount Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg">
                  {selectedCurrency.symbol}{getFinalAmount().toFixed(2)} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium px-2 py-1 rounded text-sm ${
                  status === "completed" ? "bg-green-100 text-green-700" :
                  status === "processing" ? "bg-blue-100 text-blue-700" :
                  status === "failed" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <PayPalDonation
              customAmount={customAmount}
              selectedAmount={selectedAmount}
              currency={currency}
              setError={setError}
              setSuccess={setSuccess}
              setStatus={setStatus}
              setCustomAmount={setCustomAmount}
              setSelectedAmount={setSelectedAmount}
            />
          </div>
        </CardContent>
      </Card>
    </PayPalScriptProvider>
  );
}

