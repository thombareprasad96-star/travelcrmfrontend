// src/features/settings/pages/LeadSources.jsx
//
// Lead Sources: the channels this deployment can ingest leads from, and the tenant's connections to
// each.
//
// IA — two levels, keyed on the CONNECTION. A connection is not a config: two JustDial city accounts
// are two credential bags, two URLs and two switches. So the grid summarises a CHANNEL (N
// connections, worst status, total leads) and selecting one lists its connections individually.
//
// The presentation map lives HERE, in source, and the wire carries no styling. That is structural,
// not a preference: Tailwind scans source files for literal class strings, so a server-sent
// "bg-orange-100" is purged from the bundle at build time and renders unstyled.

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as FiArrowLeft, Plus as FiPlus, Copy as FiCopy, Check as FiCheck,
  RefreshCw as FiRefresh, Trash2 as FiTrash, X as FiX, Globe as FiGlobe,
  Link2 as FiLink, Phone as FiPhone, Megaphone as FiMegaphone, Store as FiStore,
  MessageCircle as FiMessage, TriangleAlert as FiWarn, Inbox as FiInbox, Loader as FiLoader,
  ScrollText as FiLog, ChevronRight as FiChevron,
} from "lucide-react";

import leadSourceService from "../api/leadSourceService";

/* ── Presentation map: channel code → icon + literal Tailwind classes ──────────
   Keys are LeadSourceChannel.name(). A channel missing from here still renders —
   it just falls back to the neutral style, rather than disappearing. */
const CHANNEL_UI = {
  WEBSITE_FORM:    { icon: FiGlobe,    ring: "ring-blue-200",    chip: "bg-blue-50 text-blue-700",       dot: "bg-blue-500" },
  WEBLINK_ENQUIRY: { icon: FiLink,     ring: "ring-sky-200",     chip: "bg-sky-50 text-sky-700",         dot: "bg-sky-500" },
  JUSTDIAL:        { icon: FiStore,    ring: "ring-amber-200",   chip: "bg-amber-50 text-amber-700",     dot: "bg-amber-500" },
  INDIAMART:       { icon: FiStore,    ring: "ring-orange-200",  chip: "bg-orange-50 text-orange-700",   dot: "bg-orange-500" },
  TRADEINDIA:      { icon: FiStore,    ring: "ring-rose-200",    chip: "bg-rose-50 text-rose-700",       dot: "bg-rose-500" },
  SULEKHA:         { icon: FiStore,    ring: "ring-red-200",     chip: "bg-red-50 text-red-700",         dot: "bg-red-500" },
  GOOGLE_ADS:      { icon: FiMegaphone,ring: "ring-emerald-200", chip: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  META_ADS:        { icon: FiMegaphone,ring: "ring-indigo-200",  chip: "bg-indigo-50 text-indigo-700",   dot: "bg-indigo-500" },
  INSTAGRAM_DM:    { icon: FiMessage,  ring: "ring-fuchsia-200", chip: "bg-fuchsia-50 text-fuchsia-700", dot: "bg-fuchsia-500" },
  FB_MESSENGER:    { icon: FiMessage,  ring: "ring-blue-200",    chip: "bg-blue-50 text-blue-700",       dot: "bg-blue-500" },
  WHATSAPP:        { icon: FiMessage,  ring: "ring-green-200",   chip: "bg-green-50 text-green-700",     dot: "bg-green-500" },
  IVR_CALL:        { icon: FiPhone,    ring: "ring-violet-200",  chip: "bg-violet-50 text-violet-700",   dot: "bg-violet-500" },
};
const FALLBACK_UI = { icon: FiInbox, ring: "ring-slate-200", chip: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
const uiFor = (code) => CHANNEL_UI[code] ?? FALLBACK_UI;

const STATUS_CHIP = {
  CONNECTED: "bg-green-50 text-green-700 border-green-200",
  DEGRADED:  "bg-amber-50 text-amber-700 border-amber-200",
  DISABLED:  "bg-slate-100 text-slate-600 border-slate-200",
};

const fmtDate = (iso) =>
  !iso ? "—" : new Date(iso).toLocaleString(undefined,
    { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ── Copy-to-clipboard button ─────────────────────────────────────────────── */
function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard is blocked on http:// origins other than localhost — the URL is selectable anyway
    }
  };
  return (
    <button type="button" onClick={copy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                 bg-white/90 border border-slate-200 text-slate-700 hover:bg-white transition-colors">
      {copied ? <FiCheck className="w-3.5 h-3.5 text-green-600"/> : <FiCopy className="w-3.5 h-3.5"/>}
      {copied ? "Copied" : label}
    </button>
  );
}

/* ── The one-time URL banner ──────────────────────────────────────────────────
   The single most important piece of UX on this page. The server stores only a hash of the token,
   so this URL is genuinely unrecoverable — "show it again later" is not an endpoint we chose not to
   build, it is information nobody has. */
function IngestUrlBanner({ url, onDismiss }) {
  if (!url) return null;
  return (
    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <FiWarn className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">
            Copy this URL now — it is shown only once
          </p>
          <p className="text-xs text-amber-800 mt-0.5">
            We store only a fingerprint of it, so we cannot show it again. If you lose it, use
            Rotate to issue a new one.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap rounded-lg bg-white
                             border border-amber-200 px-3 py-2 text-[12px] text-slate-800">
              {url}
            </code>
            <CopyButton value={url} label="Copy URL"/>
          </div>
        </div>
        <button onClick={onDismiss} className="text-amber-700 hover:text-amber-900 shrink-0">
          <FiX className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}

/* ── Add-connection drawer ────────────────────────────────────────────────── */
function AddConnectionDrawer({ channel, onClose, onCreated }) {
  const [label, setLabel] = useState("");
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!channel) return null;

  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const credentials = {};
      const config = {};
      channel.credentialFields.forEach((f) => { if (values[f.key]) credentials[f.key] = values[f.key]; });
      channel.configFields.forEach((f) => { if (values[f.key]) config[f.key] = values[f.key]; });
      const created = await leadSourceService.createConnection({
        channel: channel.code, label: label.trim(), credentials, config,
      });
      onCreated(created);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create this connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white shadow-xl overflow-y-auto p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Connect {channel.displayName}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <FiX className="w-5 h-5"/>
          </button>
        </div>

        {channel.setupHint && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">{channel.setupHint}</p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-600">
            Name this connection <span className="text-red-500">*</span>
          </span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} required maxLength={120}
            placeholder="e.g. Goa Landing Page, Mumbai DID"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
                       focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none"/>
          <span className="text-xs text-slate-400">
            Your own label — you can have several connections to one channel.
          </span>
        </label>

        {channel.credentialFields.map((f) => (
          <label key={f.key} className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-slate-600">
              {f.label}{f.required && <span className="text-red-500"> *</span>}
            </span>
            <input type="password" autoComplete="new-password" required={f.required}
              value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none"/>
            {f.helpText && <span className="text-xs text-slate-400">{f.helpText}</span>}
          </label>
        ))}

        {channel.configFields.map((f) => (
          <label key={f.key} className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-slate-600">
              {f.label}{f.required && <span className="text-red-500"> *</span>}
            </span>
            <input required={f.required} value={values[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none"/>
            {f.helpText && <span className="text-xs text-slate-400">{f.helpText}</span>}
          </label>
        ))}

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>
        )}

        <button type="submit" disabled={saving || !label.trim()}
          className="mt-auto w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold
                     hover:bg-slate-800 disabled:opacity-50 transition-colors">
          {saving ? "Connecting…" : "Create connection"}
        </button>
      </form>
    </div>
  );
}

/* ── Delivery status → what it MEANS ───────────────────────────────────────────
   Deliberately explanatory rather than a bare enum echo. "IGNORED" tells a travel agent nothing;
   "we could not find a phone or email in it" tells them whether to call the provider or call us.
   The colours follow the page's existing semantics: green = a lead, amber = arrived-but-no-lead
   (the interesting case), red = broken. */
const EVENT_STATUS = {
  PROCESSED:         { chip: "bg-green-50 text-green-700 border-green-200",   text: "Lead created" },
  APPENDED:          { chip: "bg-green-50 text-green-700 border-green-200",   text: "Added to an existing lead" },
  RECEIVED:          { chip: "bg-slate-100 text-slate-600 border-slate-200",  text: "Received" },
  DUPLICATE:         { chip: "bg-slate-100 text-slate-600 border-slate-200",  text: "Duplicate — already handled" },
  IGNORED:           { chip: "bg-amber-50 text-amber-700 border-amber-200",   text: "Not a lead" },
  DEFERRED:          { chip: "bg-sky-50 text-sky-700 border-sky-200",         text: "Fetching the details" },
  QUARANTINED_QUOTA: { chip: "bg-orange-50 text-orange-700 border-orange-200",text: "Blocked — plan limit full" },
  FAILED:            { chip: "bg-red-50 text-red-700 border-red-200",         text: "Failed" },
};
const eventStatus = (s) =>
  EVENT_STATUS[s] ?? { chip: "bg-slate-100 text-slate-600 border-slate-200", text: s };

/* ── Recent deliveries ─────────────────────────────────────────────────────────
   THE most important screen for any channel whose payload we could not verify — which today means
   JustDial, whose field names are informed guesses because JustDial publishes no contract.
   The server logs every delivery's raw body BEFORE parsing it, precisely so that a wrong guess shows
   up here as an "arrived but not a lead" row with the provider's own payload attached, instead of a
   silently lost enquiry. Reading one body is what turns "it isn't working" into a one-line fix.

   Bodies are fetched one at a time, on click: the list projects around a 64KB column server-side. */
function DeliveriesDrawer({ conn, onClose }) {
  const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [body, setBody] = useState(null);
  const [bodyLoading, setBodyLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { items } = await leadSourceService.getEvents(conn.publicId, { size: 25 });
        if (alive) { setRows(items); setError(null); }
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || "Could not load deliveries.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [conn.publicId]);

  const open = async (row) => {
    if (openId === row.publicId) { setOpenId(null); return; }
    setOpenId(row.publicId);
    setBody(null);
    setBodyLoading(true);
    try {
      setBody(await leadSourceService.getEvent(conn.publicId, row.publicId));
    } catch {
      setBody({ rawPayload: "Could not load this delivery." });
    } finally {
      setBodyLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Recent deliveries</h3>
            <p className="text-xs text-slate-500 mt-0.5">{conn.label}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <FiX className="w-4 h-4 text-slate-500"/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {loading && (
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <FiLoader className="w-4 h-4 animate-spin"/> Loading…
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="text-center py-12">
              <FiInbox className="w-8 h-8 text-slate-300 mx-auto"/>
              <p className="text-sm text-slate-500 mt-3">Nothing has reached this URL yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Once the provider sends something, every delivery shows up here — including the ones
                that did not become leads.
              </p>
            </div>
          )}

          {rows.map((row) => {
            const st = eventStatus(row.status);
            const isOpen = openId === row.publicId;
            return (
              <div key={row.publicId} className="border border-slate-100 rounded-xl overflow-hidden">
                <button onClick={() => open(row)}
                  className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${st.chip}`}>
                        {st.text}
                      </span>
                      <span className="text-xs text-slate-400">{fmtDate(row.createdAt)}</span>
                    </div>
                    {row.errorMessage && (
                      <p className="text-xs text-red-600 mt-1 truncate">{row.errorMessage}</p>
                    )}
                  </div>
                  <FiChevron className={`w-4 h-4 text-slate-400 shrink-0 transition-transform
                                        ${isOpen ? "rotate-90" : ""}`}/>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-3 bg-slate-50">
                    {bodyLoading && (
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <FiLoader className="w-3.5 h-3.5 animate-spin"/> Loading…
                      </p>
                    )}
                    {body && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                            Exactly what the provider sent
                          </p>
                          {body.rawPayload && <CopyButton value={body.rawPayload} label="Copy"/>}
                        </div>
                        {body.payloadTruncated && (
                          <p className="text-xs text-amber-700 mb-2">
                            This was longer than we store and has been cut short.
                          </p>
                        )}
                        <pre className="text-[11px] text-slate-700 bg-white border border-slate-200
                                        rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all
                                        max-h-72">
{body.rawPayload || "This delivery had no content."}
                        </pre>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── One connection row ───────────────────────────────────────────────────── */
function ConnectionRow({ conn, onRotate, onToggle, onDelete, onDeliveries, busy }) {
  const overlapOpen = Boolean(conn.tokenPreviousRevokeAt);
  return (
    <div className="border border-slate-100 rounded-2xl p-4 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800 truncate">{conn.label}</p>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border
                              ${STATUS_CHIP[conn.enabled ? conn.status : "DISABLED"] ?? STATUS_CHIP.DISABLED}`}>
              {conn.enabled ? conn.status : "DISABLED"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            <code className="text-slate-600">{conn.tokenPrefix}…</code>
            {" · "}{conn.leadCount} lead{conn.leadCount === 1 ? "" : "s"}
            {" · "}last lead {fmtDate(conn.lastLeadReceivedAt)}
          </p>
          {/* "Never received anything" and "receives pings but no leads" are different problems with
              different fixes — so the two timestamps are surfaced separately. */}
          {!conn.lastLeadReceivedAt && conn.tokenLastUsedAt && (
            <p className="text-xs text-amber-700 mt-1">
              Traffic is arriving but no leads yet — last contact {fmtDate(conn.tokenLastUsedAt)}.
            </p>
          )}
          {!conn.tokenLastUsedAt && (
            <p className="text-xs text-slate-400 mt-1">
              Nothing has reached this URL yet.
            </p>
          )}
          {overlapOpen && (
            <p className="text-xs text-amber-700 mt-1">
              The previous URL still works until {fmtDate(conn.tokenPreviousRevokeAt)}.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sits FIRST because it is the answer to "why am I not getting leads?" — the question this
              screen actually gets opened for. */}
          <button onClick={() => onDeliveries(conn)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                       border border-slate-200 text-slate-700 hover:bg-slate-50">
            <FiLog className="w-3.5 h-3.5"/> Deliveries
          </button>
          <button onClick={() => onToggle(conn)} disabled={busy}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200
                       text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {conn.enabled ? "Pause" : "Enable"}
          </button>
          <button onClick={() => onRotate(conn)} disabled={busy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                       border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <FiRefresh className="w-3.5 h-3.5"/> Rotate URL
          </button>
          <button onClick={() => onDelete(conn)} disabled={busy}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50">
            <FiTrash className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function LeadSources() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);      // channel dto
  const [connections, setConnections] = useState([]);
  const [connLoading, setConnLoading] = useState(false);

  const [drawerChannel, setDrawerChannel] = useState(null);
  const [deliveriesFor, setDeliveriesFor] = useState(null);
  const [issuedUrl, setIssuedUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    try {
      setChannels(await leadSourceService.getChannels());
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.message || "Could not load lead sources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadChannels(); }, [loadChannels]);

  const openChannel = async (channel) => {
    setSelected(channel);
    setConnLoading(true);
    try {
      setConnections(await leadSourceService.getConnections(channel.code));
    } finally {
      setConnLoading(false);
    }
  };

  const refresh = async () => {
    await loadChannels();
    if (selected) setConnections(await leadSourceService.getConnections(selected.code));
  };

  const handleCreated = async (created) => {
    setDrawerChannel(null);
    setIssuedUrl(created.ingestUrl);
    await refresh();
    if (!selected) {
      const ch = channels.find((c) => c.code === created.channelCode);
      if (ch) await openChannel(ch);
    }
  };

  const rotate = async (conn) => {
    if (!window.confirm(
      `Issue a new URL for "${conn.label}"?\n\n` +
      `The current URL keeps working for a short overlap window so you have time to paste the new ` +
      `one into the provider. Nothing is lost in between.`)) return;
    setBusy(true);
    try {
      const updated = await leadSourceService.rotateToken(conn.publicId);
      setIssuedUrl(updated.ingestUrl);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (conn) => {
    setBusy(true);
    try {
      await leadSourceService.updateConnection(conn.publicId, {
        channel: conn.channelCode, label: conn.label, enabled: !conn.enabled,
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (conn) => {
    if (!window.confirm(
      `Delete "${conn.label}"?\n\nIts URL stops working immediately and any leads still being sent ` +
      `to it will be rejected. Leads already received are kept.`)) return;
    setBusy(true);
    try {
      await leadSourceService.deleteConnection(conn.publicId);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <FiArrowLeft className="w-4 h-4"/>
        </button>
        <h1 className="text-xl font-bold text-slate-800">Lead Sources</h1>
      </div>
      <p className="text-sm text-slate-500 mb-6 ml-11">
        Connect the places your enquiries come from. Leads arrive automatically, get assigned to
        whoever is least busy, and are tagged with where they came from.
      </p>

      <IngestUrlBanner url={issuedUrl} onDismiss={() => setIssuedUrl(null)}/>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <FiLoader className="w-4 h-4 animate-spin"/> Loading channels…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => {
            const ui = uiFor(ch.code);
            const Icon = ui.icon;
            const isSelected = selected?.code === ch.code;
            return (
              <button key={ch.code} onClick={() => openChannel(ch)}
                className={`text-left rounded-2xl border bg-white p-4 transition-all hover:shadow-md
                            ${isSelected ? `ring-2 ${ui.ring} border-transparent` : "border-slate-100"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2 rounded-xl ${ui.chip}`}>
                    <Icon className="w-4 h-4"/>
                  </div>
                  {ch.connectionCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border
                                      ${STATUS_CHIP[ch.worstStatus] ?? STATUS_CHIP.DISABLED}`}>
                      {ch.worstStatus}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-semibold text-slate-800">{ch.displayName}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ch.description}</p>
                <p className="text-xs text-slate-400 mt-3">
                  {ch.connectionCount === 0
                    ? "Not connected"
                    : `${ch.connectionCount} connection${ch.connectionCount === 1 ? "" : "s"} · ${ch.totalLeadCount} lead${ch.totalLeadCount === 1 ? "" : "s"}`}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">{selected.displayName} connections</h2>
            <button onClick={() => setDrawerChannel(selected)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white
                         text-xs font-semibold hover:bg-slate-800 transition-colors">
              <FiPlus className="w-3.5 h-3.5"/> Add connection
            </button>
          </div>

          {connLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FiLoader className="w-4 h-4 animate-spin"/> Loading connections…
            </div>
          ) : connections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <FiInbox className="w-6 h-6 text-slate-300 mx-auto"/>
              <p className="text-sm text-slate-500 mt-2">
                No connections yet. Add one to get a URL you can paste into {selected.displayName}.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {connections.map((c) => (
                <ConnectionRow key={c.publicId} conn={c} busy={busy}
                  onRotate={rotate} onToggle={toggle} onDelete={remove}
                  onDeliveries={setDeliveriesFor}/>
              ))}
            </div>
          )}
        </div>
      )}

      <AddConnectionDrawer channel={drawerChannel} onClose={() => setDrawerChannel(null)}
        onCreated={handleCreated}/>

      {deliveriesFor && (
        <DeliveriesDrawer conn={deliveriesFor} onClose={() => setDeliveriesFor(null)}/>
      )}
    </div>
  );
}
