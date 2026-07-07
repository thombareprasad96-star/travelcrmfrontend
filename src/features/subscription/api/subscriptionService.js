// src/features/subscription/api/subscriptionService.js
// ─────────────────────────────────────────────────────────────
// Subscription Information Page — API Service
// Page: SubscriptionInfo.jsx
// Route: /Subscription
// Backend: Java Spring Boot REST API
// Database: PostgreSQL
// Covers:
//   - Get current plan details (plan name, price, dates, status)
//   - Get available modules list for the current plan
//   - Get usage stats (active users, days left, progress bars)
//   - Request plan renewal / upgrade (CTA buttons)
//   - Contact support request
// ─────────────────────────────────────────────────────────────

// Shared axios instance: baseURL ".../api", attaches the JWT from
// localStorage "token" (this service previously read "authToken" — a key
// nothing sets — so every call went out unauthenticated), handles 401.
import api from "@shared/api/http";


// ═════════════════════════════════════════════════════════════
// SUBSCRIPTION SERVICE
// Spring Boot Controller: /api/subscription
// PostgreSQL Tables: subscriptions, plans, plan_modules, tenants
// ═════════════════════════════════════════════════════════════
const subscriptionService = {

  // ── GET FULL PLAN INFO (all page data in one call) ─────────
  // GET /api/subscription/info
  // @GetMapping("/api/subscription/info")
  // public ResponseEntity<SubscriptionInfoDTO> getInfo()
  //
  // Primary endpoint — powers all sections of the page:
  //   1. Current Plan Details card (left panel)
  //   2. 3 mini stat pills (days left, active users, plan tier)
  //   3. Progress bars (days used %, users used %)
  //   4. Available Modules list (right panel)
  //   5. Plan Highlights card
  //
  // Response:
  // {
  //   plan: {
  //     planName:     "Dolphin Plan Monthly - Subscription",
  //     description:  "Dolphin Plan Monthly - Subscription",
  //     price:        1890.00,
  //     duration:     30,          // days
  //     maxUsers:     11,
  //     activeUsers:  4,
  //     startDate:    "29 May 2026",
  //     endDate:      "28 Jun 2026",
  //     daysLeft:     3,
  //     status:       "Active",    // "Active" | "Expired" | "Suspended" | "Trial"
  //     tier:         "Dolphin",   // "Dolphin" | "Shark" | "Whale" | etc.
  //     daysUsedPct:  90,          // (duration - daysLeft) / duration * 100
  //     usersUsedPct: 36           // activeUsers / maxUsers * 100
  //   },
  //   modules: [
  //     "Booking Management",
  //     "Customer Management",
  //     "Dashboard & Core",
  //     "Email Configuration",
  //     "Lead Management",
  //     "Master Data Management",
  //     "Quotation Management",
  //     "Reminders & Notifications",
  //     "Reports & Analytics",
  //     "User Management",
  //     "Vendor Management",
  //     "Weblink Sharing",
  //     "WhatsApp Integration"
  //   ],
  //   highlights: [
  //     { label:"Up to 11 team members"   },
  //     { label:"Unlimited quotations"    },
  //     { label:"Full CRM feature access" },
  //     { label:"Data security & backups" },
  //     { label:"Priority customer support" }
  //   ]
  // }
  getInfo: () => {
    return api.get("/subscription/info");
  },

  // ── GET PLAN DETAILS ONLY (for quick refresh) ──────────────
  // GET /api/subscription/plan
  // @GetMapping("/api/subscription/plan")
  // public ResponseEntity<PlanDTO> getPlan()
  //
  // Lighter call — only returns the plan fields (no modules)
  // Used for the header badge and mini stat pills refresh
  //
  // Response: same as info.plan object above
  getPlan: () => {
    return api.get("/subscription/plan");
  },

  // ── REQUEST RENEWAL ────────────────────────────────────────
  // POST /api/subscription/renew
  // @PostMapping("/api/subscription/renew")
  // public ResponseEntity<RenewalResponseDTO> requestRenewal(
  //     @RequestBody RenewalRequest request)
  //
  // Called when user clicks "Renew Plan" button
  //
  // Request body:
  // {
  //   planId:   "dolphin-monthly",   // current plan id to renew
  //   duration: "monthly"            // "monthly" | "annual"
  // }
  //
  // Backend logic:
  //   1. Validates tenant has an active/expiring subscription
  //   2. Creates a renewal_request record in DB
  //   3. Notifies the Super Admin via email
  //   4. Returns a payment link or confirmation message
  //
  // Response (200 OK):
  // {
  //   success:     true,
  //   message:     "Renewal request submitted. Our team will contact you shortly.",
  //   paymentLink: "https://razorpay.com/...",   // or null if manual process
  //   requestId:   "REN-20260625-001"
  // }
  //
  // Error responses:
  //   422 — { message: "Subscription is already active for 3 more days" }
  //   500 — { message: "Failed to process renewal request" }
  requestRenewal: (planId = "dolphin-monthly", duration = "monthly") => {
    return api.post("/subscription/renew", { planId, duration });
  },

  // ── REQUEST UPGRADE ────────────────────────────────────────
  // POST /api/subscription/upgrade
  // @PostMapping("/api/subscription/upgrade")
  // public ResponseEntity<UpgradeResponseDTO> requestUpgrade(
  //     @RequestBody UpgradeRequest request)
  //
  // Called when user clicks "Upgrade Plan" button in the bottom banner
  //
  // Request body:
  // {
  //   currentPlanId: "dolphin-monthly",
  //   targetPlanId:  "shark-annual",    // optional — blank = contact for options
  //   duration:      "annual"
  // }
  //
  // Response (200 OK):
  // {
  //   success:     true,
  //   message:     "Upgrade request submitted. Our sales team will contact you within 24 hours.",
  //   requestId:   "UPG-20260625-001",
  //   salesEmail:  "sales@tripotomize.com"
  // }
  requestUpgrade: (currentPlanId, targetPlanId = null, duration = "annual") => {
    return api.post("/subscription/upgrade", {
      currentPlanId,
      targetPlanId,
      duration,
    });
  },

  // ── CONTACT SUPPORT ────────────────────────────────────────
  // POST /api/subscription/support
  // @PostMapping("/api/subscription/support")
  // public ResponseEntity<SupportResponseDTO> contactSupport(
  //     @RequestBody SupportRequest request)
  //
  // Called when user clicks "Contact Support" or "Talk to Sales" button
  //
  // Request body:
  // {
  //   type:    "support",          // "support" | "sales" | "billing"
  //   message: "Need help with..."  // optional message
  // }
  //
  // Response (200 OK):
  // {
  //   success: true,
  //   message: "Our team will contact you shortly.",
  //   ticketId: "TKT-20260625-001"
  // }
  contactSupport: (type = "support", message = "") => {
    return api.post("/subscription/support", { type, message });
  },
};

export default subscriptionService;
// ─────────────────────────────────────────────────────────────