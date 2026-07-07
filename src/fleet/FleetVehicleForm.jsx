// src/fleet/FleetVehicleForm.jsx
// Create / edit a fleet vehicle (one component, both routes).
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Car, Save, IdCard, ShieldCheck, FileText, UserCog } from "lucide-react";

import fleetService from "../services/fleetService";
import {
  Button, Input, Select, Textarea,
  PageShell, LoadingState, FormHeader, FormSection, Field, FormActions,
  useToast, errMsg, OWNER_TYPE, toDateInput,
} from "./fleetUi";

const toNum = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

const BLANK = {
  vehicleNumber: "", type: "", make: "", model: "", year: "", seatingCapacity: "",
  ownerType: "OWN", vendorPublicId: "",
  insuranceExpiry: "", rcExpiry: "", permitExpiry: "", pucExpiry: "", notes: "",
};

export default function FleetVehicleForm() {
  const { publicId } = useParams();
  const isEdit = !!publicId;
  const navigate = useNavigate();
  const { showToast, toastNode } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [vendors, setVendors] = useState([]);

  const {
    register, handleSubmit, reset, watch, formState: { errors, isSubmitting },
  } = useForm({ defaultValues: BLANK });

  const ownerType = watch("ownerType");
  const needsVendor = ownerType === "VENDOR" || ownerType === "RENTED";

  // vendor options for the owner link
  useEffect(() => {
    fleetService.vendorOptions().then(setVendors).catch(() => setVendors([]));
  }, []);

  // load existing vehicle in edit mode
  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setLoading(true);
    fleetService
      .getVehicle(publicId)
      .then((v) => {
        if (!alive || !v) return;
        reset({
          vehicleNumber: v.vehicleNumber ?? "",
          type: v.type ?? "", make: v.make ?? "", model: v.model ?? "",
          year: v.year ?? "", seatingCapacity: v.seatingCapacity ?? "",
          ownerType: v.ownerType ?? "OWN",
          vendorPublicId: v.vendorPublicId ?? "",
          insuranceExpiry: toDateInput(v.insuranceExpiry),
          rcExpiry: toDateInput(v.rcExpiry),
          permitExpiry: toDateInput(v.permitExpiry),
          pucExpiry: toDateInput(v.pucExpiry),
          notes: v.notes ?? "",
        });
      })
      .catch((e) => showToast(errMsg(e, "Failed to load vehicle."), "error"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [isEdit, publicId, reset, showToast]);

  const onSubmit = async (data) => {
    const payload = {
      vehicleNumber: data.vehicleNumber?.trim(),
      type: data.type?.trim() || null,
      make: data.make?.trim() || null,
      model: data.model?.trim() || null,
      year: toNum(data.year),
      seatingCapacity: toNum(data.seatingCapacity),
      ownerType: data.ownerType,
      vendorPublicId: needsVendor ? (data.vendorPublicId || null) : null,
      insuranceExpiry: data.insuranceExpiry || null,
      rcExpiry: data.rcExpiry || null,
      permitExpiry: data.permitExpiry || null,
      pucExpiry: data.pucExpiry || null,
      notes: data.notes?.trim() || null,
    };
    try {
      if (isEdit) {
        await fleetService.updateVehicle(publicId, payload);
        showToast("Vehicle updated successfully.");
        navigate(`/fleet/vehicles/${publicId}`);
      } else {
        const created = await fleetService.createVehicle(payload);
        showToast("Vehicle created successfully.");
        navigate(created?.publicId ? `/fleet/vehicles/${created.publicId}` : "/fleet/vehicles");
      }
    } catch (e) {
      showToast(errMsg(e, "Couldn't save the vehicle."), "error");
    }
  };

  if (loading) return <PageShell><LoadingState label="Loading vehicle…" /></PageShell>;

  return (
    <PageShell className="max-w-3xl">
      {toastNode}

      <FormHeader
        backLabel="Back"
        onBack={() => navigate(-1)}
        icon={Car}
        title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
        subtitle="Register a vehicle in the operational fleet."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormSection title="Identity" subtitle="Registration & specifications" icon={IdCard}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Vehicle Number" required error={errors.vehicleNumber}>
              <Input
                placeholder="MH12 AB 1234"
                aria-invalid={!!errors.vehicleNumber}
                {...register("vehicleNumber", {
                  required: "Vehicle number is required",
                  maxLength: { value: 30, message: "Max 30 characters" },
                })}
              />
            </Field>
            <Field label="Type" error={errors.type}>
              <Input placeholder="SUV, Sedan, Tempo Traveller…" {...register("type", { maxLength: { value: 60, message: "Max 60 characters" } })} />
            </Field>
            <Field label="Make" error={errors.make}>
              <Input placeholder="Toyota" {...register("make", { maxLength: { value: 60, message: "Max 60 characters" } })} />
            </Field>
            <Field label="Model" error={errors.model}>
              <Input placeholder="Innova Crysta" {...register("model", { maxLength: { value: 60, message: "Max 60 characters" } })} />
            </Field>
            <Field label="Year" error={errors.year}>
              <Input
                type="number" placeholder="2022"
                aria-invalid={!!errors.year}
                {...register("year", {
                  min: { value: 1950, message: "Enter a valid year" },
                  max: { value: 2100, message: "Enter a valid year" },
                })}
              />
            </Field>
            <Field label="Seating Capacity" error={errors.seatingCapacity}>
              <Input
                type="number" placeholder="7"
                aria-invalid={!!errors.seatingCapacity}
                {...register("seatingCapacity", { min: { value: 1, message: "Must be at least 1" } })}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Ownership" subtitle="Who the vehicle belongs to" icon={UserCog}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Owner Type" required error={errors.ownerType}>
              <Select {...register("ownerType", { required: true })}>
                {Object.entries(OWNER_TYPE).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </Select>
            </Field>
            {needsVendor && (
              <Field label="Linked Vendor" error={errors.vendorPublicId}>
                <Select {...register("vendorPublicId")}>
                  <option value="">— Select vendor —</option>
                  {vendors.map((o) => (
                    <option key={o.publicId} value={o.publicId}>{o.label}</option>
                  ))}
                </Select>
              </Field>
            )}
          </div>
        </FormSection>

        <FormSection title="Compliance Documents" subtitle="Expiry dates drive dashboard alerts" icon={ShieldCheck}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Insurance Expiry"><Input type="date" {...register("insuranceExpiry")} /></Field>
            <Field label="RC Expiry"><Input type="date" {...register("rcExpiry")} /></Field>
            <Field label="Permit Expiry"><Input type="date" {...register("permitExpiry")} /></Field>
            <Field label="PUC Expiry"><Input type="date" {...register("pucExpiry")} /></Field>
          </div>
        </FormSection>

        <FormSection title="Notes" icon={FileText}>
          <Textarea rows={3} placeholder="Anything worth remembering about this vehicle…" {...register("notes")} />
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Vehicle"}
          </Button>
        </FormActions>
      </form>
    </PageShell>
  );
}