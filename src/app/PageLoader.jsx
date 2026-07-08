// src/app/PageLoader.jsx
// Suspense fallback while a route chunk downloads (Phase 5b lazy loading).
// Matches the app's design system: glass card, blue-600 accent.
export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm font-semibold text-slate-600">Loading…</span>
      </div>
    </div>
  );
}
