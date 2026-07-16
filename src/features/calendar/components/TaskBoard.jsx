// features/calendar/components/TaskBoard.jsx
// Kanban board over /api/tasks — columns TODO / IN PROGRESS / DONE. Move a card with its status
// dropdown; click a card to edit. Cancelled tasks are hidden.
import { useEffect, useState, useCallback } from "react";
import { Loader2, Plus, CalendarClock, User2 } from "lucide-react";
import { toast } from "@shared/ui/toast";
import taskService from "../api/taskService";
import {
  BOARD_COLUMNS, TASK_STATUS_LABEL, TASK_STATUSES, PRIORITY_META, CATEGORY_LABEL, fmtDayLabel,
} from "../lib/calendarUi";

const COLUMN_ACCENT = {
  TODO: "border-t-slate-400",
  IN_PROGRESS: "border-t-blue-500",
  DONE: "border-t-emerald-500",
};

export default function TaskBoard({ reloadKey, onEdit, onAdd }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    taskService.list()
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Could not load tasks."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load, reloadKey]);

  const move = async (task, status) => {
    if (status === task.status) return;
    const prev = tasks;
    setTasks((ts) => ts.map((t) => (t.publicId === task.publicId ? { ...t, status } : t)));
    try {
      await taskService.changeStatus(task.publicId, status);
    } catch (err) {
      setTasks(prev);
      toast.error(err?.response?.data?.message || "Could not move the task.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400"><Loader2 className="animate-spin" /></div>;
  }

  const byStatus = (s) => tasks.filter((t) => t.status === s);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {BOARD_COLUMNS.map((col) => {
        const items = byStatus(col);
        return (
          <div key={col} className={`rounded-2xl border-t-4 bg-slate-50/70 p-3 ${COLUMN_ACCENT[col]}`}>
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-700">{TASK_STATUS_LABEL[col]}</h3>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">{items.length}</span>
                {col === "TODO" && (
                  <button onClick={onAdd} className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-blue-600" title="Add task">
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {items.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-400">Nothing here</p>}
              {items.map((t) => {
                const pr = PRIORITY_META[t.priority] || PRIORITY_META.MEDIUM;
                return (
                  <div key={t.publicId} className="group rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
                    <button onClick={() => onEdit?.(t)} className="mb-2 block w-full text-left text-sm font-semibold text-slate-800 hover:text-blue-600">
                      {t.title}
                    </button>
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${pr.chip}`}>{pr.label}</span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{CATEGORY_LABEL[t.category] || t.category}</span>
                      {t.overdue && <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">Overdue</span>}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 truncate">
                        <User2 size={12} />{t.assignToName || "Unassigned"}
                      </span>
                      {(t.dueDate || t.startAt) && (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <CalendarClock size={12} />{fmtDayLabel(t.dueDate || t.startAt)}
                        </span>
                      )}
                    </div>
                    <select
                      value={t.status}
                      onChange={(e) => move(t, e.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 focus:border-blue-400 focus:outline-none"
                    >
                      {TASK_STATUSES.map((s) => <option key={s} value={s}>{TASK_STATUS_LABEL[s]}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}