// src/features/subscription/api/razorpayCheckout.js
// ─────────────────────────────────────────────────────────────
// Browser Razorpay Checkout helper.
//
// The backend `pay-intent` call returns everything Checkout needs (public key id, order id, amount in
// the currency's minor unit, prefill). We lazily inject Razorpay's checkout.js only when the user
// actually pays — no cost on page load — then open the widget for that order.
//
// Settlement is asynchronous: the `handler` callback fires when the browser flow succeeds, but the
// invoice is only marked PAID once Razorpay's `payment.captured` webhook reaches the server. So callers
// should treat `onSuccess` as "payment submitted — confirming" and re-fetch invoices shortly after.
// ─────────────────────────────────────────────────────────────

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise = null;

/** Inject checkout.js once; resolve when `window.Razorpay` is available. */
function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load the payment widget.")));
      if (window.Razorpay) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null; // allow a retry on the next attempt
      reject(new Error("Failed to load the payment widget. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return loadPromise;
}

/**
 * Open Razorpay Checkout for a pay-intent order.
 *
 * @param {object}   order        PaymentOrderResponse from `subscriptionService.createPayIntent`
 * @param {object}   handlers     { onSuccess(response), onDismiss() }
 */
export async function openRazorpayCheckout(order, { onSuccess, onDismiss } = {}) {
  if (!order || order.provider !== "razorpay") {
    throw new Error("Online payment is not available right now.");
  }
  await loadRazorpay();

  const options = {
    key: order.gatewayKeyId,
    amount: order.amountMinor,
    currency: order.currency,
    name: order.tenantName || "TravelCRM",
    description: `Invoice ${order.invoiceNumber}`,
    order_id: order.orderId,
    prefill: {
      email: order.prefillEmail || undefined,
      contact: order.prefillContact || undefined,
    },
    notes: { invoicePublicId: order.invoicePublicId },
    theme: { color: "#2563eb" },
    handler: (response) => onSuccess?.(response),
    modal: { ondismiss: () => onDismiss?.() },
  };

  const rzp = new window.Razorpay(options);
  // Surface a gateway-reported failure (declined card etc.) to the caller as a dismiss.
  rzp.on("payment.failed", () => onDismiss?.());
  rzp.open();
}

export default openRazorpayCheckout;