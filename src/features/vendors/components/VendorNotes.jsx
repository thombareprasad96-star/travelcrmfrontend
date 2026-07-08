// src/components/CreateVendor/VendorNotes.jsx

import { StickyNote as FaRegStickyNote, TriangleAlert as FaExclamationTriangle, TriangleAlert as FiAlertTriangle } from "lucide-react";


export default function VendorNotes({ register }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">📝</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Notes & Special Terms</h2>
          <p className="text-amber-100 text-xs">Internal notes, special conditions & agent instructions</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Internal Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <FaRegStickyNote className="w-3 h-3 text-amber-400" />
            Internal Notes
          </label>
          <p className="text-xs text-slate-400">Special terms, preferences, contact tips, seasonal availability</p>
          <textarea rows={4} {...register("notes")}
            placeholder="Vendor preferences, special terms, peak season availability, group booking conditions, discount structures, important contacts, SLA details..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:ring-2
              focus:ring-amber-50 outline-none transition-all resize-none" />
        </div>

        {/* Special Conditions / Warnings */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <FiAlertTriangle className="w-3 h-3 text-rose-400" />
            Special Conditions / Warnings
          </label>
          <p className="text-xs text-slate-400">Cancellation policies, blackout dates, restrictions</p>
          <textarea rows={3} {...register("specialConditions")}
            placeholder="Cancellation policy: 30 days notice required. No refunds after check-in. Peak season surcharges apply Dec–Jan. Minimum booking 2 nights..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
              text-slate-700 placeholder-slate-400 focus:border-rose-400 focus:ring-2
              focus:ring-rose-50 outline-none transition-all resize-none" />
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 flex items-start gap-3">
          <FaExclamationTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold text-amber-700">For Internal Use Only</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Notes and special conditions entered here are visible only to CRM users and will not be shared with the vendor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}