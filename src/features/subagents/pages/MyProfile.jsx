// src/features/subagents/pages/MyProfile.jsx
// ─────────────────────────────────────────────────────────────
// Self-service personal profile — the signed-in user views their own account and edits their
// name / phone, plus changes their password. Email & role are read-only. Used by a B2B SUB_AGENT
// (who cannot reach the company-level profile/settings), backed by GET/PUT /api/me/profile.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, Save, KeyRound, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import meService from "../api/meService";
import { toast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";

const prettyRole = (r) => (r || "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const initials = (n) =>
  (n || "").trim().split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase() || "ME";

const inputCls = (bad) =>
  `w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border rounded-xl text-sm text-slate-800
   placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all
   ${bad ? "border-rose-400" : "border-slate-200"}`;

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // profile edit
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // password change
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdErr, setPwdErr] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    setLoading(true);
    meService.getProfile()
      .then((res) => {
        const p = res.data?.data ?? res.data ?? {};
        setProfile(p);
        setName(p.name || "");
        setPhone(p.phoneNumber || "");
      })
      .catch((err) => { if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Failed to load your profile.")); })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required."); return; }
    setSavingProfile(true);
    try {
      const res = await meService.updateProfile({ name: name.trim(), phoneNumber: phone.trim() });
      const p = res.data?.data ?? res.data ?? {};
      setProfile(p);
      if (p.name) localStorage.setItem("userName", p.name);
      toast.success("Profile updated.");
    } catch (err) {
      if (!isAlreadyReported(err)) toast.error(getErrorMessage(err, "Couldn't update your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwdErr("");
    if (!pwd.current || !pwd.next) { setPwdErr("Fill in both password fields."); return; }
    if (pwd.next.length < 6) { setPwdErr("New password must be at least 6 characters."); return; }
    if (pwd.next !== pwd.confirm) { setPwdErr("New password and confirmation don't match."); return; }
    setSavingPwd(true);
    try {
      await meService.changePassword(pwd.current, pwd.next);
      toast.success("Password changed.");
      setPwd({ current: "", next: "", confirm: "" });
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 401) {
        setPwdErr(getErrorMessage(err, "Current password is incorrect."));
      } else if (!isAlreadyReported(err)) {
        setPwdErr(getErrorMessage(err, "Couldn't change your password."));
      }
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
         style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">My Profile</h1>
            <p className="text-xs text-slate-400">Your account details &amp; password</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {loading ? (
          <Card><div className="py-10 text-center text-slate-400"><Loader2 size={22} className="mx-auto animate-spin" /></div></Card>
        ) : (
          <>
            {/* identity summary */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-extrabold shadow-md shadow-blue-200">
                  {initials(profile?.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-extrabold text-slate-800 truncate">{profile?.name}</p>
                  <p className="text-sm text-slate-400 truncate flex items-center gap-1.5"><Mail size={13} /> {profile?.email}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    <ShieldCheck size={12} /> {prettyRole(profile?.role)}
                  </span>
                </div>
              </div>
            </Card>

            {/* edit name/phone */}
            <Card>
              <h2 className="text-sm font-extrabold text-slate-800 mb-4">Account details</h2>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Name <span className="text-rose-500">*</span></label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls(false)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className={`${inputCls(false)} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Email (can't be changed)</label>
                  <input value={profile?.email || ""} disabled className={`${inputCls(false)} opacity-60 cursor-not-allowed`} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={savingProfile}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 disabled:opacity-50 flex items-center gap-2">
                    {savingProfile ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> : <><Save size={16} /> Save changes</>}
                  </button>
                </div>
              </form>
            </Card>

            {/* change password */}
            <Card>
              <h2 className="text-sm font-extrabold text-slate-800 mb-1 flex items-center gap-2"><KeyRound size={15} className="text-slate-500" /> Change password</h2>
              <p className="text-xs text-slate-400 mb-4">Use at least 6 characters.</p>
              <form onSubmit={savePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Current password</label>
                  <input type="password" value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} className={inputCls(false)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">New password</label>
                    <input type="password" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} className={inputCls(false)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm new password</label>
                    <input type="password" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} className={inputCls(false)} />
                  </div>
                </div>
                {pwdErr && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 font-semibold flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" />{pwdErr}
                  </div>
                )}
                <div className="flex justify-end">
                  <button type="submit" disabled={savingPwd}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
                    {savingPwd ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> : <><CheckCircle size={16} /> Update password</>}
                  </button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}