// src/fleet/FleetTripDetail.jsx
// Trip detail — full record + lifecycle actions (start / close / cancel).
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Route as RouteIcon, ArrowLeft, Play, Flag, Ban, Pencil, Trash2,
  Car, IdCard, Gauge, MapPin, Receipt, Clock, IndianRupee, MapPinned,
} from "lucide-react";

import fleetService from "../services/fleetService";
import { hasPermission, P } from "../services/access";
import {
  Button,
  PageShell, GlassCard, LoadingState, EmptyState, ConfirmDialog, useToast, errMsg,
  StatusBadge, TRIP_STATUS, fmtDateTime, fmtNumber, fmtMoney, StatStrip, FormSection,
} from "./fleetUi";
import { StartTripDialog, CloseTripDialog } from "./FleetTrips";

function Info({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value ?? "—"}</p>
      </div>
    </div>
  );
}

/** "3h 20m" from two datetimes (or "—"). */
function durationLabel(start, end) {
  if (!start || !end) return "—";
  const ms = new Date(end) - new Date(start);
  if (Number.isNaN(ms) || ms <= 0) return "—";
  const h = Math.floor(ms / 3600000);
  const m = Math.round((ms % 3600000) / 60000);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default function FleetTripDetail() {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const { showToast, toastNode } = useToast();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const canUpdate = hasPermission(P.FLEET_UPDATE);
  const canDelete = hasPermission(P.FLEET_DELETE);

  const load = useCallback(async () => {
    try {
      const t = await fleetService.getTrip(publicId);
      setTrip(t);
    } catch (e) {
      showToast(errMsg(e, "Failed to load trip."), "error");
    } finally {
      setLoading(false);
    }
  }, [publicId, showToast]);

  useEffect(() => { load(); }, [load]);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      await fleetService.cancelTrip(publicId);
      showToast("Trip cancelled.");
      setShowCancel(false);
      await load();
    } catch (e) {
      showToast(errMsg(e, "Couldn't cancel the trip."), "error");
    } finally { setBusy(false); }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await fleetService.deleteTrip(publicId);
      showToast("Trip moved to Trash.");
      navigate("/fleet/trips");
    } catch (e) {
      showToast(errMsg(e, "Couldn't delete the trip."), "error");
      setBusy(false);
    }
  };

  if (loading) return <PageShell><LoadingState label="Loading trip…" /></PageShell>;
  if (!trip) {
    return (
      <PageShell>
        {toastNode}
        <EmptyState icon={RouteIcon} title="Trip not found"
          action={<Button onClick={() => navigate("/fleet/trips")}>Back to Trips</Button>} />
      </PageShell>
    );
  }

  const route = [trip.routeFrom, trip.routeTo].filter(Boolean).join(" → ") || "Trip";

  const kpi = [
    { key: "dist", label: "Distance", value: fmtNumber(trip.distanceKm, " km"), icon: Gauge, tone: "text-blue-600", accent: "bg-blue-50" },
    { key: "exp", label: "Total Expense", value: fmtMoney(trip.totalExpense), icon: IndianRupee, tone: "text-rose-600", accent: "bg-rose-50" },
    { key: "dur", label: "Duration", value: durationLabel(trip.startDatetime, trip.endDatetime), icon: Clock, tone: "text-indigo-600", accent: "bg-indigo-50" },
  ];

  return (
    <PageShell>
      {toastNode}

      <button
        onClick={() => navigate("/fleet/trips")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Trips
      </button>

      {/* Hero */}
      <GlassCard className="mb-5 overflow-hidden">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-blue-50/60 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <RouteIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl">{route}</h1>
                <StatusBadge config={TRIP_STATUS} value={trip.status} />
              </div>
              <p className="text-sm text-slate-500">{fmtDateTime(trip.startDatetime)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canUpdate && trip.status === "PLANNED" && (
              <Button size="sm" onClick={() => setShowStart(true)}><Play /> Start</Button>
            )}
            {canUpdate && trip.status === "ONGOING" && (
              <Button size="sm" variant="success" onClick={() => setShowClose(true)}><Flag /> Close</Button>
            )}
            {canUpdate && (trip.status === "PLANNED" || trip.status === "ONGOING") && (
              <Button size="sm" variant="outline" className="text-amber-600" onClick={() => setShowCancel(true)}>
                <Ban /> Cancel
              </Button>
            )}
            {canUpdate && trip.status !== "CANCELLED" && (
              <Button size="sm" variant="outline" onClick={() => navigate(`/fleet/trips/${publicId}/edit`)}>
                <Pencil /> Edit
              </Button>
            )}
            {canDelete && trip.status !== "ONGOING" && (
              <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => setShowDelete(true)}>
                <Trash2 /> Delete
              </Button>
            )}
          </div>
        </div>
      </GlassCard>

      <StatStrip items={kpi} />

      {/* Trip details */}
      <FormSection title="Trip Details" subtitle="Assignment, schedule & route" icon={MapPinned} className="mb-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Info label="Vehicle" value={trip.vehicleNumber} icon={Car} />
          <Info label="Driver" value={trip.driverName} icon={IdCard} />
          <Info label="Booking" value={trip.bookingCode || "—"} />
          <Info label="Distance" value={fmtNumber(trip.distanceKm, " km")} icon={Gauge} />
          <Info label="Start" value={fmtDateTime(trip.startDatetime)} />
          <Info label="End" value={trip.endDatetime ? fmtDateTime(trip.endDatetime) : "—"} />
          <Info label="Start Odometer" value={fmtNumber(trip.startOdometer, " km")} />
          <Info label="End Odometer" value={fmtNumber(trip.endOdometer, " km")} />
          <Info label="From" value={trip.routeFrom} icon={MapPin} />
          <Info label="To" value={trip.routeTo} icon={MapPin} />
          <Info label="Purpose" value={trip.purpose} />
        </div>
      </FormSection>

      {/* Expenses */}
      <FormSection title="Expenses" subtitle="Recorded costs for this trip" icon={Receipt} className="mb-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Info label="Fuel" value={fmtMoney(trip.fuelCost)} />
          <Info label="Toll" value={fmtMoney(trip.tollCost)} />
          <Info label="Driver Allowance" value={fmtMoney(trip.driverAllowance)} />
          <div className="rounded-xl bg-blue-50/60 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-500">Total</p>
            <p className="text-lg font-extrabold text-blue-700">{fmtMoney(trip.totalExpense)}</p>
          </div>
        </div>
        {trip.remarks && (
          <div className="mt-4 rounded-xl bg-slate-50/70 p-3 text-sm text-slate-600">{trip.remarks}</div>
        )}
      </FormSection>

      {showStart && (
        <StartTripDialog trip={trip} onClose={() => setShowStart(false)}
          onDone={async () => { setShowStart(false); await load(); }} showToast={showToast} />
      )}
      {showClose && (
        <CloseTripDialog trip={trip} onClose={() => setShowClose(false)}
          onDone={async () => { setShowClose(false); await load(); }} showToast={showToast} />
      )}

      <ConfirmDialog
        open={showCancel}
        onOpenChange={setShowCancel}
        title="Cancel this trip?"
        description="The trip will be marked CANCELLED and its vehicle freed."
        confirmLabel="Cancel Trip"
        busy={busy}
        onConfirm={confirmCancel}
      />
      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Move trip to Trash?"
        description="This trip will be moved to Trash."
        confirmLabel="Move to Trash"
        busy={busy}
        onConfirm={confirmDelete}
      />
    </PageShell>
  );
}