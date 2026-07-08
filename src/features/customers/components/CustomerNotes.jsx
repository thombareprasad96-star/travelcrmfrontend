

import { StickyNote as FaRegStickyNote } from "lucide-react";

export default function CustomerNotes({ register }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">📝</div>
        <div>
          <h2 className="text-white font-extrabold text-base">Preferences & Notes</h2>
          <p className="text-amber-100 text-xs">Travel preferences, special requirements & agent notes</p>
        </div>
      </div>

      <div className="p-6">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          <FaRegStickyNote className="w-3 h-3 text-amber-400" />
          Travel Preferences & Notes
        </label>
        <p className="text-xs text-slate-400 mb-2">
          Meal preferences, seat choices, hotel preferences, favourite destinations, budget range
        </p>
        <textarea
          rows={5}
          {...register("notes")}
          placeholder="Customer preferences, special requirements, dietary needs, seat preferences, favourite destinations, hotel preferences, budget range, travel style, etc."
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
            text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:ring-2
            focus:ring-amber-50 outline-none transition-all resize-none"
        />
      </div>
    </div>
  );
}