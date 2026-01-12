/**
 * PayPal SDK Type Definitions
 * Based on PayPal JavaScript SDK v5+
 */

interface PayPalButtonsComponentOptions {
  /**
   * Called when the button is clicked to set up the transaction
   */
  createOrder?: (data: any, actions: any) => Promise<string>;

  /**
   * Called when the buyer approves the payment
   */
  onApprove?: (data: any, actions: any) => Promise<void>;

  /**
   * Called when an error occurs
   */
  onError?: (err: any) => void;

  /**
   * Called when the buyer cancels the payment
   */
  onCancel?: (data: any) => void;

  /**
   * Process payment immediately in popup (true) or redirect (false)
   */
  commit?: boolean;

  /**
   * Button style customization
   */
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "gold" | "blue" | "silver" | "white" | "black";
    shape?: "rect" | "pill";
    label?: "paypal" | "checkout" | "buynow" | "pay" | "donate";
    height?: number;
  };
}

interface PayPalButtonsComponent {
  render(container: HTMLElement | string): Promise<void>;
  close(): void;
}

interface PayPalNamespace {
  /**
   * Creates a PayPal Buttons component
   */
  Buttons(options?: PayPalButtonsComponentOptions): PayPalButtonsComponent;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

export {};
