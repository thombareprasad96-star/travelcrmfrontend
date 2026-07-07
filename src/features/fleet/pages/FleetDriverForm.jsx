// src/fleet/FleetDriverForm.jsx
// Create / edit a fleet driver (one component, both routes).
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IdCard, Save } from "lucide-react";

import fleetService from "../api/fleetService";
import {
  Button, Input, Textarea,
  PageShell, LoadingState, FormHeader, FormSection, Field, FormActions,
  useToast, errMsg, toDateInput,
} from "../components/fleetUi";

const BLANK = { name: "", phone: "", licenseNumber: "", licenseExpiry: "", notes: "" };

export default function FleetDriverForm() {
  const { publicId } = useParams();
  const isEdit = !!publicId;
  const navigate = useNavigate();
  const { showToast, toastNode } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: BLANK });

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setLoading(true);
    fleetService
      .getDriver(publicId)
      .then((d) => {
        if (!alive || !d) return;
        reset({
          name: d.name ?? "",
          phone: d.phone ?? "",
          licenseNumber: d.licenseNumber ?? "",
          licenseExpiry: toDateInput(d.licenseExpiry),
          notes: d.notes ?? "",
        });
      })
      .catch((e) => showToast(errMsg(e, "Failed to load driver."), "error"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [isEdit, publicId, reset, showToast]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name?.trim(),
      phone: data.phone?.trim() || null,
      licenseNumber: data.licenseNumber?.trim() || null,
      licenseExpiry: data.licenseExpiry || null,
      notes: data.notes?.trim() || null,
    };
    try {
      if (isEdit) await fleetService.updateDriver(publicId, payload);
      else await fleetService.createDriver(payload);
      showToast(isEdit ? "Driver updated successfully." : "Driver created successfully.");
      navigate("/fleet/drivers");
    } catch (e) {
      showToast(errMsg(e, "Couldn't save the driver."), "error");
    }
  };

  if (loading) return <PageShell><LoadingState label="Loading driver…" /></PageShell>;

  return (
    <PageShell className="max-w-2xl">
      {toastNode}

      <FormHeader
        backLabel="Drivers"
        onBack={() => navigate("/fleet/drivers")}
        icon={IdCard}
        title={isEdit ? "Edit Driver" : "Add Driver"}
        subtitle="Keep licence details up to date for expiry alerts."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormSection title="Driver Details" subtitle="Contact & licence information" icon={IdCard}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Name" required error={errors.name}>
              <Input placeholder="Full name" aria-invalid={!!errors.name}
                {...register("name", { required: "Name is required", maxLength: { value: 150, message: "Max 150 characters" } })} />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <Input placeholder="+91 90000 00000" {...register("phone", { maxLength: { value: 30, message: "Max 30 characters" } })} />
            </Field>
            <Field label="Licence Number" error={errors.licenseNumber}>
              <Input placeholder="MH0120180000000" {...register("licenseNumber", { maxLength: { value: 40, message: "Max 40 characters" } })} />
            </Field>
            <Field label="Licence Expiry">
              <Input type="date" {...register("licenseExpiry")} />
            </Field>
            <Field className="sm:col-span-2" label="Notes">
              <Textarea rows={3} {...register("notes")} />
            </Field>
          </div>
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate("/fleet/drivers")} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Driver"}
          </Button>
        </FormActions>
      </form>
    </PageShell>
  );
}