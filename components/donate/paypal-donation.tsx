import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";

interface PayPalDonationProps {
  paypalScriptOptions: ReactPayPalScriptOptions;
  selectedAmount: number;
  customAmount: string;
  setError: (error: string) => void;
  setSuccess: (success: boolean) => void;
  setCustomAmount: (amount: string) => void;
  setSelectedAmount: (amount: number) => void;
}

export function PayPalDonation({
  paypalScriptOptions,
  customAmount,
  selectedAmount,
  setError,
  setSuccess,
  setCustomAmount,
  setSelectedAmount,
}: PayPalDonationProps) {
  const createOrder: PayPalButtonsComponentProps["createOrder"] = (
    _,
    actions
  ) => {
    const finalAmount = getFinalAmount();

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

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (
    data,
    actions
  ) => {
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
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      return parseFloat(customAmount);
    }
    return selectedAmount;
  };

  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <PayPalButtons
        forceReRender={[selectedAmount, customAmount]}
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
    </PayPalScriptProvider>
  );
}
