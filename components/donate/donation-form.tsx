import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { validateClientEnv } from "@/utils/env-validation";

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
            });
        } catch (error) {
            if (error instanceof Error) {
                setEnvError(error.message);
            } else {
                setEnvError("An unknown error occurred while configuring PayPal.");
            }
            console.error("Environment validation error:", error);
        }
    }, []);

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setCustomAmount(value);
        }
    };

    const getFinalAmount = () => {
        if (customAmount && !isNaN(parseFloat(customAmount))) {
            return parseFloat(customAmount);
        }
        return selectedAmount;
    };

    const createOrder = (data: any, actions: any) => {
        const finalAmount = getFinalAmount();
        console.log(`finalAmount => `, finalAmount);
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: finalAmount.toFixed(2), // Use finalAmount here
                        currency_code: "USD",
                    },
                    description: "Donation",
                },
            ],
        });
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            const details = await actions.order.capture();
            console.log(`data => `, data);
            console.log("Transaction completed:", details);
            setSuccess(true);
            // Reset form
            setCustomAmount("");
            setSelectedAmount(20);
        } catch (err) {
            setError("Failed to process payment");
            console.error("Payment capture error:", err);
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
                                Please check your environment variables and ensure the NEXT_PUBLIC_PAYPAL_CLIENT_ID is set correctly.
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
                                        setCustomAmount(""); // Clear custom amount when selecting a preset amount
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
                        <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={(err) => {
                                setError("Payment failed. Please try again.");
                                console.error("PayPal error:", err);
                            }}
                            style={{
                                layout: "vertical",
                                color: "blue",
                                shape: "rect",
                                label: "donate",
                            }}
                            disabled={getFinalAmount() <= 0}
                        />
                    </div>
                </CardContent>
            </Card>
        </PayPalScriptProvider>
    );
}

