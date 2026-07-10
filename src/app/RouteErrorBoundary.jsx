// src/app/RouteErrorBoundary.jsx
// Catches render errors — most importantly failed lazy-chunk loads after a
// redeploy (stale index.html referencing old hashed chunks). Reloading fetches
// the fresh manifest, which resolves that case.
//
// The toast host is mounted ABOVE this boundary (see App.jsx), so it survives the tree being
// replaced and can still surface anything raised while the fallback is showing.
import { Component } from "react";

export default class RouteErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  // Without this the crash is swallowed: React logs its own message, but the component stack —
  // the only part that says *where* it broke — is discarded.
  componentDidCatch(error, errorInfo) {
    console.error("Render crash caught by RouteErrorBoundary:", error, errorInfo?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-slate-200/60 bg-white/80 p-6 text-center shadow-sm backdrop-blur-md">
          <p className="mb-1 text-sm font-extrabold text-slate-800">
            Something went wrong loading this page.
          </p>
          <p className="mb-4 text-xs text-slate-500">
            This can happen right after an update. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}