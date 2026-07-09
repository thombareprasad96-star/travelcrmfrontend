// src/features/portal/pages/PortalTrips.jsx
// "My Trips" — hero header, quick stats, and a responsive grid of trip cards.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, ChevronRight, Briefcase, AlertTriangle, CheckCircle2, Plane, Sparkles,
} from "lucide-react";
import portalService from "../api/portalService";
import {
  money, fmtDate, StatusChip, PayChip, Spinner, EmptyState, StatTile,
} from "../components/portalUi";
import { ComingSoonCard, usePortalFeatureInterest } from "../components/comingSoon";
import { COMING_SOON } from "../constants/portalFeatures";

export default function PortalTrips() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const { registered, markRegistered } = usePortalFeatureInterest();

  useEffect(() => {
    portalService
      .myBookings()
      .then(setBookings)
      .catch(() => setError("Could not load your trips."));
  }, []);

  if (error) return <EmptyState icon={AlertTriangle} title={error} hint="Please try again shortly." />;
  if (bookings == null) return <Spinner label="Loading your trips…" />;

  const totalPending = bookings.reduce((s, b) => s + Number(b.pendingAmount || 0), 0);
  const totalPaid = bookings.reduce((s, b) => s + Number(b.paidAmount || 0), 0);
  const today = new Date();
  const upcoming = bookings.filter((b) => b.travelDate && new Date(b.travelDate) >= today).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 lg:p-9 text-white shadow-xl shadow-blue-300/30">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium">Welcome back</p>
          <h1 className="text-2xl lg:text-[32px] font-extrabold mt-1 tracking-tight">Your Journeys</h1>
          <p className="text-blue-100/90 text-[13.5px] lg:text-sm mt-1.5 max-w-lg">
            All your trips, payments and travel documents — in one place.
          </p>
        </div>
        <Plane className="absolute -right-6 -bottom-8 text-white/10 -rotate-12" size={190} />
        <div className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatTile label="Total trips" value={bookings.length} icon={Briefcase} tint="blue" />
        <StatTile label="Upcoming" value={upcoming} icon={Calendar} tint="indigo" />
        <StatTile label="Paid" value={money(totalPaid)} icon={CheckCircle2} tint="emerald" />
        <StatTile label="Pending" value={money(totalPending)} icon={AlertTriangle} tint="amber" />
      </div>

      {/* Pending banner */}
      {totalPending > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 px-4 lg:px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={17} className="text-amber-600" />
            </span>
            <div>
              <p className="text-[12px] text-amber-700 font-medium">You have a pending balance</p>
              <p className="text-[16px] font-bold text-amber-800 -mt-0.5">{money(totalPending)}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/portal/payments")}
            className="text-[13px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl transition"
          >
            Pay now
          </button>
        </div>
      )}

      {/* Trips grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">My Trips</h2>
        {bookings.length === 0 ? (
          <EmptyState icon={Briefcase} title="No trips yet" hint="Your bookings will appear here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookings.map((b) => (
              <button
                key={b.publicId}
                onClick={() => navigate(`/portal/bookings/${b.publicId}`)}
                className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[16px]">
                      <MapPin size={16} className="text-blue-600 shrink-0" />
                      <span className="truncate">{b.destination}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">#{b.bookingCode}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-3">
                  <Calendar size={14} /> Travel:{" "}
                  <span className="font-medium text-slate-600">{fmtDate(b.travelDate)}</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StatusChip value={b.status} />
                  <PayChip value={b.paymentStatus} />
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400">Total</p>
                    <p className="text-[16px] font-extrabold text-slate-800 -mt-0.5">{money(b.totalPayable)}</p>
                  </div>
                  {Number(b.pendingAmount || 0) > 0 ? (
                    <span className="text-[12px] font-semibold text-amber-600">
                      {money(b.pendingAmount)} due
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                      <CheckCircle2 size={14} /> Paid
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Coming soon strip */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles size={18} className="text-blue-600" /> Coming soon
        </h2>
        <div className="flex gap-4 overflow-x-auto snap-x pb-2 -mx-1 px-1">
          {[COMING_SOON.REFER_EARN, COMING_SOON.TRIP_MEMORIES, COMING_SOON.LIVE_TRACKING].map((f) => (
            <div key={f.key} className="snap-start shrink-0 w-[270px]">
              <ComingSoonCard
                feature={f}
                registered={registered.has(f.key)}
                onRegistered={markRegistered}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
