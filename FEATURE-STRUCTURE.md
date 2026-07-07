# Feature migration checklist

Reference implementation: `src/features/fleet/` (migrated in Phase 2).
One feature = one PR, merged before the next feature starts.
Migration order (independent → tangled): trash → subscription → tenant →
dashboard → settings → reports → reminders → masters → customers → vendors →
profile → quotation → bookings → leads.

## Target layout

```
src/features/<name>/
  index.js        # public API — the ONLY thing other code may import
  pages/          # routed screens (default exports)
  components/     # feature-internal components, modals, ui kits
  api/            # this domain's services (moved from src/services/)
  hooks/          # feature-internal hooks (only if the feature has them)
  constants.js    # feature-internal constants (only if it has them)
```

## Steps (in commit order)

1. **Strip dead code — its own commit, BEFORE the move.**
   - Delete commented-out clone blocks (most old files carry 1–2 full
     commented copies of themselves; active imports often start mid-file).
     Verify the deleted range is only comments/blank lines first:
     `awk 'NR<START && $0 !~ /^[[:space:]]*(\/\/.*)?$/' file`
   - Delete files nothing imports (check the scan report / grep first).
   - `npm run build` must stay green; commit as `chore: strip dead code from <feature>`.

2. **Move files with `git mv`** (preserves history) into the layout above.
   - The feature's services move from `src/services/` into `api/`.
   - A component used by exactly one feature moves INTO that feature —
     even if it currently lives in `src/components/`.

3. **Create `index.js`** exporting the routed pages (and any component/api
   another feature legitimately consumes — e.g. bookings exports
   `bookingService`; quotation exports `QuotationWebView`).

4. **Rewire ONLY the imports the move broke.** Working relative imports that
   still resolve are left alone — no mass alias conversion.
   - Inside the feature: relative (`../api/xService`, `../components/X`).
   - Feature → shared infra: `@shared/api/http`, `@shared/lib/access`, `@shared/lib/cn`.
   - Feature → not-yet-migrated code: `@/services/...`, `@/components/...`.
   - Feature → another migrated feature: `@features/<name>` (index only).
   - `App.jsx`: one named-import block from `@features/<name>`.
   - **Normalize import casing while rewiring** (`./ui` → `./Ui`,
     `./constants` → `./Constants`): case-mismatches only work on Windows
     and will break any Linux CI. A rename you touch is a rename you fix.

5. **Consolidate the domain's axios usage** into `@shared/api/http` if its
   services build their own `axios.create`.
   - ⚠ Seven services read `localStorage.getItem("authToken")` — a key
     nothing sets. Consolidating silently fixes that bug: make it a clearly
     labeled `fix:` commit (or call it out in the PR body), never bury it.

## Verify (all must pass before the PR)

```
npm run build     # green
npm run lint      # problem count <= the 454 baseline (ratchet — no NEW problems)
npm run dev       # boots; click through the feature's screens
```

Design system is untouchable: gradient bg, glass cards, blue-600,
Plus Jakarta Sans. Zero behavior change (except a labeled authToken fix).

## Done means

- [ ] dead-code commit separate from the move commit
- [ ] all files under `features/<name>/`, moved with `git mv`
- [ ] `index.js` is the only cross-feature entry point
- [ ] no import outside the feature reaches into its subfolders
- [ ] only move-broken imports rewired; casing normalized on touched lines
- [ ] build green, lint ≤ baseline, feature screens smoke-tested
- [ ] PR merged to main before the next feature starts
