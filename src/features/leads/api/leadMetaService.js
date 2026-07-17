// src/features/leads/api/leadMetaService.js
//
// Reference vocabulary for the lead forms, served from the backend enum.
//
// Why this file exists: LeadInformation.jsx used to hardcode 8 lead-source strings while the
// backend enum had 9, and now has 25. A lead carrying a source the list doesn't know renders as a
// blank select — the user believes the field is unset, picks something, and overwrites a source
// that was already correct. Serving the list from LeadSource.values() means it can never drift.

import API from "@shared/api/http";

// Module-level in-flight promise, deliberately NOT localStorage.
//
// access.js caches userPermissions/tenantModules in localStorage because hasPermission() is called
// synchronously during first render by the router Guard and the Sidebar — it cannot await. Nothing
// here has that constraint; every consumer already async-loads its lead. localStorage would buy one
// request per hard reload and cost permanent staleness: a deploy that adds a constant would leave
// browsers holding a stale catalog forever, reintroducing the exact orphan bug for the new value.
// ~25 rows is not a hot path.
let cache = null;

/** Every LeadSource — selectable and not. Resolves to `[{value, label, code, selectability}]`. */
export const getLeadSourceCatalog = () =>
  (cache ??= API.get("/leads/meta/sources")
    .then((r) => r.data.data)
    .catch((e) => {
      cache = null; // never cache a rejection — a transient 500 must not poison the session
      throw e;
    }));

/** Test seam / post-deploy escape hatch. Not called in normal operation. */
export const clearLeadSourceCatalogCache = () => {
  cache = null;
};
