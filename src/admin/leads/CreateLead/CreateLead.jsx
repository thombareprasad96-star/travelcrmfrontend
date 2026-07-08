import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiSave, FiCheckCircle, FiAlertCircle,
  FiLoader, FiFileText
} from "react-icons/fi";
import { MdFlightTakeoff } from "react-icons/md";
import { leadService } from "../../../services/leadService";

import LeadInformation from "./LeadInformation";
import TravelDetails from "./TravelDetails";
import ServicesSection from "./ServicesSection";
import ItinerarySection from "./ItinerarySection";
import LeadSummary from "./LeadSummary";

let nextId = 1;

function Toast({ type, message, onClose }) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  const Icon = type === "success" ? FiCheckCircle : FiAlertCircle;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm
      ${styles[type]} animate-slide-in`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 ml-2 text-lg leading-none">×</button>
    </div>
  );
}

export default function CreateLead() {
  const navigate = useNavigate();

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
    reset,
  } = useForm({
  // nav added below
  // placeholder
    defaultValues: {
      customerName: "", phone: "", email: "",
      // ── NEW: budget field ──
      budget: "",
      leadSource: "", leadType: "", leadStage: "New Lead", assignTo: "", birthDate: "",
      travelDate: "", departCountry: "India", departCity: "",
      rooms: 1, adults: 2, children: 0, infants: 0, extraBeds: 0,
      notes: "",
    },
  });

  const [selectedServices, setSelectedServices] = useState(["hotel"]);
  const [itinerary, setItinerary] = useState([{ id: nextId++, destination: "", city: "", nights: 2 }]);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [toast, setToast] = useState(null);
  const [searching, setSearching] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleService = useCallback((id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const addItineraryRow = () => {
    setItinerary((prev) => [...prev, { id: nextId++, destination: "", city: "", nights: 2 }]);
  };

  const removeItineraryRow = (id) => {
    setItinerary((prev) => prev.filter((r) => r.id !== id));
  };

  const updateItineraryRow = (id, field, value) => {
    setItinerary((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const onSubmit = async (data) => {
    if (selectedServices.length === 0) {
      showToast("error", "Please select at least one service.");
      return;
    }

    setSubmitting(true);

    try {
      // ── budget is already inside `data` via register("budget") ──
      // normalize empty string → null so the backend doesn't receive ""
      const payload = {
        ...data,
        budget: data.budget === "" || data.budget == null ? null : Number(data.budget),
      };

      const response = await leadService.createLead(
        payload,
        selectedServices,
        itinerary
      );

      console.log("Lead Created:", response.data);

      showToast(
        "success",
        `Lead for "${data.customerName}" created successfully!`
      );

      reset();
      setSelectedServices(["hotel"]);
      setItinerary([{ id: nextId++, destination: "", city: "", nights: 2 }]);

      // ── Navigate to All Leads after 1.2s so user sees the success toast ──
      setTimeout(() => navigate("/allleads"), 1200);

    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Failed to create lead. Try again.";

      showToast("error", msg);

    } finally {
      setSubmitting(false);
    }
  };

  const onSaveDraft = async () => {
    const data = watch();
    setSavingDraft(true);
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Draft saved:", data);
    setSavingDraft(false);
    showToast("success", "Draft saved successfully!");
  };

  const handlePhoneSearch = async (phone) => {
    if (!phone?.trim()) return;

    setSearching(true);

    try {
      const res = await leadService.searchByPhone(phone);

      const lead = res.data;

      setValue("customerName", lead.customerName || "");
      setValue("email", lead.email || "");
      setValue("leadSource", lead.leadSource || "");
      setValue("leadType", lead.leadType || "");
      setValue("leadStage", lead.leadStage || "");
      setValue("assignTo", lead.assignTo || "");
      // ── NEW: prefill budget on phone-match too ──
      if (lead.budget != null) setValue("budget", lead.budget);

      showToast(
        "success",
        `Lead found: ${lead.customerName}`
      );

    } catch (error) {

      showToast(
        "error",
        "No existing lead found for this phone number."
      );

    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
                <FiFileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Create New Lead</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage customer travel enquiries efficiently</p>
              </div>
            </div>
            <button onClick={() => navigate("/allleads")}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300
                text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 transition-all shadow-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Leads
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-6">
              <LeadInformation
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                onPhoneSearch={handlePhoneSearch}
                searching={searching}
              />
              <TravelDetails
                register={register}
                watch={watch}
                setValue={setValue}
              />
              <ServicesSection
                selectedServices={selectedServices}
                onToggle={toggleService}
              />
              <ItinerarySection
                itinerary={itinerary}
                onAdd={addItineraryRow}
                onRemove={removeItineraryRow}
                onUpdate={updateItineraryRow}
              />

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <FiFileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">Customer Notes</h2>
                    <p className="text-amber-100 text-xs">Special requirements, budget, preferences</p>
                  </div>
                </div>
                <div className="p-6">
                  <textarea
                    {...register("notes")}
                    rows={5}
                    placeholder="Enter customer requirements, special requests, budget, preferred hotels, destinations, dietary needs, accessibility requirements, etc."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400
                      focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={onSaveDraft}
                    disabled={savingDraft || submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
                      border-2 border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800
                      font-semibold text-sm transition-all disabled:opacity-50 bg-white hover:bg-slate-50"
                  >
                    {savingDraft ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    {savingDraft ? "Saving Draft..." : "Save Draft"}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || savingDraft}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl
                      bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm
                      transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Creating Lead...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        Create Lead
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-3">
                  Fields marked with <span className="text-red-500">*</span> are required.
                  Customer name and phone are mandatory.
                </p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <LeadSummary
                  watch={watch}
                  selectedServices={selectedServices}
                  itinerary={itinerary}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}