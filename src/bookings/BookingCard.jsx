import { fmtINR, fmtDate } from "../utils";
import { STATUS_STYLE, STATUS_DOT, STATUS_LABEL, PAY_STYLE, PAY_LABEL } from "../constants";

/**
 * Card-layout booking row for mobile viewports.
 *
 * @param {{ b: object, onView: (b: object) => void, onDelete: (id: number) => void }} props
 */
export default function MobileBookingCard({ b, onView, onDelete }) {
  const payPct = b.totalPayable > 0
    ? Math.round((b.paid / b.totalPayable) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">

      {/* ── Top row: code / status / amount ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
              {b.code}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[b.status] ?? ""}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[b.status] ?? ""}`} />
              {STATUS_LABEL[b.status] ?? b.status}
            </span>
          </div>
          <p className="font-bold text-slate-800 text-sm">{b.customer}</p>
          <p className="text-xs text-slate-400 mt-0.5">📍 {b.destination}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold text-slate-800">{fmtINR(b.totalPayable)}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PAY_STYLE[b.payStatus] ?? ""}`}>
            {PAY_LABEL[b.payStatus] ?? b.payStatus}
          </span>
        </div>
      </div>

      {/* ── Service tags ── */}
      <div className="flex flex-wrap gap-1.5">
        {b.services?.map(s => (
          <span key={s} className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
      </div>

      {/* ── Travel date / profit ── */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>📅 {fmtDate(b.travelDate)}</span>
        <span>
          Profit:{" "}
          <span className={b.netProfit >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
            {fmtINR(b.netProfit)}
          </span>
        </span>
      </div>

      {/* ── Payment bar ── */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Payment</span>
          <span>{payPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-500" : "bg-slate-200"
            }`}
            style={{ width: `${payPct}%` }}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onView(b)}
          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
        >
          👁 View
        </button>
        <button className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all">
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(b.id)}
          className="w-9 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 text-xs font-bold transition-all flex items-center justify-center"
        >
          🗑
        </button>
      </div>
    </div>
  );
}