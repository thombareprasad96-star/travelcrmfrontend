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
function AppFooter({ appName, version, year = new Date().getFullYear() }) {
  return (
    <footer className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-xs text-slate-400">
        Copyright © {year}{" "}
        <span className="text-blue-600 font-bold">{appName}</span>. All rights reserved.
      </p>
      <p className="text-xs text-slate-400 font-semibold">Version {version}</p>
    </footer>
  );
}

export default memo(AppFooter);