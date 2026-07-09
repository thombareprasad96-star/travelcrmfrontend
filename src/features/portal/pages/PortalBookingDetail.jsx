// src/features/portal/pages/PortalBookingDetail.jsx
// Single trip — two-column on laptop: left (overview + services), right (sticky
// payment summary + pay CTA). Single column on mobile.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Calendar, CheckCircle2, CreditCard, Loader2, AlertTriangle,
} from "lucide-react";
import portalService from "../api/portalService";
import { money, fmtDate, StatusChip, PayChip, Spinner, EmptyState } from "../components/portalUi";
import ItineraryTimeline from "../components/ItineraryTimeline";

export default function PortalBookingDetail() {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [b, setB] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState("");

  useEffect(() => {
    portalService
      .booking(publicId)
      .then(setB)
      .catch((err) =>
        setError(err?.response?.status === 404 ? "Trip not found." : "Could not load this trip.")
      );
    portalService.itinerary(publicId).then(setItinerary).catch(() => {});
  }, [publicId]);

  const pay = async () => {
    setPaying(true);
    setPayMsg("");
    try {
      const intent = await portalService.payBooking(publicId, null);
      if (intent?.redirectUrl) {
        window.location.href = intent.redirectUrl;
        return;
      }
      setPayMsg(intent?.message || "Online payment is not available yet. Please contact your agency.");
    } catch (err) {
      setPayMsg(err?.response?.data?.message || "Could not start payment.");
    } finally {
      setPaying(false);
    }
  };

  if (error) return <EmptyState icon={AlertTriangle} title={error} />;
  if (b == null) return <Spinner label="Loading trip…" />;

  const rows = [
    ["Base amount", money(b.baseAmount), false],
    ["GST", money(b.gst), false],
    ["TCS", money(b.tcs), false],
    ["Total payable", money(b.totalPayable), true],
    ["Paid", money(b.paidAmount), false],
    ["Pending", money(b.pendingAmount), true],
  ];
  const hasPending = Number(b.pendingAmount || 0) > 0;

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-[13px] font-medium"
      >
        <ArrowLeft size={16} /> Back to trips
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-lg">
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-extrabold text-xl lg:text-2xl">
                  <MapPin size={20} className="text-blue-400 shrink-0" />
                  <span className="truncate">{b.destination}</span>
                </div>
                <p className="text-[12px] text-slate-300 mt-1">Booking #{b.bookingCode}</p>
              </div>
              <StatusChip value={b.status} />
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-5">
              <DarkTile icon={Calendar} label="Travel date" value={fmtDate(b.travelDate)} />
              <DarkTile icon={Calendar} label="Booked on" value={fmtDate(b.bookingDate)} />
            </div>
            <MapPin className="absolute -right-6 -bottom-8 text-white/5" size={150} />
          </div>

          {/* Included services */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Included services</h3>
            {b.services?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {b.services.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-[13.5px] text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {s}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400">No services listed for this booking.</p>
            )}
          </div>

          {/* Day-wise itinerary (from the booking's quotation) */}
          <ItineraryTimeline itinerary={itinerary} />
        </div>

        {/* ── Right column: payment summary (sticky on laptop) ── */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-slate-800">Payment summary</h3>
              <PayChip value={b.paymentStatus} />
            </div>
            <div className="space-y-2.5">
              {rows.map(([label, value, strong]) => (
                <div
                  key={label}
                  className={`flex items-center justify-between text-[13.5px] ${
                    strong
                      ? "font-bold text-slate-800 pt-2.5 border-t border-slate-100"
                      : "text-slate-500"
                  }`}
                >
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {hasPending ? (
              <>
                <button
                  onClick={pay}
                  disabled={paying}
                  className="mt-5 w-full h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 shadow-lg shadow-blue-300/40 hover:brightness-105 active:scale-[0.99] disabled:opacity-70 transition"
                >
                  {paying ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={17} /> Pay {money(b.pendingAmount)}
                    </>
                  )}
                </button>
                {payMsg && <p className="mt-3 text-[12px] text-center text-slate-500">{payMsg}</p>}
              </>
            ) : (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-[13.5px] py-3">
                <CheckCircle2 size={17} /> Fully paid
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/10 px-3.5 py-2.5">
      <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
        <Icon size={12} /> {label}
      </div>
      <p className="text-[13.5px] font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}