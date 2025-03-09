import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PayPalDonation } from "./paypal-donation";
import { validateClientEnv } from "@/utils/env-validation";
import { PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

const donationAmounts = [10, 20, 30, 40];

export function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number>(40);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [envError, setEnvError] = useState<string>("");
  const [paypalScriptOptions, setPaypalScriptOptions] = useState<ReactPayPalScriptOptions | null>(null);

  useEffect(() => {
    try {
      const env = validateClientEnv();
      if (!env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        throw new Error("PayPal Client ID is missing in environment variables.");
      }

      setPaypalScriptOptions({
        clientId: env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.trim(),
        currency: "USD",
        components: "buttons", // ✅ FIXED: Ensure "buttons" is included
      });
    } catch (error) {
      setEnvError(error instanceof Error ? error.message : "An unknown error occurred while configuring PayPal.");
      console.error("Environment validation error:", error);
    }
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
    }
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
            <div className="grid grid-cols-2 gap-3">
              {donationAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount(""); // Reset custom amount
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

          <div className="mt-6">
            <PayPalDonation
              customAmount={customAmount}
              selectedAmount={selectedAmount}
              setError={setError}
              setSuccess={setSuccess}
              setCustomAmount={setCustomAmount}
              setSelectedAmount={setSelectedAmount}
            />
          </div>
        </CardContent>
      </Card>
    </PayPalScriptProvider>
  );
}
