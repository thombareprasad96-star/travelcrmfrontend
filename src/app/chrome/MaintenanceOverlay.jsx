import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Full-screen overlay shown when the backend returns 503 (maintenance mode). It listens for the
// "app:maintenance" event dispatched by the axios 503 handler (shared/api/http.js), and also reads
// a sessionStorage flag on mount so it still appears if the 503 landed before this mounted (e.g.
// the permissions fetch right after a login that happened during maintenance).
const KEY = "app:maintenance";

export default function MaintenanceOverlay() {
  const [state, setState] = useState(() => {
    const m = sessionStorage.getItem(KEY);
    return { open: !!m, message: m || "" };
  });

  useEffect(() => {
    const onMaintenance = (e) => {
      const msg = e.detail?.message || "The application is temporarily under maintenance.";
      sessionStorage.setItem(KEY, msg);
      setState({ open: true, message: msg });
    };
    window.addEventListener("app:maintenance", onMaintenance);
    return () => window.removeEventListener("app:maintenance", onMaintenance);
  }, []);

  if (!state.open) return null;

  const retry = () => {
    sessionStorage.removeItem(KEY); // clear so a reload starts clean; a live 503 re-arms it
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Under maintenance</h2>
        <p className="mt-2 text-sm text-gray-600">{state.message}</p>
        <button
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    </div>
  );
}