// src/features/portal/pages/PortalPayments.jsx
// Payment overview: summary tiles + a responsive grid of per-booking payment cards.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, ChevronRight, AlertTriangle, CheckCircle2, Wallet, Clock,
} from "lucide-react";
import portalService from "../api/portalService";
import { money, PayChip, Spinner, EmptyState, StatTile } from "../components/portalUi";
import { ComingSoonCard, usePortalFeatureInterest } from "../components/comingSoon";
import { COMING_SOON } from "../constants/portalFeatures";

export default function PortalPayments() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const { registered, markRegistered } = usePortalFeatureInterest();

  useEffect(() => {
    portalService
      .myBookings()
      .then(setBookings)
      .catch(() => setError("Could not load payments."));
  }, []);

  if (error) return <EmptyState icon={AlertTriangle} title={error} />;
  if (bookings == null) return <Spinner label="Loading payments…" />;
  if (bookings.length === 0)
    return <EmptyState icon={CreditCard} title="Nothing to pay" hint="You have no bookings yet." />;

  const totalPending = bookings.reduce((s, b) => s + Number(b.pendingAmount || 0), 0);
  const totalPaid = bookings.reduce((s, b) => s + Number(b.paidAmount || 0), 0);
  const totalPayable = bookings.reduce((s, b) => s + Number(b.totalPayable || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Track what you've paid and what's still due.</p>
      </div>

      {/* Pay Online — coming soon (primary spot) */}
      <div className="max-w-md">
        <ComingSoonCard
          feature={COMING_SOON.PAY_ONLINE}
          registered={registered.has("PAY_ONLINE")}
          onRegistered={markRegistered}
          featured
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <StatTile label="Total value" value={money(totalPayable)} icon={Wallet} tint="blue" />
        <StatTile label="Total paid" value={money(totalPaid)} icon={CheckCircle2} tint="emerald" />
        <StatTile label="Pending" value={money(totalPending)} icon={Clock} tint="amber" />
      </div>

      {/* Per-booking grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">By booking</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookings.map((b) => {
            const pending = Number(b.pendingAmount || 0) > 0;
            const paid = Number(b.paidAmount || 0);
            const total = Number(b.totalPayable || 0) || 1;
            const pct = Math.min(100, Math.round((paid / total) * 100));
            return (
              <button
                key={b.publicId}
                onClick={() => navigate(`/portal/bookings/${b.publicId}`)}
                className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-[15px] truncate">{b.destination}</p>
                    <p className="text-[11.5px] text-slate-400">#{b.bookingCode}</p>
                  </div>
                  <PayChip value={b.paymentStatus} />
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pending ? "bg-amber-400" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[12px]">
                    <span className="text-slate-500">
                      <span className="font-semibold text-slate-700">{money(paid)}</span> / {money(b.totalPayable)}
                    </span>
                    <span className="font-semibold text-slate-500">{pct}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-[13px]">
                  {pending ? (
                    <span className="font-bold text-amber-600">{money(b.pendingAmount)} due</span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <CheckCircle2 size={15} /> Settled
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                    Details <ChevronRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}