import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Console theming. Renders the `.sa-console` root that scopes every semantic token, and
 * toggles a `.dark` class on it. The preference (light | dark | system) persists in
 * localStorage under "sa-theme"; default is "system", which follows the OS live.
 *
 * Wrap each top-level console screen (login + layout) in this provider so the tokens
 * resolve and the theme toggle works everywhere.
 */

const STORAGE_KEY = "sa-theme";
const BRAND_KEY = "sa-brand"; // per-browser accent/gradient token overrides (Design Tokens editor)

function loadBrand() {
  try {
    return JSON.parse(localStorage.getItem(BRAND_KEY)) || {};
  } catch {
    return {};
  }
}

const ConsoleThemeContext = createContext(null);

export function useConsoleTheme() {
  const ctx = useContext(ConsoleThemeContext);
  if (!ctx) throw new Error("useConsoleTheme must be used inside <ConsoleThemeProvider>");
  return ctx;
}

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function resolveDark(theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return prefersDark(); // "system"
}

export default function ConsoleThemeProvider({ children, className = "" }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "system"
  );
  const [isDark, setIsDark] = useState(() => resolveDark(theme));

  // Resolve + persist whenever the preference changes. `.dark` is driven purely by
  // React state (in className below) — no manual classList mutation that could race
  // the render, so the toggle is deterministic.
  useEffect(() => {
    setIsDark(resolveDark(theme));
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // In "system" mode, follow OS changes live.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  // Brand overrides — inline CSS custom properties on the root. They win over the
  // .sa-console / .sa-console.dark token rules, so the Design Tokens editor recolors
  // the whole console live (accent family + gradient) and persists per browser.
  const [brand, setBrandState] = useState(loadBrand);

  const setBrand = useCallback((vars) => {
    const next = vars || {};
    setBrandState(next);
    localStorage.setItem(BRAND_KEY, JSON.stringify(next));
  }, []);

  const resetBrand = useCallback(() => {
    setBrandState({});
    localStorage.removeItem(BRAND_KEY);
  }, []);

  const setTheme = useCallback((t) => setThemeState(t), []);
  const value = useMemo(
    () => ({ theme, setTheme, isDark, brand, setBrand, resetBrand }),
    [theme, setTheme, isDark, brand, setBrand, resetBrand]
  );

  return (
    <div
      className={`sa-console ${isDark ? "dark" : ""} min-h-screen bg-page text-body antialiased ${className}`}
      style={brand}
    >
      <ConsoleThemeContext.Provider value={value}>
        {children}
      </ConsoleThemeContext.Provider>
    </div>
  );
}