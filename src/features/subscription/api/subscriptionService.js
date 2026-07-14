// src/features/subscription/api/subscriptionService.js
// ─────────────────────────────────────────────────────────────
// Subscription & Billing — API service (tenant self-serve realm)
// Page: SubscriptionInfo.jsx   ·   Route: /Subscription
//
// Backed by the real Spring Boot endpoints:
//   GET  /api/company/subscription           → SubscriptionDTO (plan snapshot + limits + dunning state)
//   GET  /api/company/subscription/plans     → PlanResponse[]   (active plans the tenant may switch to)
//   GET  /api/company/subscription/invoices  → BillingRecordResponse[]
//   POST /api/company/subscription/change     { plan }          → MyPlanChangeResponse (proration surfaced)
//   POST /api/company/billing/{id}/pay-intent → PaymentOrderResponse (Razorpay Checkout order)
//
// The shared axios client (`@shared/api/http`) attaches the JWT from localStorage "token", wraps every
// response in the ApiResponse envelope, and routes failures through the shared error policy. Every call
// here returns the UNWRAPPED payload (envelope `data`) so pages never see `res.data.data`.
// ─────────────────────────────────────────────────────────────

import API from "@shared/api/http";

/** ApiResponse<T> envelope → T. */
const unwrap = (res) => res?.data?.data;

const subscriptionService = {
  // Current subscription snapshot: plan, price, dates, status, daysLeft, pastDueSince, features, limits.
  getSubscription: () => API.get("/company/subscription").then(unwrap),

  // Active plans available to switch to (upgrade or downgrade).
  getPlans: () => API.get("/company/subscription/plans").then(unwrap),

  // The tenant's own invoice history (newest first).
  getInvoices: () => API.get("/company/subscription/invoices").then(unwrap),

  // Downgrade / lateral change (applied immediately). `planCode` is the plan enum code (STARTER/PRO/…).
  // UPGRADES do NOT use this — they go through the approval flow below.
  changePlan: (planCode) =>
    API.post("/company/subscription/change", { plan: planCode }).then(unwrap),

  // Create a gateway order for an UNPAID invoice, ready to hand to the browser Razorpay Checkout widget.
  createPayIntent: (invoicePublicId) =>
    API.post(`/company/billing/${invoicePublicId}/pay-intent`).then(unwrap),

  // ── Plan-upgrade requests (SuperAdmin-approved) ────────────────────────────
  // An upgrade is a REQUEST: it stays PENDING until a SuperAdmin approves. Payment happens up-front —
  // ONLINE (pay the returned invoice via Razorpay) or OFFLINE (supply a reference; verified at approval).

  // The tenant's own upgrade requests (newest first).
  getUpgradeRequests: () => API.get("/company/subscription/upgrade-requests").then(unwrap),

  // Submit a request. body: { requestedPlan, paymentMode: 'ONLINE'|'OFFLINE',
  //   offlineMode?, offlineReference?, offlineNotes? }. Returns the request incl. `invoicePublicId`.
  createUpgradeRequest: (body) =>
    API.post("/company/subscription/upgrade-requests", body).then(unwrap),

  // Attach an optional payment proof (offline) — multipart.
  uploadUpgradeProof: (publicId, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return API.post(`/company/subscription/upgrade-requests/${publicId}/proof`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(unwrap);
  },

  // Withdraw a still-pending request.
  cancelUpgradeRequest: (publicId) =>
    API.post(`/company/subscription/upgrade-requests/${publicId}/cancel`).then(unwrap),
};

export default subscriptionService;