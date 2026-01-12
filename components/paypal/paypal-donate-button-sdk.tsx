"use client";

import { useEffect, useRef } from "react";

interface PayPalDonateButtonProps {
  hostedButtonId: string;
  onComplete?: (details: any) => void;
  sandbox?: boolean;
  className?: string;
  amount?: number; // Donation amount
  donorName?: string;
  donorEmail?: string;
}

/**
 * PayPal Donate Button Component - Modern SDK Approach
 *
 * Uses PayPal's JavaScript SDK with the Buttons component.
 * Note: This creates a custom donation flow. If you have a hosted button ID
 * from PayPal's dashboard, you may want to use the HTML embed method instead.
 *
 * @param hostedButtonId - Your PayPal hosted button ID (used as reference)
 * @param onComplete - Callback function triggered after successful donation
 * @param sandbox - Use sandbox environment for testing (default: true)
 * @param className - Additional CSS classes for the container div
 */
export function PayPalDonateButton({
  hostedButtonId,
  onComplete,
  sandbox = true,
  className = "",
  amount = 10,
  donorName = "",
  donorEmail = "",
}: PayPalDonateButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate script loading
    if (scriptLoadedRef.current) return;

    // Determine the correct client ID based on environment
    const clientId = sandbox
      ? process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || "test"
      : process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
        "YOUR_LIVE_CLIENT_ID";

    // Warn if using 'test' client ID
    if (clientId === "test") {
      console.warn(
        "⚠️ PayPal: Using 'test' client ID. This has limitations:\n" +
          "- Opens in NEW TAB instead of inline popup\n" +
          "- Limited functionality\n" +
          "To fix: Get a real sandbox client ID from https://developer.paypal.com/dashboard/\n" +
          "Add to .env.local: NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id"
      );
    }

    // Check if PayPal script is already loaded
    if (window.paypal) {
      renderButton();
      return;
    }

    // Load PayPal SDK script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&intent=capture`;
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      renderButton();
    };
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [hostedButtonId, sandbox]);

  const renderButton = () => {
    if (!window.paypal || !containerRef.current) return;

    // Store PayPal instance for type safety
    const paypal = window.paypal;
    const container = containerRef.current;

    // Ensure Buttons component is available
    if (!paypal.Buttons) {
      console.error("PayPal Buttons component is not available");
      return;
    }

    // Clear any existing buttons
    container.innerHTML = "";

    // Render the PayPal Donate Button
    paypal
      .Buttons({
        style: {
          label: "donate",
          color: "gold",
          shape: "rect",
          height: 45,
        },
        // Create the donation order
        createOrder: (data, actions) => {
          // Use PayPal SDK's actions.order.create for inline popup
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
                description: `Donation from ${donorName || "Anonymous"}`,
              },
            ],
            application_context: {
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              brand_name: "JMA Donation",
              return_url: window.location.href,
              cancel_url: window.location.href,
            },
          });
        },
        // Handle successful donation
        onApprove: (data, actions) => {
          console.log("Donation approved:", data);

          // Capture the order using PayPal SDK
          if (!actions.order) {
            console.error("Order actions not available");
            return Promise.resolve();
          }

          return actions.order.capture().then((details) => {
            console.log("Payment captured:", details);

            if (onComplete) {
              onComplete(details);
            }
          });
        },
        onError: (err) => {
          console.error("PayPal error:", err);
        },
        onCancel: (data) => {
          console.log("Donation cancelled:", data);
        },
      })
      .render(container)
      .then(() => {
        console.log("PayPal donate button rendered successfully");
      })
      .catch((error: Error) => {
        console.error("Error rendering PayPal donate button:", error);
      });
  };

  return (
    <div className={`paypal-donate-container ${className}`}>
      <div ref={containerRef} id="paypal-donate-button-container"></div>
    </div>
  );
}
