// src/fleet/FleetTripForm.jsx
// Create / edit a trip. Create with an end time → a post-facto COMPLETED diary entry;
// otherwise the trip is PLANNED and run via the start/close lifecycle actions.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Route as RouteIcon, Save, Users, CalendarClock, Receipt } from "lucide-react";

import fleetService from "../services/fleetService";
import bookingService from "../services/bookingService";
import {
  Button, Input, Select, Textarea,
  PageShell, LoadingState, FormHeader, FormSection, Field, FormActions,
  useToast, errMsg, StatusBadge, TRIP_STATUS,
  toDateTimeInput, nowDateTimeInput,
} from "./fleetUi";

const toNum = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

const BLANK = {
  vehiclePublicId: "", driverPublicId: "", bookingPublicId: "",
  startDatetime: nowDateTimeInput(), endDatetime: "",
  startOdometer: "", endOdometer: "",
  routeFrom: "", routeTo: "", purpose: "",
  fuelCost: "", tollCost: "", driverAllowance: "", remarks: "",
};

export default function FleetTripForm() {
  const { publicId } = useParams();
  const isEdit = !!publicId;
  const navigate = useNavigate();
  const { showToast, toastNode } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [status, setStatus] = useState(null); // edit mode: current trip status
  const [vehicleOpts, setVehicleOpts] = useState([]);
  const [driverOpts, setDriverOpts] = useState([]);
  const [bookingOpts, setBookingOpts] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: BLANK });

  // Vehicle/driver may only change while PLANNED (create is always editable).
  const lockAssignment = isEdit && status && status !== "PLANNED";

  useEffect(() => {
    fleetService.vehicleOptions().then(setVehicleOpts).catch(() => setVehicleOpts([]));
    fleetService.driverOptions().then(setDriverOpts).catch(() => setDriverOpts([]));
    bookingService
      .getAll(0, 500)
      .then((res) => {
        const list = res?.data?.data ?? res?.data ?? [];
        setBookingOpts(
          (Array.isArray(list) ? list : [])
            .filter((b) => b.publicId)
            .map((b) => ({
              publicId: b.publicId,
              label:
                [b.bookingCode || b.code || b.reference, b.customerName || b.customer, b.destination]
                  .filter(Boolean)
                  .join(" · ") || b.publicId,
            }))
        );
      })
      .catch(() => setBookingOpts([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setLoading(true);
    fleetService
      .getTrip(publicId)
      .then((t) => {
        if (!alive || !t) return;
        setStatus(t.status);
        reset({
          vehiclePublicId: t.vehiclePublicId ?? "",
          driverPublicId: t.driverPublicId ?? "",
          bookingPublicId: t.bookingPublicId ?? "",
          startDatetime: toDateTimeInput(t.startDatetime) || nowDateTimeInput(),
          endDatetime: toDateTimeInput(t.endDatetime),
          startOdometer: t.startOdometer ?? "",
          endOdometer: t.endOdometer ?? "",
          routeFrom: t.routeFrom ?? "", routeTo: t.routeTo ?? "", purpose: t.purpose ?? "",
          fuelCost: t.fuelCost ?? "", tollCost: t.tollCost ?? "",
          driverAllowance: t.driverAllowance ?? "", remarks: t.remarks ?? "",
        });
      })
      .catch((e) => showToast(errMsg(e, "Failed to load trip."), "error"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [isEdit, publicId, reset, showToast]);

  const onSubmit = async (data) => {
    const common = {
      bookingPublicId: data.bookingPublicId || null,
      startDatetime: data.startDatetime || null,
      endDatetime: data.endDatetime || null,
      startOdometer: toNum(data.startOdometer),
      endOdometer: toNum(data.endOdometer),
      routeFrom: data.routeFrom?.trim() || null,
      routeTo: data.routeTo?.trim() || null,
      purpose: data.purpose?.trim() || null,
      fuelCost: toNum(data.fuelCost),
      tollCost: toNum(data.tollCost),
      driverAllowance: toNum(data.driverAllowance),
      remarks: data.remarks?.trim() || null,
    };

    try {
      if (isEdit) {
        // vehicle/driver only sent when still changeable (PLANNED)
        const payload = lockAssignment
          ? common
          : { ...common, vehiclePublicId: data.vehiclePublicId, driverPublicId: data.driverPublicId };
        await fleetService.updateTrip(publicId, payload);
        showToast("Trip updated successfully.");
        navigate(`/fleet/trips/${publicId}`);
      } else {
        const created = await fleetService.createTrip({
          vehiclePublicId: data.vehiclePublicId,
          driverPublicId: data.driverPublicId,
          ...common,
        });
        showToast(
          created?.status === "COMPLETED"
            ? "Completed trip logged successfully."
            : "Trip planned successfully."
        );
        navigate(created?.publicId ? `/fleet/trips/${created.publicId}` : "/fleet/trips");
      }
    } catch (e) {
      showToast(errMsg(e, "Couldn't save the trip."), "error");
    }
  };

  if (loading) return <PageShell><LoadingState label="Loading trip…" /></PageShell>;

  return (
    <PageShell className="max-w-3xl">
      {toastNode}

      <FormHeader
        backLabel="Trips"
        onBack={() => navigate("/fleet/trips")}
        icon={RouteIcon}
        title={isEdit ? "Edit Trip" : "New Trip"}
        subtitle={isEdit ? "Update trip details." : "Plan a trip, or log a completed one by setting an end time."}
        right={isEdit && status && <StatusBadge config={TRIP_STATUS} value={status} />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormSection title="Assignment" subtitle="Vehicle, driver & booking link" icon={Users}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Vehicle" required error={errors.vehiclePublicId}
              hint={lockAssignment ? "Vehicle can't be changed after the trip starts." : undefined}>
              <Select disabled={lockAssignment} aria-invalid={!!errors.vehiclePublicId}
                {...register("vehiclePublicId", { required: "Vehicle is required" })}>
                <option value="">— Select vehicle —</option>
                {vehicleOpts.map((o) => <option key={o.publicId} value={o.publicId}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Driver" required error={errors.driverPublicId}
              hint={lockAssignment ? "Driver can't be changed after the trip starts." : undefined}>
              <Select disabled={lockAssignment} aria-invalid={!!errors.driverPublicId}
                {...register("driverPublicId", { required: "Driver is required" })}>
                <option value="">— Select driver —</option>
                {driverOpts.map((o) => <option key={o.publicId} value={o.publicId}>{o.label}</option>)}
              </Select>
            </Field>
            <Field className="sm:col-span-2" label="Linked Booking (optional)">
              <Select {...register("bookingPublicId")}>
                <option value="">— None —</option>
                {bookingOpts.map((o) => <option key={o.publicId} value={o.publicId}>{o.label}</option>)}
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Schedule & Route" subtitle="Timing, odometer & route" icon={CalendarClock}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Start Time" required error={errors.startDatetime}>
              <Input type="datetime-local" aria-invalid={!!errors.startDatetime}
                {...register("startDatetime", { required: "Start time is required" })} />
            </Field>
            <Field label="End Time"
              hint={!isEdit ? "Set this to log a completed trip directly." : undefined}>
              <Input type="datetime-local" {...register("endDatetime")} />
            </Field>
            <Field label="Start Odometer (km)" error={errors.startOdometer}>
              <Input type="number" {...register("startOdometer", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="End Odometer (km)" error={errors.endOdometer}>
              <Input type="number" {...register("endOdometer", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Route From"><Input placeholder="Origin" {...register("routeFrom", { maxLength: { value: 150, message: "Max 150 characters" } })} /></Field>
            <Field label="Route To"><Input placeholder="Destination" {...register("routeTo", { maxLength: { value: 150, message: "Max 150 characters" } })} /></Field>
            <Field className="sm:col-span-2" label="Purpose">
              <Input placeholder="Airport transfer, sightseeing…" {...register("purpose", { maxLength: { value: 150, message: "Max 150 characters" } })} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Expenses" subtitle="Optional — recorded when the trip is closed" icon={Receipt}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Fuel Cost (₹)" error={errors.fuelCost}>
              <Input type="number" step="0.01" {...register("fuelCost", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Toll Cost (₹)" error={errors.tollCost}>
              <Input type="number" step="0.01" {...register("tollCost", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Driver Allowance (₹)" error={errors.driverAllowance}>
              <Input type="number" step="0.01" {...register("driverAllowance", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field className="sm:col-span-3" label="Remarks"><Textarea rows={2} {...register("remarks")} /></Field>
          </div>

          {isEdit && status === "PLANNED" && (
            <p className="mt-4 text-xs text-slate-400">
              Tip: use <span className="font-semibold">Start</span> and <span className="font-semibold">Close</span> from the trip list to run the lifecycle and update the vehicle status automatically.
            </p>
          )}
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate("/fleet/trips")} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Trip"}
          </Button>
        </FormActions>
      </form>
    </PageShell>
  );
}