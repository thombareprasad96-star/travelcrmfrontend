import { memo } from "react";

/**
 * AppFooter
 *
 * Generic application footer. Stateless, pure presentational.
 *
 * @param {string} appName  - Displayed product name (e.g. "TravelCRM")
 * @param {string} version  - Release version string (e.g. "1.0.0")
 * @param {number} year     - Copyright year. Defaults to current year.
 */
function AppFooter({ appName = "TravelCRM", version = "1.0.0", year = new Date().getFullYear() }) {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* ── Left Side: Copyright & Brand ── */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[13px] text-slate-500 font-medium">
          <span>Copyright © {year}</span>
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-extrabold tracking-tight">
            {appName}
          </span>
          <span>. All rights reserved.</span>
        </div>

        {/* ── Right Side: Version & Status Indicator ── */}
        <div className="flex items-center gap-3">
          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm cursor-default hover:bg-slate-100 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              System Live
            </span>
          </div>

          {/* Version Divider & Text */}
          <div className="h-4 w-px bg-slate-300"></div>
          <p className="text-[13px] text-slate-400 font-bold hover:text-blue-600 transition-colors cursor-pointer">
            v{version}
          </p>
        </div>

      </div>
    </footer>
  );
}

export default memo(AppFooter);