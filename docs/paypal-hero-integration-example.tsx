// Example: How to integrate PayPal Donate Button in Hero Section
// File: jma/components/home/hero-section.tsx

import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button";

// Add this inside your donation form section (around line 210-296)
// Replace the existing "Donate Now" button with:

{
  /* PayPal Donate Button */
}
<div className="space-y-3">
  <PayPalDonateButton
    hostedButtonId="YOUR_HOSTED_BUTTON_ID" // Replace with your actual button ID
    sandbox={true} // Set to false for production
    onComplete={(details) => {
      console.log("Donation completed:", details);

      // Optional: Send to your backend
      fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: details.id,
          amount: details.purchase_units?.[0]?.amount?.value,
          currency: details.purchase_units?.[0]?.amount?.currency_code,
          donorEmail: details.payer?.email_address,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);

      // Show success message
      alert("Thank you for your generous donation! 🙏");
    }}
    className="w-full"
  />

  <p className="text-xs text-gray-500 text-center">
    Secure payment powered by PayPal
  </p>
</div>;

// ALTERNATIVE: Keep your custom form and add PayPal as an additional option
// Add this after your existing "Donate Now" button:

{
  /* Existing Donate Button */
}
<button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm">
  Donate Now
</button>;

{
  /* Divider */
}
<div className="relative my-4">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300"></div>
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="bg-white px-2 text-gray-500">or donate with</span>
  </div>
</div>;

{
  /* PayPal Option */
}
<PayPalDonateButton
  hostedButtonId="YOUR_HOSTED_BUTTON_ID"
  sandbox={true}
  onComplete={(details) => {
    console.log("PayPal donation:", details);
    alert("Thank you for your donation via PayPal!");
  }}
  className="w-full"
/>;
