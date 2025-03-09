import { PayPalButtons, type PayPalButtonsComponentProps } from "@paypal/react-paypal-js";

interface PayPalDonationProps {
  selectedAmount: number;
  customAmount: string;
  setError: (error: string) => void;
  setSuccess: (success: boolean) => void;
  setCustomAmount: (amount: string) => void;
  setSelectedAmount: (amount: number) => void;
}

export function PayPalDonation({
  customAmount,
  selectedAmount,
  setError,
  setSuccess,
  setCustomAmount,
  setSelectedAmount,
}: PayPalDonationProps) {
  const createOrder: PayPalButtonsComponentProps["createOrder"] = (_, actions) => {
    const finalAmount = getFinalAmount();

    if (finalAmount <= 0) {
      setError("Please enter a valid donation amount");
      return Promise.reject(new Error("Invalid amount"));
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: finalAmount.toFixed(2),
            currency_code: "USD",
          },
          description: "Donation",
        },
      ],
      intent: "CAPTURE",
    });
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (_, actions) => {
    try {
      if (!actions.order) {
        throw new Error("Order not found");
      }
      const details = await actions.order.capture();
      console.log("Payment details:", details);

      setSuccess(true);
      // Reset form
      setCustomAmount("");
      setSelectedAmount(20);
    } catch (err) {
      setError("Failed to process payment");
      console.error("Payment capture error:", err);
    }
  };

  const getFinalAmount = () => {
    return customAmount && !isNaN(Number.parseFloat(customAmount))
      ? Number.parseFloat(customAmount)
      : selectedAmount;
  };

  return (
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
  );
}
