import { fmtINR, fmtDate } from "./utils";
import { STATUS_STYLE, STATUS_DOT, STATUS_LABEL, PAY_STYLE, PAY_LABEL } from "./constants";

/**
 * Build the TanStack column definitions for the bookings table.
 *
 * Accepting handlers as a parameter (rather than closing over them)
 * keeps this factory pure and means React.useMemo deps stay explicit.
 *
 * @param {{ onView: fn, onEdit: fn, onDelete: fn }} handlers
 */
export function buildColumns({ onView, onEdit, onDelete }) {
  return [
    // ── Checkbox ──────────────────────────────────────────────────────────
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
        />
      ),
      enableSorting: false,
      size: 40,
    },

    // ── Booking code ──────────────────────────────────────────────────────
    {
      accessorKey: "code",
      header: "Booking Code",
      cell: ({ getValue }) => (
        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
          {getValue()}
        </span>
      ),
    },

    // ── Customer ──────────────────────────────────────────────────────────
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-bold text-slate-700">{row.original.customer}</p>
          <p className="text-xs text-slate-400">{row.original.createdBy}</p>
        </div>
      ),
    },

    // ── Destination + services ────────────────────────────────────────────
    {
      accessorKey: "destination",
      header: "Destination",
      cell: ({ row }) => {
        const { destination, services = [] } = row.original;
        return (
          <div>
            <p className="text-xs font-semibold text-slate-600">{destination}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {services.slice(0, 2).map(s => (
                <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
              ))}
              {services.length > 2 && (
                <span className="text-xs text-slate-400">+{services.length - 2}</span>
              )}
            </div>
          </div>
        );
      },
      enableSorting: false,
    },

    // ── Travel date ───────────────────────────────────────────────────────
    {
      accessorKey: "travelDate",
      header: "Travel Date",
      cell: ({ getValue }) => (
        <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">
          {fmtDate(getValue())}
        </span>
      ),
    },

    // ── Customer amount ───────────────────────────────────────────────────
    {
      accessorKey: "customerAmount",
      header: () => <span className="block text-right">Amount</span>,
      cell: ({ getValue }) => (
        <p className="text-sm font-bold text-slate-700 text-right">{fmtINR(getValue())}</p>
      ),
    },

    // ── GST ───────────────────────────────────────────────────────────────
    {
      accessorKey: "gst",
      header: () => <span className="block text-right">GST</span>,
      cell: ({ getValue }) => (
        <p className="text-xs text-slate-500 text-right">{fmtINR(getValue())}</p>
      ),
      enableSorting: false,
    },

    // ── TCS ───────────────────────────────────────────────────────────────
    {
      accessorKey: "tcs",
      header: () => <span className="block text-right">TCS</span>,
      cell: ({ getValue }) => (
        <p className="text-xs text-slate-500 text-right">{fmtINR(getValue())}</p>
      ),
      enableSorting: false,
    },

    // ── Total payable + mini progress bar ─────────────────────────────────
    {
      accessorKey: "totalPayable",
      header: () => <span className="block text-right">Total</span>,
      cell: ({ row }) => {
        const { totalPayable, paid } = row.original;
        const payPct = totalPayable > 0 ? Math.round((paid / totalPayable) * 100) : 0;
        return (
          <div className="text-right">
            <p className="text-sm font-extrabold text-slate-800">{fmtINR(totalPayable)}</p>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  payPct === 100 ? "bg-green-500" : payPct > 0 ? "bg-blue-400" : "bg-slate-200"
                }`}
                style={{ width: `${payPct}%` }}
              />
            </div>
          </div>
        );
      },
    },

    // ── Payment status ────────────────────────────────────────────────────
    {
      accessorKey: "payStatus",
      header: "Payment",
      cell: ({ getValue }) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PAY_STYLE[getValue()] ?? ""}`}>
          {PAY_LABEL[getValue()] ?? getValue()}
        </span>
      ),
      enableSorting: false,
    },

    // ── Net profit ────────────────────────────────────────────────────────
    {
      accessorKey: "netProfit",
      header: () => <span className="block text-right">Net Profit</span>,
      cell: ({ getValue }) => (
        <span className={`text-sm font-extrabold block text-right ${getValue() >= 0 ? "text-green-600" : "text-red-500"}`}>
          {fmtINR(getValue())}
        </span>
      ),
    },

    // ── Booking status ────────────────────────────────────────────────────
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[getValue()] ?? ""}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[getValue()] ?? ""}`} />
          {STATUS_LABEL[getValue()] ?? getValue()}
        </span>
      ),
    },

    // ── Row actions ───────────────────────────────────────────────────────
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(row.original)}
            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-sm transition-all"
            title="View"
          >
            👁
          </button>
          <button
            onClick={() => onEdit?.(row.original)}
            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center text-sm transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center text-sm transition-all"
            title="Delete"
          >
            🗑
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}