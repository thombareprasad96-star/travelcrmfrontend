import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Trash2, RotateCcw, Sparkles } from "lucide-react";
import { useConsoleTheme } from "../theme/ConsoleThemeProvider";

/* Live Design-Token editor. Pick a brand colour (or a preset) and the whole console
   recolours instantly — the accent family + gradient are written as inline CSS custom
   properties on the `.sa-console` root (they win over the token rules), and persisted
   per-browser via the theme provider. Toggle the theme in the header to check both modes.
   All class names below are literal so the Tailwind v4 scanner emits the utilities. */

const DEFAULT_BASE = "#7c3aed";
const DEFAULT_TO = "#db2777";
const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);

// ── tiny colour maths (linear RGB mix) ──────────────────────────────────────
const hexToRgb = (h) => {
  let s = h.replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const to2 = (x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0");
const rgbToHex = ([r, g, b]) => `#${to2(r)}${to2(g)}${to2(b)}`;
const mix = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A.map((v, i) => v + (B[i] - v) * t)); };
const rgba = (hex, a) => { const [r, g, b] = hexToRgb(hex); return `rgb(${r} ${g} ${b} / ${a})`; };

// Derive the whole accent family from a single brand colour. soft-bg is translucent so
// it reads correctly in BOTH light and dark (the override applies to both modes).
function familyFrom(base, to) {
  return {
    "--sa-accent": base,
    "--sa-accent-hover": mix(base, "#000000", 0.14),
    "--sa-accent-soft-bg": rgba(base, 0.14),
    "--sa-accent-soft-txt": base,
    "--sa-focus-ring": mix(base, "#ffffff", 0.22),
    "--sa-gradient": `linear-gradient(135deg, ${base} 0%, ${to} 100%)`,
  };
}
const parseTo = (g) => {
  const m = typeof g === "string" ? g.match(/#[0-9a-fA-F]{6}/g) : null;
  return m && m[1] ? m[1] : null;
};

const PRESETS = [
  { name: "Violet",  base: "#7c3aed", to: "#db2777" },
  { name: "Indigo",  base: "#4f46e5", to: "#7c3aed" },
  { name: "Emerald", base: "#059669", to: "#0891b2" },
  { name: "Teal",    base: "#0d9488", to: "#0284c7" },
  { name: "Rose",    base: "#e11d48", to: "#db2777" },
  { name: "Amber",   base: "#d97706", to: "#db2777" },
];

// ── live-preview reference data ─────────────────────────────────────────────
const SURFACES = [
  { name: "bg-page", cls: "bg-page" },
  { name: "bg-surface", cls: "bg-surface" },
  { name: "bg-surface-hover", cls: "bg-surface-hover" },
  { name: "bg-accent", cls: "bg-accent" },
  { name: "bg-accent-hover", cls: "bg-accent-hover" },
  { name: "bg-accent-soft", cls: "bg-accent-soft" },
];
const HUES = [
  { name: "indigo", cls: "bg-hue-indigo-soft text-hue-indigo" },
  { name: "emerald", cls: "bg-hue-emerald-soft text-hue-emerald" },
  { name: "amber", cls: "bg-hue-amber-soft text-hue-amber" },
  { name: "sky", cls: "bg-hue-sky-soft text-hue-sky" },
  { name: "violet", cls: "bg-hue-violet-soft text-hue-violet" },
  { name: "rose", cls: "bg-hue-rose-soft text-hue-rose" },
];
const TEXTS = [
  { name: "text-heading", cls: "text-heading" },
  { name: "text-body", cls: "text-body" },
  { name: "text-muted", cls: "text-muted" },
  { name: "text-accent", cls: "text-accent" },
];
const PILLS = [
  { label: "ACTIVE", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
  { label: "TRIAL", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
  { label: "SUSPENDED", cls: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" },
  { label: "EXPIRED", cls: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20" },
];

function Section({ title, subtitle, children }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-heading">{title}</h2>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function ColorField({ label, hint, value, onChange }) {
  const safe = isHex(value) ? value : "#000000";
  return (
    <div className="rounded-xl border border-border bg-page p-3">
      <div className="flex items-center gap-3">
        <label className="relative h-10 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border-strong">
          <span className="absolute inset-0" style={{ background: safe }} />
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-heading">{label}</div>
          <div className="truncate text-xs text-muted">{hint}</div>
        </div>
        <input
          type="text"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded-lg border border-border bg-surface px-2 py-1.5 text-center font-mono text-xs text-heading focus:border-focus focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function Palette() {
  const { brand, setBrand, resetBrand } = useConsoleTheme();

  const base = brand["--sa-accent"] || DEFAULT_BASE;
  const gradTo = parseTo(brand["--sa-gradient"]) || DEFAULT_TO;
  const customized = Object.keys(brand || {}).length > 0;

  // Local mirrors so the hex fields can be typed freely; synced when brand changes (presets/reset).
  const [baseHex, setBaseHex] = useState(base);
  const [toHex, setToHex] = useState(gradTo);
  useEffect(() => setBaseHex(base), [base]);
  useEffect(() => setToHex(gradTo), [gradTo]);

  const apply = (b, t) => setBrand(familyFrom(b, t));
  const onBase = (v) => { setBaseHex(v); if (isHex(v)) apply(v, gradTo); };
  const onTo = (v) => { setToHex(v); if (isHex(v)) apply(base, v); };
  const reset = () => { resetBrand(); setBaseHex(DEFAULT_BASE); setToHex(DEFAULT_TO); };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-heading">Design Tokens</h1>
          <p className="mt-1 max-w-2xl text-sm text-body">
            Pick a brand colour and the whole console recolours live — sidebar, buttons, KPI accents,
            charts. Changes save in this browser. Flip the theme toggle in the header to check light &amp; dark.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={!customized}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-body transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      {/* ── Editor ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--sa-card-shadow)]">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--sa-card-shadow)]"
            style={{ backgroundImage: "var(--sa-gradient)" }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="bg-clip-text text-lg font-bold text-transparent" style={{ backgroundImage: "var(--sa-gradient)" }}>
              Platform Console
            </div>
            <div className="text-xs text-muted">{customized ? "Custom brand · saved in this browser" : "Default violet"}</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField label="Brand accent" hint="Buttons, active nav, links, KPI accents" value={baseHex} onChange={onBase} />
          <ColorField label="Gradient end" hint="Logo, wordmark & hero gradients" value={toHex} onChange={onTo} />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Sparkles size={13} /> Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = base.toLowerCase() === p.base.toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => apply(p.base, p.to)}
                  title={p.name}
                  className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-semibold transition-colors ${
                    active ? "border-accent bg-accent-soft text-accent-soft-text" : "border-border text-body hover:bg-surface-hover"
                  }`}
                >
                  <span className="h-5 w-5 rounded-full" style={{ backgroundImage: `linear-gradient(135deg, ${p.base}, ${p.to})` }} />
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Live preview ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Live preview</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Section title="Surfaces & accent" subtitle="bg-* utilities from semantic tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SURFACES.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-xl border border-border">
              <div className={`h-16 ${s.cls}`} />
              <div className="bg-surface px-3 py-2">
                <div className="font-mono text-[11px] font-semibold text-heading">{s.name}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Hue chips" subtitle="KPI tile palette — bg-hue-*-soft + text-hue-*">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {HUES.map((h) => (
            <div key={h.name} className={`flex flex-col items-center gap-1 rounded-xl py-4 ${h.cls}`}>
              <Sparkles size={18} />
              <span className="text-[11px] font-semibold capitalize">{h.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Text">
        <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
          {TEXTS.map((t) => (
            <div key={t.name} className="flex items-baseline justify-between gap-4">
              <span className={`text-base ${t.cls}`}>The quick brown fox — {t.name}</span>
              <span className="font-mono text-[11px] text-muted">{t.name}</span>
            </div>
          ))}
          <div className="pt-1 font-mono text-sm text-muted">a1b2c3d4-0000-4f00-8a00-1234567890ab</div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-text hover:bg-accent-hover">
            Primary
          </button>
          <button className="rounded-lg bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-soft-text hover:brightness-95">
            Soft
          </button>
          <button className="rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-body hover:bg-surface-hover">
            Secondary
          </button>
          <button
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-[var(--sa-card-shadow)]"
            style={{ backgroundImage: "var(--sa-gradient)" }}
          >
            Gradient
          </button>
        </div>
      </Section>

      <Section title="Tenant status pills">
        <div className="flex flex-wrap gap-3">
          {PILLS.map((p) => (
            <span key={p.label} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${p.cls}`}>
              {p.label}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Danger zone" subtitle="Destructive, double-confirm operations">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
                <ShieldAlert size={16} /> Hard-delete tenant
              </h3>
              <p className="mt-1 text-sm text-body">
                Permanently removes the tenant and all its data. This cannot be undone.
              </p>
            </div>
            <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:hover:bg-red-500">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
