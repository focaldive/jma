"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupees" },
];

export function DonorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    isAnonymous: false,
    amount: "",
    currency: "USD",
    category: "General",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    region: "",
    acceptedTerms: false,
    wantsUpdates: true,
  });

  const selectedCurrency =
    currencies.find((c) => c.code === formData.currency) || currencies[0];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, amount: value });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid donation amount");
      return;
    }
    if (!formData.acceptedTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    if (!formData.isAnonymous && !formData.email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: formData.amount,
          currency: formData.currency,
          category: formData.category,
          firstName: formData.isAnonymous ? null : formData.firstName,
          lastName: formData.isAnonymous ? null : formData.lastName,
          email: formData.isAnonymous ? null : formData.email,
          phone: formData.isAnonymous ? null : formData.phone,
          address: formData.isAnonymous ? null : formData.address,
          country: formData.isAnonymous ? null : formData.country,
          region: formData.isAnonymous ? null : formData.region,
          isAnonymous: formData.isAnonymous,
          acceptedTerms: formData.acceptedTerms,
          wantsUpdates: formData.wantsUpdates,
          status: "PENDING",
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to save donation");
      }

      setSuccess(true);
      // Reset form
      setFormData({
        isAnonymous: false,
        amount: "",
        currency: "USD",
        category: "General",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        region: "",
        acceptedTerms: false,
        wantsUpdates: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to save donation");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Thank you for your donation! Your information has been saved
              successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg capitalize">
              Donor Information
            </h2>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) =>
                  handleInputChange("isAnonymous", checked === true)
                }
              />
              <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                Donate anonymously
              </Label>
            </div>
          </div>

          {/* Amount and Currency Fields */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-sm text-gray-700">
              Donation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount Field */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {selectedCurrency.symbol}
                  </span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    type="text"
                    inputMode="decimal"
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Currency Field */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) => handleInputChange("currency", v)}
                >
                  <SelectTrigger id="currency">
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
            </div>

          

            {/* Summary */}
            {formData.amount && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Donation:</span>
                  <span className="font-bold text-lg text-primary">
                    {selectedCurrency.symbol}
                    {parseFloat(formData.amount || "0").toFixed(2)}{" "}
                    {formData.currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!formData.isAnonymous && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Contact Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(v) => handleInputChange("country", v)}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="lk">Sri Lanka</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region/State</Label>
                  <Input
                    id="region"
                    placeholder="Region/State"
                    value={formData.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={formData.acceptedTerms}
              onCheckedChange={(checked) =>
                handleInputChange("acceptedTerms", checked === true)
              }
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <Button variant="link" className="h-auto p-0">
                terms and conditions
              </Button>
              {" *"}
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="updates"
              checked={formData.wantsUpdates}
              onCheckedChange={(checked) =>
                handleInputChange("wantsUpdates", checked === true)
              }
            />
            <Label htmlFor="updates" className="text-sm">
              Keep me updated about how my donation is making an impact
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Submit Donation"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
