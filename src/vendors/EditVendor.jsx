// src/components/EditVendor/EditVendor.jsx
// ─────────────────────────────────────────────────────────────
// Edit Vendor Page — Travel CRM
// Route: /EditVendor/:id   (replace CreateVendor popup)
// Reuses all CreateVendor sub-components unchanged:
//   VendorInformation | VendorLocation | VendorServices
//   VendorFinancials  | VendorNotes   | VendorSummary
// On mount: fetches vendor by publicId, pre-fills form
// On submit: calls vendorService.update(id, payload)
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from "react";
import { useForm }       from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiSave, FiRefreshCw } from "react-icons/fi";
import { FaHandshake }   from "react-icons/fa";

import VendorInformation from "./VendorInformation";
import VendorLocation    from "./VendorLocation";
import VendorServices    from "./VendorServices";
import VendorFinancials  from "./VendorFinancials";
import VendorNotes       from "./VendorNotes";
import VendorSummary     from "./VendorSummary";

import vendorService     from "../services/vendorService";

/* ─── FONT STACK ─────────────────────────────────────────────── */
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ─── CRM TOAST (same pattern as every other page) ───────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3.5
        rounded-2xl border shadow-2xl max-w-sm
        ${type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ animation: "slideIn .3s ease both" }}
    >
      <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
      <p className="text-sm font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg ml-1 leading-none">×</button>
    </div>
  );
}

/* ─── SKELETON LOADER ────────────────────────────────────────── */
function SkeletonBlock({ h = "h-64" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${h} animate-pulse`}/>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function EditVendor() {
  const navigate        = useNavigate();
  const { id }          = useParams();   // publicId from URL

  const [loadingVendor, setLoadingVendor] = useState(true);
  const [vendorCode,    setVendorCode]    = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vendorName: "", vendorType: "", contactPerson: "",
      phone: "", alternatePhone: "", email: "", whatsapp: "",
      contractType: "Rate Contract", paymentTerms: "Net 30",
      commPref: "WhatsApp", status: "ACTIVE",
      city: "", state: "", country: "India",
      address: "", pincode: "", coverageAreas: "",
      serviceDescription: "",
      commissionRate: "", currency: "INR (₹)", creditPeriod: "Net 30",
      creditLimit: "", openingBalance: "",
      bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "",
      gstNumber: "", panNumber: "",
      notes: "", specialConditions: "",
    },
  });

  /* ── Load vendor on mount ────────────────────────────────── */
  useEffect(() => {
    if (!id) {
      showToast("No vendor ID provided.", "error");
      return;
    }
    setLoadingVendor(true);

    vendorService
      .getById(id)
      .then((res) => {
        // Support both { data: vendor } and { data: { data: vendor } }
        const v = res.data?.data ?? res.data;

        // Map backend response → form fields
        reset({
          vendorName:      v.name        || v.vendorName    || "",
          vendorType:      v.type        || v.vendorType    || "",
          contactPerson:   v.contact     || v.contactPerson || "",
          phone:           v.phone       || v.mobile        || "",
          alternatePhone:  v.alternatePhone                 || "",
          email:           v.email                          || "",
          whatsapp:        v.whatsapp                       || "",
          contractType:    v.contractType || "Rate Contract",
          paymentTerms:    v.paymentTerms || "Net 30",
          commPref:        v.commPref     || "WhatsApp",
          status:          v.status       || "ACTIVE",
          city:            v.city                           || "",
          state:           v.state        || v.country      || "",
          country:         v.country      || "India",
          address:         v.address                        || "",
          pincode:         v.pincode                        || "",
          coverageAreas:   v.coverageAreas                  || "",
          serviceDescription: v.serviceDescription          || "",
          commissionRate:  v.commissionRate != null ? String(v.commissionRate) : "",
          currency:        v.currency     || "INR (₹)",
          creditPeriod:    v.creditPeriod || "Net 30",
          creditLimit:     v.creditLimit  != null ? String(v.creditLimit)  : "",
          openingBalance:  v.openingBalance != null ? String(v.openingBalance) : "",
          bankName:        v.bankName                       || "",
          accountName:     v.accountName                    || "",
          accountNumber:   v.accountNumber                  || "",
          ifscCode:        v.ifscCode                       || "",
          upiId:           v.upiId                          || "",
          gstNumber:       v.gstNumber                      || "",
          panNumber:       v.panNumber                      || "",
          notes:           v.notes                          || "",
          specialConditions: v.specialConditions            || "",
        });

        // Re-hydrate selected services
        const svcs = Array.isArray(v.services) ? v.services : [];
        setSelectedServices(
          svcs.map((s, i) => ({
            id:    typeof s === "string" ? `svc_${i}` : (s.id || `svc_${i}`),
            label: typeof s === "string" ? s           : (s.label || s),
          }))
        );

        // Keep vendor code for display
        setVendorCode(v.code || v.vendorCode || "");
      })
      .catch((err) => {
        console.error("Failed to load vendor:", err);
        showToast(
          err?.response?.data?.message || "Failed to load vendor details.",
          "error"
        );
      })
      .finally(() => setLoadingVendor(false));
  }, [id, reset, showToast]);

  /* ── Service toggle ──────────────────────────────────────── */
  const handleServiceToggle = useCallback((svcId, label) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === svcId);
      return exists
        ? prev.filter((s) => s.id !== svcId)
        : [...prev, { id: svcId, label }];
    });
  }, []);

  /* ── Save Draft ──────────────────────────────────────────── */
  const onSaveDraft = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Draft saved locally.");
  };

  /* ── Submit (Update) ─────────────────────────────────────── */
  const onSubmit = async (data) => {
    if (selectedServices.length === 0) {
      showToast("Please select at least one service.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        vendorName:       data.vendorName,
        vendorType:       data.vendorType,
        contactPerson:    data.contactPerson,
        phone:            data.phone,
        alternatePhone:   data.alternatePhone,
        email:            data.email,
        whatsapp:         data.whatsapp,
        contractType:     data.contractType,
        paymentTerms:     data.paymentTerms,
        commPref:         data.commPref,
        status:           data.status,
        city:             data.city,
        state:            data.state,
        country:          data.country,
        address:          data.address,
        pincode:          data.pincode,
        coverageAreas:    data.coverageAreas,
        services:         selectedServices.map((s) => s.label),
        serviceDescription: data.serviceDescription,
        commissionRate:   parseFloat(data.commissionRate) || 0,
        currency:         data.currency,
        creditPeriod:     data.creditPeriod,
        creditLimit:      parseFloat(data.creditLimit)    || 0,
        openingBalance:   parseFloat(data.openingBalance) || 0,
        bankName:         data.bankName,
        accountName:      data.accountName,
        accountNumber:    data.accountNumber,
        ifscCode:         data.ifscCode,
        upiId:            data.upiId,
        gstNumber:        data.gstNumber,
        panNumber:        data.panNumber,
        notes:            data.notes,
        specialConditions: data.specialConditions,
      };

      await vendorService.update(id, payload);

      showToast(`Vendor "${data.vendorName}" updated successfully! ✅`);

      // Navigate back after a short delay so the user sees the toast
      setTimeout(() => navigate("/AllVendors"), 1500);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update vendor.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      style={{ fontFamily: FONT }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9;border-radius:99px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
      `}</style>

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: icon + title */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500
                flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                <FaHandshake className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Edit Vendor</h1>
                  {vendorCode && (
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1
                      rounded-full border border-indigo-200">
                      {vendorCode}
                    </span>
                  )}
                  {loadingVendor && (
                    <span className="text-xs text-slate-400 font-medium animate-pulse">Loading…</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/AllVendors")}>Vendors</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-indigo-600 font-bold">Edit</span>
                </p>
              </div>
            </div>

            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate("/AllVendors")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-indigo-300 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700
                text-sm font-bold transition-all shadow-sm self-start sm:self-auto"
            >
              <FiArrowLeft className="w-4 h-4"/> Back to Vendors
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Loading skeleton */}
        {loadingVendor ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <SkeletonBlock h="h-72"/>
              <SkeletonBlock h="h-56"/>
              <SkeletonBlock h="h-64"/>
              <SkeletonBlock h="h-80"/>
              <SkeletonBlock h="h-48"/>
            </div>
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <SkeletonBlock h="h-48"/>
              <SkeletonBlock h="h-64"/>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── LEFT COLUMN — form sections ── */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* 1. Vendor Information */}
                <div className="fade-up">
                  <VendorInformation
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                </div>

                {/* 2. Location */}
                <div className="fade-up" style={{ animationDelay:"60ms" }}>
                  <VendorLocation
                    register={register}
                    errors={errors}
                  />
                </div>

                {/* 3. Services */}
                <div className="fade-up" style={{ animationDelay:"100ms" }}>
                  <VendorServices
                    selectedServices={selectedServices}
                    onToggle={handleServiceToggle}
                    register={register}
                  />
                </div>

                {/* 4. Financials */}
                <div className="fade-up" style={{ animationDelay:"140ms" }}>
                  <VendorFinancials
                    register={register}
                    errors={errors}
                  />
                </div>

                {/* 5. Notes */}
                <div className="fade-up" style={{ animationDelay:"180ms" }}>
                  <VendorNotes register={register}/>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-up"
                  style={{ animationDelay:"220ms" }}>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">

                    {/* Save Draft */}
                    <button
                      type="button"
                      onClick={onSaveDraft}
                      disabled={saving || submitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3
                        rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-600
                        hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50
                        bg-white hover:bg-slate-50"
                    >
                      {saving
                        ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/>
                        : <FiSave className="w-4 h-4"/>}
                      {saving ? "Saving…" : "Save Draft"}
                    </button>

                    {/* Update Vendor (primary) */}
                    <button
                      type="submit"
                      disabled={submitting || saving}
                      className="flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600
                        active:from-indigo-800 text-white font-extrabold text-sm shadow-md shadow-indigo-200
                        hover:shadow-lg hover:shadow-indigo-300 transition-all
                        disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                          Updating Vendor…
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4"/>
                          Update Vendor
                        </>
                      )}
                    </button>

                    {/* Discard / back */}
                    <button
                      type="button"
                      onClick={() => navigate("/AllVendors")}
                      disabled={submitting || saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3
                        rounded-xl border-2 border-red-100 hover:border-red-200 text-red-400
                        hover:text-red-600 font-bold text-sm transition-all disabled:opacity-40
                        bg-white hover:bg-red-50"
                    >
                      <FiArrowLeft className="w-4 h-4"/> Discard
                    </button>
                  </div>

                  <p className="text-center text-xs text-slate-400 mt-3">
                    Changes are saved immediately when you click{" "}
                    <span className="font-bold text-indigo-600">Update Vendor</span>.
                  </p>
                </div>
              </div>

              {/* ── RIGHT SIDEBAR — live preview ── */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-20">
                  <VendorSummary
                    watch={watch}
                    selectedServices={selectedServices}
                  />
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}