# PayPal Configuration Example

# Copy this file to .env.local and fill in your actual credentials

# Get your credentials from: https://developer.paypal.com/dashboard/

## Sandbox Client ID (for development/testing)

To get this:

1. Go to https://developer.paypal.com/dashboard/
2. Log in with your PayPal account
3. Click "Apps & Credentials"
4. Under "Sandbox" tab, click "Create App"
5. Copy the Client ID and add to .env.local:

```
NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id_here
```

## Live Client ID (for production)

Same steps as above, but use the "Live" tab instead of "Sandbox"

```
NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID=your_live_client_id_here
```

## Important Notes

- The `.env.local` file is gitignored and won't be committed
- Never commit real credentials to version control
- Restart your dev server after changing environment variables
