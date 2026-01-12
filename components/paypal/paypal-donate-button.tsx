"use client";

import { useEffect, useRef } from "react";

interface PayPalDonateButtonProps {
  hostedButtonId: string;
  onComplete?: (details: any) => void;
  sandbox?: boolean;
  className?: string;
}

/**
 * PayPal Donate Button Component
 *
 * This component uses PayPal's hosted button HTML embed method.
 * The modern PayPal JavaScript SDK doesn't support hosted button IDs directly.
 *
 * @param hostedButtonId - Your PayPal hosted button ID from PayPal dashboard
 * @param onComplete - Callback function (Note: requires PayPal webhooks for server-side tracking)
 * @param sandbox - Use sandbox environment for testing (default: true)
 * @param className - Additional CSS classes for the container div
 */
export function PayPalDonateButton({
  hostedButtonId,
  onComplete,
  sandbox = true,
  className = "",
}: PayPalDonateButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // PayPal hosted buttons use a form-based approach
    // The hosted button ID is embedded in the form action
    const paypalUrl = sandbox
      ? "https://www.sandbox.paypal.com/donate"
      : "https://www.paypal.com/donate";

    // Create the PayPal donate form
    const form = document.createElement("form");
    form.action = paypalUrl;
    form.method = "post";
    form.target = "_blank"; // Open in new tab

    // Add the hosted button ID as a hidden input
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "hosted_button_id";
    input.value = hostedButtonId;

    // Add the donate button image
    const button = document.createElement("input");
    button.type = "image";
    button.src = "https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif";
    button.name = "submit";
    button.title = "PayPal - The safer, easier way to pay online!";
    button.alt = "Donate with PayPal button";
    button.style.border = "0";

    form.appendChild(input);
    form.appendChild(button);

    // Clear container and add form
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(form);

    // Note: onComplete callback requires server-side webhooks
    if (onComplete) {
      console.warn(
        "onComplete callback requires PayPal webhooks for server-side donation tracking. " +
          "The callback cannot be triggered client-side with hosted buttons."
      );
    }
  }, [hostedButtonId, sandbox, onComplete]);

  return (
    <div className={`paypal-donate-container ${className}`}>
      <div ref={containerRef} id="paypal-donate-button-container"></div>
    </div>
  );
}
