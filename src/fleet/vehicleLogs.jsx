// src/fleet/vehicleLogs.jsx
// Fuel + Maintenance diary panels shown inside the vehicle detail page.
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Fuel, Wrench, Plus, Pencil, Trash2 } from "lucide-react";

import fleetService from "../services/fleetService";
import CommonPagination from "../components/CommanPegination";
import {
  Button, Input, Textarea, Label,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  GlassCard, LoadingState, EmptyState, ConfirmDialog, errMsg,
  fmtDate, fmtMoney, fmtNumber, toDateInput, todayDateInput,
} from "./fleetUi";

const toNum = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

function Field({ label, required, error, children }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error.message}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FUEL LOGS
═══════════════════════════════════════════════════════════════ */
export function FuelLogsPanel({ vehiclePublicId, canCreate, canUpdate, canDelete, showToast, onChange }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | logObject
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fleetService.listFuelLogs(vehiclePublicId, { page, size });
      setItems(res.items);
      setPagination(res.pagination);
    } catch (e) {
      showToast(errMsg(e, "Failed to load fuel logs."), "error");
    } finally {
      setLoading(false);
    }
  }, [vehiclePublicId, page, size, showToast]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await fleetService.deleteFuelLog(deleteTarget.publicId);
      showToast("Fuel log moved to Trash.");
      setDeleteTarget(null);
      await load();
      onChange?.();
    } catch (e) {
      showToast(errMsg(e, "Failed to delete fuel log."), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Fuel className="h-4 w-4 text-blue-500" /> Fuel Diary
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setEditing("new")}><Plus /> Add Entry</Button>
        )}
      </div>

      {loading ? (
        <LoadingState label="Loading fuel logs…" />
      ) : items.length === 0 ? (
        <EmptyState icon={Fuel} title="No fuel entries yet" hint="Log fill-ups to track cost and mileage." />
      ) : (
        <Table className="fleet-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Litres</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Odometer</TableHead>
              <TableHead>Notes</TableHead>
              {(canUpdate || canDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((l) => (
              <TableRow key={l.publicId}>
                <TableCell className="font-medium">{fmtDate(l.date)}</TableCell>
                <TableCell>{fmtNumber(l.liters, " L")}</TableCell>
                <TableCell>{fmtMoney(l.cost)}</TableCell>
                <TableCell>{fmtNumber(l.odometer, " km")}</TableCell>
                <TableCell className="max-w-[16rem] truncate text-slate-500">{l.notes || "—"}</TableCell>
                {(canUpdate || canDelete) && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {canUpdate && (
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing(l)}>
                          <Pencil />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" title="Delete"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(l)}>
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && items.length > 0 && (
        <CommonPagination
          pageIndex={pagination?.page ?? 0}
          pageSize={pagination?.size ?? size}
          totalElements={pagination?.totalElements ?? items.length}
          totalPages={pagination?.totalPages ?? 1}
          goToPage={setPage}
          changePageSize={(s) => { setSize(s); setPage(0); }}
        />
      )}

      {editing && (
        <FuelLogDialog
          vehiclePublicId={vehiclePublicId}
          log={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); onChange?.(); }}
          showToast={showToast}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete fuel log?"
        description="This fuel entry will be moved to Trash."
        confirmLabel="Move to Trash"
        busy={busy}
        onConfirm={confirmDelete}
      />
    </GlassCard>
  );
}

function FuelLogDialog({ vehiclePublicId, log, onClose, onSaved, showToast }) {
  const isEdit = !!log;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      date: toDateInput(log?.date) || todayDateInput(),
      liters: log?.liters ?? "",
      cost: log?.cost ?? "",
      odometer: log?.odometer ?? "",
      notes: log?.notes ?? "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      date: data.date,
      liters: toNum(data.liters),
      cost: toNum(data.cost),
      odometer: toNum(data.odometer),
      notes: data.notes?.trim() || null,
    };
    try {
      if (isEdit) await fleetService.updateFuelLog(log.publicId, payload);
      else await fleetService.addFuelLog(vehiclePublicId, payload);
      showToast(isEdit ? "Fuel log updated." : "Fuel log added.");
      await onSaved();
    } catch (e) {
      showToast(errMsg(e, "Couldn't save fuel log."), "error");
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader><DialogTitle>{isEdit ? "Edit Fuel Entry" : "Add Fuel Entry"}</DialogTitle></DialogHeader>
          <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date" required error={errors.date}>
              <Input type="date" aria-invalid={!!errors.date} {...register("date", { required: "Date is required" })} />
            </Field>
            <Field label="Litres" required error={errors.liters}>
              <Input type="number" step="0.01" placeholder="35.5" aria-invalid={!!errors.liters}
                {...register("liters", { required: "Litres is required", min: { value: 0.001, message: "Must be greater than 0" } })} />
            </Field>
            <Field label="Cost (₹)" required error={errors.cost}>
              <Input type="number" step="0.01" placeholder="3600" aria-invalid={!!errors.cost}
                {...register("cost", { required: "Cost is required", min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Odometer (km)" error={errors.odometer}>
              <Input type="number" placeholder="45210"
                {...register("odometer", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes"><Textarea rows={2} {...register("notes")} /></Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAINTENANCE LOGS
═══════════════════════════════════════════════════════════════ */
export function MaintenanceLogsPanel({ vehiclePublicId, canCreate, canUpdate, canDelete, showToast, onChange }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fleetService.listMaintenanceLogs(vehiclePublicId, { page, size });
      setItems(res.items);
      setPagination(res.pagination);
    } catch (e) {
      showToast(errMsg(e, "Failed to load maintenance logs."), "error");
    } finally {
      setLoading(false);
    }
  }, [vehiclePublicId, page, size, showToast]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await fleetService.deleteMaintenanceLog(deleteTarget.publicId);
      showToast("Maintenance log moved to Trash.");
      setDeleteTarget(null);
      await load();
      onChange?.();
    } catch (e) {
      showToast(errMsg(e, "Failed to delete maintenance log."), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Wrench className="h-4 w-4 text-amber-500" /> Maintenance Diary
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setEditing("new")}><Plus /> Add Entry</Button>
        )}
      </div>

      {loading ? (
        <LoadingState label="Loading maintenance logs…" />
      ) : items.length === 0 ? (
        <EmptyState icon={Wrench} title="No maintenance entries yet" hint="Log services to track cost and the next due date." />
      ) : (
        <Table className="fleet-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Garage</TableHead>
              <TableHead>Next Due</TableHead>
              {(canUpdate || canDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((l) => (
              <TableRow key={l.publicId}>
                <TableCell className="font-medium">{fmtDate(l.serviceDate)}</TableCell>
                <TableCell>{l.serviceType}</TableCell>
                <TableCell>{fmtMoney(l.cost)}</TableCell>
                <TableCell className="text-slate-500">{l.vendorName || "—"}</TableCell>
                <TableCell className="text-slate-500">
                  {l.nextServiceDueDate ? fmtDate(l.nextServiceDueDate) : "—"}
                  {l.nextServiceDueKm ? ` · ${fmtNumber(l.nextServiceDueKm, " km")}` : ""}
                </TableCell>
                {(canUpdate || canDelete) && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {canUpdate && (
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing(l)}>
                          <Pencil />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" title="Delete"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(l)}>
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && items.length > 0 && (
        <CommonPagination
          pageIndex={pagination?.page ?? 0}
          pageSize={pagination?.size ?? size}
          totalElements={pagination?.totalElements ?? items.length}
          totalPages={pagination?.totalPages ?? 1}
          goToPage={setPage}
          changePageSize={(s) => { setSize(s); setPage(0); }}
        />
      )}

      {editing && (
        <MaintenanceLogDialog
          vehiclePublicId={vehiclePublicId}
          log={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await load(); onChange?.(); }}
          showToast={showToast}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete maintenance log?"
        description="This maintenance entry will be moved to Trash."
        confirmLabel="Move to Trash"
        busy={busy}
        onConfirm={confirmDelete}
      />
    </GlassCard>
  );
}

function MaintenanceLogDialog({ vehiclePublicId, log, onClose, onSaved, showToast }) {
  const isEdit = !!log;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      serviceDate: toDateInput(log?.serviceDate) || todayDateInput(),
      serviceType: log?.serviceType ?? "",
      cost: log?.cost ?? "",
      vendorName: log?.vendorName ?? "",
      odometer: log?.odometer ?? "",
      nextServiceDueDate: toDateInput(log?.nextServiceDueDate),
      nextServiceDueKm: log?.nextServiceDueKm ?? "",
      notes: log?.notes ?? "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      serviceDate: data.serviceDate,
      serviceType: data.serviceType?.trim(),
      cost: toNum(data.cost),
      vendorName: data.vendorName?.trim() || null,
      odometer: toNum(data.odometer),
      nextServiceDueDate: data.nextServiceDueDate || null,
      nextServiceDueKm: toNum(data.nextServiceDueKm),
      notes: data.notes?.trim() || null,
    };
    try {
      if (isEdit) await fleetService.updateMaintenanceLog(log.publicId, payload);
      else await fleetService.addMaintenanceLog(vehiclePublicId, payload);
      showToast(isEdit ? "Maintenance log updated." : "Maintenance log added.");
      await onSaved();
    } catch (e) {
      showToast(errMsg(e, "Couldn't save maintenance log."), "error");
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader><DialogTitle>{isEdit ? "Edit Maintenance Entry" : "Add Maintenance Entry"}</DialogTitle></DialogHeader>
          <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Service Date" required error={errors.serviceDate}>
              <Input type="date" aria-invalid={!!errors.serviceDate} {...register("serviceDate", { required: "Service date is required" })} />
            </Field>
            <Field label="Service Type" required error={errors.serviceType}>
              <Input placeholder="Oil change, tyre rotation…" aria-invalid={!!errors.serviceType}
                {...register("serviceType", { required: "Service type is required", maxLength: { value: 100, message: "Max 100 characters" } })} />
            </Field>
            <Field label="Cost (₹)" error={errors.cost}>
              <Input type="number" step="0.01" {...register("cost", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Garage / Workshop" error={errors.vendorName}>
              <Input placeholder="Free text" {...register("vendorName", { maxLength: { value: 150, message: "Max 150 characters" } })} />
            </Field>
            <Field label="Odometer (km)" error={errors.odometer}>
              <Input type="number" {...register("odometer", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <Field label="Next Service Due (date)">
              <Input type="date" {...register("nextServiceDueDate")} />
            </Field>
            <Field label="Next Service Due (km)" error={errors.nextServiceDueKm}>
              <Input type="number" {...register("nextServiceDueKm", { min: { value: 0, message: "Can't be negative" } })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes"><Textarea rows={2} {...register("notes")} /></Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}