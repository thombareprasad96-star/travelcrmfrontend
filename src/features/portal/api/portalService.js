











// src/features/portal/api/portalService.js
//
// All Traveler Portal API calls, mapped 1:1 to the backend /api/portal/**
// contract. Every JSON endpoint returns the ApiResponse envelope
// { message, data }, so we unwrap `.data.data`.

import portalClient, {
  TRAVELER_TOKEN_KEY,
  TRAVELER_NAME_KEY,
} from "./portalClient";

const unwrap = (res) => res?.data?.data ?? null;

export const portalService = {
  // ── Auth ─────────────────────────────────────────────────────────────
  requestOtp(identifier) {
    return portalClient.post("/portal/auth/request-otp", { identifier });
  },

  async verifyOtp(identifier, otp) {
    const res = await portalClient.post("/portal/auth/verify-otp", { identifier, otp });
    const login = unwrap(res); // { token, expiresInMs, customerPublicId, name }
    if (login?.token) {
      localStorage.setItem(TRAVELER_TOKEN_KEY, login.token);
      localStorage.setItem(TRAVELER_NAME_KEY, login.name || "Traveler");
    }
    return login;
  },

  logout() {
    localStorage.removeItem(TRAVELER_TOKEN_KEY);
    localStorage.removeItem(TRAVELER_NAME_KEY);
  },

  // ── Bookings ─────────────────────────────────────────────────────────
  async myBookings() {
    return unwrap(await portalClient.get("/portal/bookings")) ?? [];
  },
  async booking(publicId) {
    return unwrap(await portalClient.get(`/portal/bookings/${publicId}`));
  },
  async bookingPayment(publicId) {
    return unwrap(await portalClient.get(`/portal/bookings/${publicId}/payment`));
  },
  async itinerary(publicId) {
    return unwrap(await portalClient.get(`/portal/bookings/${publicId}/itinerary`));
  },

  // ── Booking documents (invoice / cancellation note / refund voucher) ─────
  // The list contains only documents that actually exist; each carries a `path`
  // suffix used to fetch the PDF. Every PDF is customer-safe (no vendor cost).
  async bookingDocuments(publicId) {
    return unwrap(await portalClient.get(`/portal/bookings/${publicId}/documents`)) ?? [];
  },
  async openBookingDoc(publicId, path) {
    const res = await portalClient.get(`/portal/bookings/${publicId}/${path}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },

  // ── Documents ────────────────────────────────────────────────────────
  async myDocuments() {
    return unwrap(await portalClient.get("/portal/documents")) ?? [];
  },
  async uploadDocument(file, type, expiryDate) {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    if (expiryDate) form.append("expiryDate", expiryDate);
    // Let the browser set the multipart boundary — override the JSON default.
    return unwrap(
      await portalClient.post("/portal/documents", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },
  async downloadDocument(publicId, fileName) {
    const res = await portalClient.get(`/portal/documents/${publicId}/file`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "document";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  deleteDocument(publicId) {
    return portalClient.delete(`/portal/documents/${publicId}`);
  },

  // ── Payments ─────────────────────────────────────────────────────────
  async payBooking(publicId, amount) {
    const body = amount != null ? { amount } : {};
    return unwrap(
      await portalClient.post(`/portal/payments/bookings/${publicId}/intent`, body)
    );
  },

  // ── "Coming Soon" feature interest ───────────────────────────────────
  async featureInterest() {
    const data = unwrap(await portalClient.get("/portal/features/interest"));
    return data?.registeredKeys ?? [];
  },
  async notifyFeature(featureKey) {
    return unwrap(await portalClient.post(`/portal/features/${featureKey}/notify`));
  },
};

export default portalService;