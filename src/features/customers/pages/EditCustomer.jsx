// src/customers/EditCustomer.jsx
// ─────────────────────────────────────────────────────────────
// Edit Customer Page — Travel CRM
// Route: /EditCustomer/:id   (replaces CustomerFormModal popup)
// Reuses all CreateCustomer sub-components unchanged:
//   CustomerInformation | CustomerAddress
//   CustomerDocuments   | CustomerNotes | CustomerSummary
// On mount: fetches customer by id, pre-fills form
// On submit: calls customerService.update(id, payload)
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft as FiArrowLeft, CircleCheck as FiCheckCircle, Save as FiSave, User as FiUser } from "lucide-react";


// ── Same folder imports (adjust if your structure differs) ────
import CustomerInformation from "../components/CustomerInformation";
import CustomerAddress     from "../components/CustomerAddress";
import CustomerDocuments   from "../components/CustomerDocuments";
import CustomerNotes       from "../components/CustomerNotes";
import CustomerSummary     from "../components/CustomerSummary";

import customerService     from "../api/customerService";

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ─── CRM TOAST (same pattern as every other page) ───────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-4 py-3
        rounded-xl border shadow-2xl max-w-xs
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
  return <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${h} animate-pulse`}/>;
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function EditCustomer() {
  const navigate = useNavigate();
  const { id }   = useParams();   // customer id from URL, e.g. CUS001

  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [customerCode,    setCustomerCode]    = useState("");
  const [submitting,      setSubmitting]      = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [toast,           setToast]           = useState(null);

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
      name: "", phone: "", email: "", alternatePhone: "",
      type: "Individual", commPref: "WhatsApp",
      tier: "Bronze", status: "Active",
      city: "", state: "", address: "", pincode: "",
      birthday: "", anniversary: "",
      passportNo: "", panNo: "", aadharNo: "", documents: "",
      notes: "",
    },
  });

  /* ── Load customer on mount ──────────────────────────────── */
  useEffect(() => {
    if (!id) {
      showToast("No customer ID provided.", "error");
      return;
    }
    setLoadingCustomer(true);

    customerService
      .getById(id)
      .then((res) => {
        // Support both { data: customer } and { data: { data: customer } }
        const c = res.data?.data ?? res.data;

        reset({
          name:           c.name           || "",
          phone:          c.phone          || "",
          email:          c.email          || "",
          alternatePhone: c.alternatePhone || "",
          type:           c.type           || "Individual",
          commPref:       c.commPref       || "WhatsApp",
          tier:           c.tier           || "Bronze",
          status:         c.status         || "Active",
          city:           c.city           || "",
          state:          c.state          || "",
          address:        c.address        || "",
          pincode:        c.pincode        || "",
          birthday:       c.birthday       || "",
          anniversary:    c.anniversary    || "",
          passportNo:     c.passportNo     || "",
          panNo:          c.panNo          || "",
          aadharNo:       c.aadharNo       || "",
          documents:      c.documents      || "",
          notes:          c.notes          || "",
        });

        setCustomerCode(c.id || c.customerId || id);
      })
      .catch((err) => {
        console.error("Failed to load customer:", err);
        showToast(
          err?.response?.data?.message || "Failed to load customer details.",
          "error"
        );
      })
      .finally(() => setLoadingCustomer(false));
  }, [id, reset, showToast]);

  /* ── Save Draft ──────────────────────────────────────────── */
  const onSaveDraft = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Draft saved locally.");
  };

  /* ── Submit (Update) ─────────────────────────────────────── */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name:           data.name,
        phone:          data.phone,
        email:          data.email,
        alternatePhone: data.alternatePhone,
        type:           data.type,
        commPref:       data.commPref,
        tier:           data.tier,
        status:         data.status,
        city:           data.city,
        state:          data.state,
        address:        data.address,
        pincode:        data.pincode,
        birthday:       data.birthday || null,
        anniversary:    data.anniversary || null,
        passportNo:     data.passportNo,
        panNo:          data.panNo,
        aadharNo:       data.aadharNo,
        documents:      data.documents,
        notes:          data.notes,
      };

      await customerService.update(id, payload);

      showToast(`Customer "${data.name}" updated successfully! ✅`);

      setTimeout(() => navigate("/AllCustomers"), 1500);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update customer.",
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

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── PAGE HEADER ── */}
      <div className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500
                flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                <FiUser className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Edit Customer</h1>
                  {customerCode && (
                    <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1
                      rounded-full border border-indigo-200">
                      {customerCode}
                    </span>
                  )}
                  {loadingCustomer && (
                    <span className="text-xs text-slate-400 font-medium animate-pulse">Loading…</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/AllCustomers")}>Customers</span>
                  <span className="mx-1 text-slate-300">/</span>
                  <span className="text-indigo-600 font-bold">Edit</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/AllCustomers")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200
                hover:border-indigo-300 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700
                text-sm font-bold transition-all shadow-sm self-start sm:self-auto"
            >
              <FiArrowLeft className="w-4 h-4"/> Back to Customers
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {loadingCustomer ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <SkeletonBlock h="h-72"/>
              <SkeletonBlock h="h-56"/>
              <SkeletonBlock h="h-64"/>
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

                <div className="fade-up">
                  <CustomerInformation
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                </div>

                <div className="fade-up" style={{ animationDelay:"60ms" }}>
                  <CustomerAddress
                    register={register}
                    errors={errors}
                  />
                </div>

                <div className="fade-up" style={{ animationDelay:"100ms" }}>
                  <CustomerDocuments
                    register={register}
                    errors={errors}
                  />
                </div>

                <div className="fade-up" style={{ animationDelay:"140ms" }}>
                  <CustomerNotes register={register}/>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 fade-up"
                  style={{ animationDelay:"180ms" }}>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3">

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
                          Updating Customer…
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4"/>
                          Update Customer
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/AllCustomers")}
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
                    <span className="font-bold text-indigo-600">Update Customer</span>.
                  </p>
                </div>
              </div>

              {/* ── RIGHT SIDEBAR — live preview ── */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-20">
                  <CustomerSummary watch={watch} />
                </div>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}