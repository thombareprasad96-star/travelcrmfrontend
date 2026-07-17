// src/features/settings/api/leadSourceService.js
//
// Lead-source integrations: the channels this deployment can ingest from, and the tenant's
// connections to them.
//
// Two things worth knowing before you touch this:
//
//  1. A connection's ingest URL is returned ONLY by create() and rotateToken(). It embeds a token of
//     which the server stores only a SHA-256 hash, so it genuinely cannot be shown again — there is
//     no endpoint that will hand it back. The UI must make the user copy it before they navigate
//     away, and the fix for a lost one is rotate, not recover.
//
//  2. Credentials are WRITE-ONLY. They are never on a response, not even masked. `credentialKeysSet`
//     tells you WHICH secrets are configured so a form can render "configured" without the value
//     ever leaving the server.

import API from "@shared/api/http";

const BASE = "/lead-sources";

export const leadSourceService = {
  /** Every channel this deployment can serve + a summary of the tenant's connections to each. */
  async getChannels() {
    const { data } = await API.get(`${BASE}/channels`);
    return data.data ?? [];
  },

  /** @param channel optional channel code or slug to filter by */
  async getConnections(channel) {
    const { data } = await API.get(`${BASE}/connections`, {
      params: channel ? { channel } : undefined,
    });
    return data.data ?? [];
  },

  async getConnection(publicId) {
    const { data } = await API.get(`${BASE}/connections/${publicId}`);
    return data.data;
  },

  /** Returns the connection INCLUDING `ingestUrl` — the only time the token is ever visible. */
  async createConnection(payload) {
    const { data } = await API.post(`${BASE}/connections`, payload);
    return data.data;
  },

  /**
   * Credentials MERGE: a key you omit keeps its stored value, so an edit form that never received
   * the secrets cannot blank them by saving. Send an empty string to clear one deliberately.
   */
  async updateConnection(publicId, payload) {
    const { data } = await API.put(`${BASE}/connections/${publicId}`, payload);
    return data.data;
  },

  /** Issues a NEW url and keeps the old one working for an overlap window (default 72h). */
  async rotateToken(publicId) {
    const { data } = await API.post(`${BASE}/connections/${publicId}/rotate-token`);
    return data.data;
  },

  /** Kills the old url immediately — for one believed leaked. */
  async revokePreviousToken(publicId) {
    const { data } = await API.post(`${BASE}/connections/${publicId}/revoke-previous-token`);
    return data.data;
  },

  async deleteConnection(publicId) {
    await API.delete(`${BASE}/connections/${publicId}`);
  },

  /**
   * What actually arrived on this connection, newest first.
   *
   * Rows carry NO payload body — the server projects around a 64KB column, so a list of 20 does not
   * drag a megabyte across the wire. Use getEvent() to read one delivery's body.
   *
   * @returns {Promise<{items: any[], pagination: any}>}
   */
  async getEvents(publicId, { page = 0, size = 20 } = {}) {
    const { data } = await API.get(`${BASE}/connections/${publicId}/events`, {
      params: { page, size },
    });
    return { items: data.data ?? [], pagination: data.pagination };
  },

  /**
   * One delivery IN FULL, including `rawPayload` — exactly what the provider sent us.
   *
   * This is the whole point of the deliveries log, and it is not a debugging nicety: several channels
   * (JustDial above all) have no published contract, so our field names are informed guesses. When a
   * delivery lands as IGNORED, this body is the evidence that says which names are real. Secrets are
   * already redacted server-side before the payload is ever stored.
   */
  async getEvent(publicId, eventPublicId) {
    const { data } = await API.get(`${BASE}/connections/${publicId}/events/${eventPublicId}`);
    return data.data;
  },
};

export default leadSourceService;
