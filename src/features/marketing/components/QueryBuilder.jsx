// src/features/marketing/components/QueryBuilder.jsx
// Data-driven segment rule editor. Renders a match-type selector + a list of
// condition rows (field → operator → value). The value input adapts to the
// field's type and the chosen operator. Emits { matchType, conditions }.
import { Plus, Trash2, Filter } from "lucide-react";
import { Select, inputCls, Btn } from "./marketingUi";
import { OPERATOR_LABELS, NO_VALUE_OPERATORS, MULTI_VALUE_OPERATORS, MATCH_TYPES } from "../constants";

const defaultValueFor = (fieldDef, operator) => {
  if (NO_VALUE_OPERATORS.has(operator)) return undefined;
  if (MULTI_VALUE_OPERATORS.has(operator)) return [];
  if (operator === "BETWEEN") return ["", ""];
  return "";
};

export default function QueryBuilder({ fields = [], matchType = "ALL", conditions = [], onChange }) {
  const byField = (f) => fields.find((x) => x.field === f);

  const emit = (mt, conds) => onChange({ matchType: mt, conditions: conds });

  const addCondition = () => {
    const first = fields[0];
    if (!first) return;
    const op = first.operators[0];
    emit(matchType, [...conditions, { field: first.field, operator: op, value: defaultValueFor(first, op) }]);
  };

  const removeCondition = (i) => emit(matchType, conditions.filter((_, idx) => idx !== i));

  const patch = (i, next) => emit(matchType, conditions.map((c, idx) => (idx === i ? next : c)));

  const onFieldChange = (i, fieldKey) => {
    const fd = byField(fieldKey);
    const op = fd.operators[0];
    patch(i, { field: fieldKey, operator: op, value: defaultValueFor(fd, op) });
  };

  const onOperatorChange = (i, operator) => {
    const fd = byField(conditions[i].field);
    patch(i, { ...conditions[i], operator, value: defaultValueFor(fd, operator) });
  };

  return (
    <div className="space-y-3">
      {/* Match type */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Customers who</span>
        <div className="w-64 max-w-full">
          <Select value={matchType} onChange={(e) => emit(e.target.value, conditions)}>
            {MATCH_TYPES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
        </div>
      </div>

      {/* Condition rows */}
      <div className="space-y-2.5">
        {conditions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 py-8 text-center text-sm text-slate-400 font-medium">
            No conditions yet — this segment matches <b>all customers</b>. Add a condition to narrow it.
          </div>
        )}
        {conditions.map((c, i) => {
          const fd = byField(c.field) || fields[0];
          return (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3 flex flex-col lg:flex-row lg:items-start gap-2.5">
              <div className="lg:w-52 shrink-0">
                <Select value={c.field} onChange={(e) => onFieldChange(i, e.target.value)}>
                  {fields.map((f) => <option key={f.field} value={f.field}>{f.label}</option>)}
                </Select>
              </div>
              <div className="lg:w-56 shrink-0">
                <Select value={c.operator} onChange={(e) => onOperatorChange(i, e.target.value)}>
                  {fd.operators.map((op) => <option key={op} value={op}>{OPERATOR_LABELS[op] || op}</option>)}
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <ValueInput fieldDef={fd} operator={c.operator} value={c.value} onChange={(v) => patch(i, { ...c, value: v })} />
              </div>
              <button type="button" onClick={() => removeCondition(i)} title="Remove condition"
                className="w-9 h-9 shrink-0 rounded-lg border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <Btn variant="outline" size="sm" onClick={addCondition}><Plus className="w-4 h-4" /> Add condition</Btn>
    </div>
  );
}

function ValueInput({ fieldDef, operator, value, onChange }) {
  if (NO_VALUE_OPERATORS.has(operator)) {
    return <div className="px-3.5 py-2.5 text-sm text-slate-400 italic">no value needed</div>;
  }

  // ENUM / MONTH with multi-select (IN / NOT_IN) → chip toggles
  if ((fieldDef.type === "ENUM" || fieldDef.type === "MONTH") && MULTI_VALUE_OPERATORS.has(operator)) {
    const selected = Array.isArray(value) ? value.map(String) : [];
    const toggle = (v) => {
      const key = String(v);
      const next = selected.includes(key) ? selected.filter((x) => x !== key) : [...selected, key];
      // preserve numeric type for MONTH
      onChange(fieldDef.type === "MONTH" ? next.map(Number) : next);
    };
    return (
      <div className="flex flex-wrap gap-1.5 py-1">
        {(fieldDef.options || []).map((o) => {
          const on = selected.includes(String(o.value));
          return (
            <button key={o.value} type="button" onClick={() => toggle(o.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${on ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"}`}>
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ENUM / MONTH single-select (EQUALS / NOT_EQUALS)
  if (fieldDef.type === "ENUM" || fieldDef.type === "MONTH") {
    return (
      <Select value={value ?? ""} onChange={(e) => onChange(fieldDef.type === "MONTH" ? Number(e.target.value) : e.target.value)}>
        <option value="">Select…</option>
        {(fieldDef.options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
    );
  }

  // DATE
  if (fieldDef.type === "DATE") {
    if (operator === "BETWEEN") {
      const arr = Array.isArray(value) ? value : ["", ""];
      return (
        <div className="flex items-center gap-2">
          <input type="date" className={inputCls} value={arr[0] || ""} onChange={(e) => onChange([e.target.value, arr[1] || ""])} />
          <span className="text-xs text-slate-400 font-bold">to</span>
          <input type="date" className={inputCls} value={arr[1] || ""} onChange={(e) => onChange([arr[0] || "", e.target.value])} />
        </div>
      );
    }
    return <input type="date" className={inputCls} value={value || ""} onChange={(e) => onChange(e.target.value)} />;
  }

  // TEXT / NUMBER
  return (
    <input className={inputCls} type={fieldDef.type === "NUMBER" ? "number" : "text"}
      value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      placeholder={fieldDef.type === "NUMBER" ? "0" : `Enter ${fieldDef.label.toLowerCase()}…`} />
  );
}