# PayPal Donate Button - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1. Get Your Button ID

- Log into PayPal Business Account
- Go to Tools → PayPal Buttons → Donate
- Create button and copy the **Hosted Button ID**

### 2. Add to Your Component

```tsx
import { PayPalDonateButton } from "@/components/paypal/paypal-donate-button";

<PayPalDonateButton
  hostedButtonId="YOUR_BUTTON_ID"
  sandbox={true}
  onComplete={(details) => {
    console.log("Donation:", details);
    alert("Thank you!");
  }}
/>;
```

### 3. Switch to Production

```tsx
// Change sandbox to false
<PayPalDonateButton hostedButtonId="YOUR_LIVE_BUTTON_ID" sandbox={false} />
```

---

## 📝 Component Props

| Prop             | Type     | Required | Default | Description             |
| ---------------- | -------- | -------- | ------- | ----------------------- |
| `hostedButtonId` | string   | ✅ Yes   | -       | Your PayPal button ID   |
| `sandbox`        | boolean  | ❌ No    | `true`  | Use sandbox for testing |
| `onComplete`     | function | ❌ No    | -       | Callback after donation |
| `className`      | string   | ❌ No    | `""`    | Custom CSS classes      |

---

## 🔄 Environment Switching

### Development (Sandbox)

```tsx
sandbox={true}
// Uses PayPal test environment
// No real money transactions
```

### Production (Live)

```tsx
sandbox={false}
// Uses PayPal live environment
// Real money transactions
```

### Using Environment Variables

```env
# .env.local
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_CLIENT_ID
```

```tsx
const isProduction =
  process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === "production";

<PayPalDonateButton
  hostedButtonId={isProduction ? "LIVE_ID" : "SANDBOX_ID"}
  sandbox={!isProduction}
/>;
```

---

## 💡 Common Use Cases

### Basic Button

```tsx
<PayPalDonateButton hostedButtonId="ABC123" />
```

### With Success Handler

```tsx
<PayPalDonateButton
  hostedButtonId="ABC123"
  onComplete={(details) => {
    // Save to database
    fetch("/api/donations", {
      method: "POST",
      body: JSON.stringify({
        id: details.id,
        amount: details.purchase_units[0].amount.value,
      }),
    });
  }}
/>
```

### With Custom Styling

```tsx
<PayPalDonateButton
  hostedButtonId="ABC123"
  className="my-8 max-w-md mx-auto shadow-lg"
/>
```

---

## 🎯 Integration Locations

### Hero Section

Replace or add alongside existing donate button

### Donation Page

Primary payment method

### Project Cards

Individual project donations

### Footer

Quick access donation

---

## ✅ Pre-Launch Checklist

- [ ] Test in sandbox environment
- [ ] Verify button renders correctly
- [ ] Test successful donation flow
- [ ] Check mobile responsiveness
- [ ] Update to live credentials
- [ ] Test live donation (small amount)
- [ ] Verify onComplete callback
- [ ] Check email notifications
- [ ] Test on multiple browsers
- [ ] Enable HTTPS in production

---

## 🐛 Troubleshooting

### Button Not Showing

```tsx
// Check browser console for errors
// Verify hostedButtonId is correct
// Ensure PayPal SDK loaded (check Network tab)
```

### Script Loading Issues

```tsx
// Disable ad blockers
// Check internet connection
// Verify client ID is valid
```

### Callback Not Firing

```tsx
// onComplete may not work with all hosted buttons
// Use PayPal webhooks as alternative
// Check PayPal Developer Dashboard for IPN settings
```

---

## 📚 Files Created

1. **Component**: `jma/components/paypal/paypal-donate-button.tsx`
2. **Documentation**: `jma/docs/paypal-donate-integration.md`
3. **Example**: `jma/docs/paypal-hero-integration-example.tsx`
4. **HTML Demo**: `jma/docs/paypal-standalone-example.html`
5. **Quick Reference**: `jma/docs/paypal-quick-reference.md` (this file)

---

## 🔗 Important Links

- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
- [Create Donate Button](https://www.paypal.com/donate/buttons)
- [PayPal Sandbox](https://www.sandbox.paypal.com/)
- [API Documentation](https://developer.paypal.com/docs/)

---

## 📞 Support

**PayPal Issues**: developer.paypal.com/support  
**Integration Help**: Check full documentation in `paypal-donate-integration.md`

---

**Version**: 1.0.0  
**Last Updated**: January 2026
