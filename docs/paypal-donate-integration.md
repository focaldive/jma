# PayPal Donate Button Integration Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Getting Your Hosted Button ID](#getting-your-hosted-button-id)
- [Component Usage](#component-usage)
- [Full Working Example](#full-working-example)
- [Code Explanation](#code-explanation)
- [Switching from Sandbox to Live](#switching-from-sandbox-to-live)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to integrate PayPal Donate buttons into your Next.js application using the PayPal Hosted Buttons SDK. The implementation is secure, modern, and follows React best practices.

**Key Features:**
- ✅ Sandbox and Live environment support
- ✅ TypeScript support with proper type definitions
- ✅ Callback handling for donation completion
- ✅ Clean, reusable component architecture
- ✅ Automatic script loading and cleanup
- ✅ Error handling and logging

---

## Getting Your Hosted Button ID

### Step 1: Create a PayPal Business Account
1. Go to [PayPal Business](https://www.paypal.com/business)
2. Sign up for a business account (or use existing)

### Step 2: Create a Donate Button
1. Log into your PayPal account
2. Navigate to: **Tools** → **PayPal Buttons** → **Donate**
3. Customize your button:
   - Choose button type (Donate)
   - Set currency (USD, EUR, etc.)
   - Add organization name
   - Configure donation amounts
4. Click **Create Button**
5. Copy the **Hosted Button ID** (looks like: `XXXXXXXXXX`)

### Step 3: Get Sandbox Credentials (for testing)
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to **Apps & Credentials**
3. Switch to **Sandbox** tab
4. Create a new app or use existing
5. Copy your **Client ID** for sandbox testing

---

## Component Usage

### Basic Usage

```tsx
import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button";

export function MyComponent() {
  return (
    <PayPalDonateButton
      hostedButtonId="YOUR_HOSTED_BUTTON_ID"
      sandbox={true}
    />
  );
}
```

### With Completion Callback

```tsx
import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button";

export function MyComponent() {
  const handleDonationComplete = (details: any) => {
    console.log("Donation successful!", details);
    
    // Send to your backend
    fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionId: details.id,
        amount: details.purchase_units[0].amount.value,
        currency: details.purchase_units[0].amount.currency_code,
        donorEmail: details.payer.email_address,
        timestamp: new Date().toISOString(),
      }),
    });
    
    // Show success message to user
    alert("Thank you for your donation!");
  };

  return (
    <PayPalDonateButton
      hostedButtonId="YOUR_HOSTED_BUTTON_ID"
      sandbox={true}
      onComplete={handleDonationComplete}
      className="my-4"
    />
  );
}
```

---

## Full Working Example

### Integration in Hero Section

```tsx
"use client";

import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button";
import { useState } from "react";

export function HeroSection() {
  const [donationComplete, setDonationComplete] = useState(false);

  const handleDonationComplete = (details: any) => {
    console.log("Donation details:", details);
    setDonationComplete(true);
    
    // Optional: Send to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "donation", {
        transaction_id: details.id,
        value: details.purchase_units[0].amount.value,
        currency: details.purchase_units[0].amount.currency_code,
      });
    }
    
    // Optional: Show thank you message
    setTimeout(() => {
      alert("Thank you for your generous donation! 🙏");
    }, 500);
  };

  return (
    <section className="hero-section">
      <div className="donation-container">
        <h2 className="text-2xl font-bold mb-4">Support Our Mission</h2>
        <p className="text-gray-600 mb-6">
          Your donation helps us make a difference in communities worldwide.
        </p>
        
        {/* PayPal Donate Button */}
        <div className="paypal-button-wrapper">
          <PayPalDonateButton
            hostedButtonId="YOUR_HOSTED_BUTTON_ID"
            sandbox={true} // Set to false for production
            onComplete={handleDonationComplete}
            className="max-w-md mx-auto"
          />
        </div>
        
        {donationComplete && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center font-medium">
              ✓ Donation received! Thank you for your support!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
```

### Standalone HTML/JS Example (No React)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PayPal Donate Button</title>
  <style>
    .donate-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background: white;
    }
    
    .donate-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
      text-align: center;
      color: #333;
    }
    
    .donate-description {
      color: #666;
      margin-bottom: 24px;
      text-align: center;
      line-height: 1.6;
    }
    
    #paypal-donate-button-container {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="donate-container">
    <h2 class="donate-title">Support Our Cause</h2>
    <p class="donate-description">
      Your donation helps us continue our mission to make a positive impact.
    </p>
    
    <!-- PayPal Button Container -->
    <div id="paypal-donate-button-container"></div>
  </div>

  <!-- PayPal SDK Script -->
  <script src="https://www.paypal.com/sdk/js?client-id=test&components=hosted-buttons&disable-funding=credit,card"></script>
  
  <script>
    // Render PayPal Donate Button
    paypal.HostedButtons({
      hostedButtonId: "YOUR_HOSTED_BUTTON_ID" // Replace with your button ID
    }).render("#paypal-donate-button-container")
      .then(() => {
        console.log("PayPal button rendered successfully");
      })
      .catch((error) => {
        console.error("Error rendering PayPal button:", error);
      });
    
    // Optional: Handle donation completion
    // Note: This may not work with all hosted buttons
    if (paypal.Donation) {
      paypal.Donation({
        onComplete: function(details) {
          console.log("Donation completed:", details);
          alert("Thank you for your donation!");
          
          // Send to your backend
          fetch("/api/donations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: details.id,
              timestamp: new Date().toISOString()
            })
          });
        }
      });
    }
  </script>
</body>
</html>
```

---

## Code Explanation

### 1. **Component Structure**

```tsx
export function PayPalDonateButton({
  hostedButtonId,    // Your PayPal button ID
  onComplete,        // Callback after donation
  sandbox = true,    // Environment flag
  className = "",    // Custom styling
}: PayPalDonateButtonProps)
```

**Purpose**: Creates a reusable, configurable PayPal donate button component.

### 2. **Script Loading**

```tsx
const script = document.createElement("script");
script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&disable-funding=credit,card`;
```

**Explanation**:
- Dynamically loads PayPal SDK
- `client-id`: Your PayPal app client ID
- `components=hosted-buttons`: Loads hosted button functionality
- `disable-funding=credit,card`: Hides credit card options (optional)

### 3. **Button Rendering**

```tsx
window.paypal.HostedButtons({
  hostedButtonId: hostedButtonId,
}).render(containerRef.current)
```

**Explanation**:
- Uses PayPal's HostedButtons API
- Renders button in specified container
- Handles all payment processing automatically

### 4. **Completion Handling**

```tsx
if (onComplete && window.paypal.Donation) {
  window.paypal.Donation({
    onComplete: (details) => {
      console.log("Donation completed:", details);
      onComplete(details);
    },
  });
}
```

**Explanation**:
- Listens for successful donations
- Executes callback with transaction details
- Allows custom post-donation logic

### 5. **Cleanup**

```tsx
return () => {
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};
```

**Explanation**:
- Removes script when component unmounts
- Prevents memory leaks
- Follows React best practices

---

## Switching from Sandbox to Live

### Method 1: Environment Variable (Recommended)

**Step 1**: Create `.env.local` file:

```env
# .env.local
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_CLIENT_ID
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
```

**Step 2**: Update component:

```tsx
const clientId = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === "production"
  ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  : "test";

const sandbox = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT !== "production";
```

**Step 3**: Use in component:

```tsx
<PayPalDonateButton
  hostedButtonId="YOUR_HOSTED_BUTTON_ID"
  sandbox={sandbox}
/>
```

### Method 2: Direct Props

**Development**:
```tsx
<PayPalDonateButton
  hostedButtonId="YOUR_SANDBOX_BUTTON_ID"
  sandbox={true}
/>
```

**Production**:
```tsx
<PayPalDonateButton
  hostedButtonId="YOUR_LIVE_BUTTON_ID"
  sandbox={false}
/>
```

### Method 3: Configuration File

**config/paypal.ts**:
```tsx
export const paypalConfig = {
  development: {
    clientId: "test",
    hostedButtonId: "SANDBOX_BUTTON_ID",
    sandbox: true,
  },
  production: {
    clientId: "YOUR_LIVE_CLIENT_ID",
    hostedButtonId: "LIVE_BUTTON_ID",
    sandbox: false,
  },
};

export const getPayPalConfig = () => {
  const env = process.env.NODE_ENV === "production" ? "production" : "development";
  return paypalConfig[env];
};
```

**Usage**:
```tsx
import { getPayPalConfig } from "@/config/paypal";

const config = getPayPalConfig();

<PayPalDonateButton
  hostedButtonId={config.hostedButtonId}
  sandbox={config.sandbox}
/>
```

---

## Best Practices

### 1. **Security**

✅ **DO:**
- Use environment variables for sensitive data
- Validate donations on your backend
- Use HTTPS in production
- Implement rate limiting on donation endpoints
- Log all transactions for audit trails

❌ **DON'T:**
- Hardcode client IDs in code
- Trust client-side data without verification
- Store sensitive data in localStorage
- Skip server-side validation

### 2. **User Experience**

✅ **DO:**
- Show loading states during payment
- Provide clear success/error messages
- Make buttons easily accessible
- Test on multiple devices
- Provide alternative payment methods

❌ **DON'T:**
- Block UI unnecessarily
- Use confusing button labels
- Hide important information
- Skip mobile testing

### 3. **Performance**

✅ **DO:**
- Load PayPal SDK asynchronously
- Clean up scripts on unmount
- Use React.memo for optimization
- Implement error boundaries
- Monitor script loading failures

❌ **DON'T:**
- Load SDK synchronously
- Create memory leaks
- Render multiple instances unnecessarily
- Ignore loading errors

### 4. **Accessibility**

✅ **DO:**
- Provide keyboard navigation
- Use semantic HTML
- Add ARIA labels
- Ensure color contrast
- Test with screen readers

```tsx
<div 
  role="region" 
  aria-label="Donation form"
  className="paypal-donate-container"
>
  <div ref={containerRef} id="paypal-donate-button-container"></div>
</div>
```

### 5. **Analytics & Tracking**

```tsx
const handleDonationComplete = (details: any) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag("event", "donation", {
      transaction_id: details.id,
      value: details.purchase_units[0].amount.value,
      currency: details.purchase_units[0].amount.currency_code,
      items: [{
        item_name: "Donation",
        item_category: "Fundraising",
      }],
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq("track", "Donate", {
      value: details.purchase_units[0].amount.value,
      currency: details.purchase_units[0].amount.currency_code,
    });
  }
  
  // Custom analytics
  fetch("/api/analytics/donation", {
    method: "POST",
    body: JSON.stringify({
      transactionId: details.id,
      amount: details.purchase_units[0].amount.value,
      timestamp: new Date().toISOString(),
    }),
  });
};
```

### 6. **Error Handling**

```tsx
const renderButton = () => {
  if (!window.paypal) {
    console.error("PayPal SDK not loaded");
    setError("Payment system unavailable. Please try again later.");
    return;
  }

  if (!containerRef.current) {
    console.error("Container ref not available");
    return;
  }

  window.paypal
    .HostedButtons({ hostedButtonId })
    .render(containerRef.current)
    .catch((error: Error) => {
      console.error("Error rendering PayPal button:", error);
      setError("Failed to load payment button. Please refresh the page.");
    });
};
```

### 7. **Testing Checklist**

- [ ] Test in sandbox environment
- [ ] Verify button renders correctly
- [ ] Test successful donation flow
- [ ] Test failed payment scenarios
- [ ] Verify onComplete callback fires
- [ ] Check mobile responsiveness
- [ ] Test with ad blockers enabled
- [ ] Verify HTTPS in production
- [ ] Test different browsers
- [ ] Check accessibility compliance

---

## Troubleshooting

### Issue 1: Button Not Rendering

**Symptoms**: Empty container, no button visible

**Solutions**:
```tsx
// Check if script loaded
useEffect(() => {
  const checkPayPal = setInterval(() => {
    if (window.paypal) {
      clearInterval(checkPayPal);
      renderButton();
    }
  }, 100);
  
  return () => clearInterval(checkPayPal);
}, []);
```

### Issue 2: Script Loading Errors

**Symptoms**: Console errors about PayPal SDK

**Solutions**:
- Check internet connection
- Verify client ID is correct
- Check for ad blockers
- Ensure HTTPS in production

### Issue 3: onComplete Not Firing

**Symptoms**: Callback never executes

**Solutions**:
- Verify PayPal.Donation API is available
- Check hosted button settings
- Use IPN (Instant Payment Notification) as backup
- Implement webhook handlers

### Issue 4: Duplicate Buttons

**Symptoms**: Multiple buttons render

**Solutions**:
```tsx
// Clear container before rendering
containerRef.current.innerHTML = "";

// Use ref to prevent duplicate renders
const hasRendered = useRef(false);
if (hasRendered.current) return;
hasRendered.current = true;
```

### Issue 5: Styling Issues

**Symptoms**: Button looks broken or misaligned

**Solutions**:
```css
/* Add container styles */
.paypal-donate-container {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Ensure iframe renders properly */
#paypal-donate-button-container iframe {
  max-width: 100%;
}
```

---

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Hosted Buttons Guide](https://developer.paypal.com/docs/checkout/standard/integrate/)
- [PayPal Sandbox Testing](https://developer.paypal.com/docs/api-basics/sandbox/)
- [PayPal Webhooks](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)

---

## Support

For issues or questions:
1. Check PayPal Developer Forums
2. Review PayPal API documentation
3. Contact PayPal Merchant Support
4. Check browser console for errors

---

**Last Updated**: January 2026  
**Version**: 1.0.0
