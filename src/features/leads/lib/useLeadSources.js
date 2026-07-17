// src/features/leads/lib/useLeadSources.js
//
// The lead-source dropdown's options, fetched from the backend enum.
//
// Returns { catalog, selectable, loading, error, withCurrent, labelFor }.

import { useEffect, useState } from "react";
import { getLeadSourceCatalog } from "../api/leadMetaService";

export function useLeadSources() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getLeadSourceCatalog()
      .then((rows) => {
        if (!alive) return;
        setCatalog(Array.isArray(rows) ? rows : []);
        setError(null);
      })
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // What a human may pick. MACHINE_ONLY is excluded on purpose: a person hand-tagging a lead
  // "JustDial" would make attribution a lie — there is no integration row behind it.
  // LEGACY_READ_ONLY is excluded for the same reason, one vintage later.
  const selectable = catalog.filter((o) => o.selectability === "MANUAL_SELECTABLE");

  const labelFor = (value) => catalog.find((o) => o.value === value)?.label;

  /**
   * The options to render, given the value the lead currently holds.
   *
   * A lead whose source is MACHINE_ONLY or LEGACY_READ_ONLY matches nothing in `selectable`, so its
   * value is prepended as an option — otherwise the select renders blank and the user "fixes" a
   * field that was already right.
   *
   * The orphan is NOT disabled, matching AllLeads.jsx:479 (`STAGES.includes(lead.leadStage) ?
   * STAGES : [lead.leadStage, ...STAGES]`), which prepends a plain selectable option. A JustDial
   * lead re-tagged by hand therefore cannot be tagged back — correct, and the product consequence
   * of MACHINE_ONLY meaning what it says.
   *
   * While `loading`, the catalog is empty and `selectable.some(...)` is false, so the current value
   * is still synthesized as an option. That is the point: with `register` (uncontrolled), RHF's
   * _formValues already holds the right string, and rendering its option late leaves the UI lying
   * about state that is fine.
   */
  const withCurrent = (current) => {
    if (!current) return selectable;
    if (selectable.some((o) => o.value === current)) return selectable;
    return [{ value: current, label: labelFor(current) ?? current, orphan: true }, ...selectable];
  };

  return { catalog, selectable, loading, error, withCurrent, labelFor };
}
