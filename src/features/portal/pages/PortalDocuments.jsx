// src/features/portal/pages/PortalDocuments.jsx
// Document vault — upload panel + responsive grid of document cards.
import { useEffect, useRef, useState } from "react";
import {
  FileText, Upload, Download, Trash2, Loader2, AlertTriangle, ShieldCheck,
} from "lucide-react";
import portalService from "../api/portalService";
import { fmtDate, Spinner, EmptyState } from "../components/portalUi";

const TYPES = ["PASSPORT", "VISA", "PHOTO", "OTHER"];

export default function PortalDocuments() {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("PASSPORT");
  const [expiry, setExpiry] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  const load = () =>
    portalService.myDocuments().then(setDocs).catch(() => setError("Could not load documents."));

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      await portalService.uploadDocument(file, type, expiry || null);
      setMsg("Document uploaded successfully.");
      setExpiry("");
      await load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (d) => {
    if (!window.confirm(`Delete ${d.fileName}?`)) return;
    try {
      await portalService.deleteDocument(d.publicId);
      await load();
    } catch {
      setMsg("Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Documents</h1>
        <p className="text-slate-500 text-sm mt-1">Securely store your passport, visa and travel photos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Upload panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Upload size={17} className="text-blue-600" /> Upload document
          </h2>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-[13.5px] text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1">
                Expiry date (optional)
              </label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-[13.5px] text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          </div>
          <input ref={fileRef} type="file" onChange={onUpload} disabled={busy} className="hidden" id="doc-file" />
          <label
            htmlFor="doc-file"
            className={`w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-[13px] font-semibold cursor-pointer transition ${
              busy
                ? "opacity-60 cursor-wait border-slate-200 text-slate-400"
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {busy ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload size={20} /> Click to choose a file
              </>
            )}
          </label>
          {msg && <p className="mt-3 text-[12px] text-center text-slate-500">{msg}</p>}
        </div>

        {/* Documents grid */}
        <div className="lg:col-span-2">
          {error ? (
            <EmptyState icon={AlertTriangle} title={error} />
          ) : docs == null ? (
            <Spinner label="Loading documents…" />
          ) : docs.length === 0 ? (
            <EmptyState icon={FileText} title="No documents yet" hint="Upload your passport, visa or photo to get started." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((d) => (
                <div
                  key={d.publicId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-blue-600" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-[14px] truncate">{d.fileName}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{d.type}</span>
                        {d.expiryDate && <span>exp {fmtDate(d.expiryDate)}</span>}
                        {d.verificationStatus && (
                          <span className="inline-flex items-center gap-0.5">
                            <ShieldCheck size={11} /> {d.verificationStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => portalService.downloadDocument(d.publicId, d.fileName)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[12.5px] font-semibold transition"
                    >
                      <Download size={15} /> Download
                    </button>
                    <button
                      onClick={() => remove(d)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}