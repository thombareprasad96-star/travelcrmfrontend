import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, mergeTheme } from "./themeDefaults";
import { themeService } from "./themeService";

const ThemeContext = createContext(null);
const unwrap = (response) => response?.data?.data ?? response?.data;
const cacheKey = () => `tenant-theme:${localStorage.getItem("userEmail") || "anonymous"}`;

function tenantCodeFromLocation() {
  const queryCode = new URLSearchParams(window.location.search).get("tenant");
  if (queryCode) return queryCode;
  const labels = window.location.hostname.split(".");
  return labels.length > 2 && labels[0] !== "www" ? labels[0] : null;
}

export function applyTheme(values, branding = {}) {
  const theme = mergeTheme(values);
  const root = document.documentElement;
  const variables = {
    "--color-primary": theme.primaryColor, "--color-secondary": theme.secondaryColor,
    "--color-accent": theme.accentColor, "--sidebar-bg": theme.sidebarBg,
    "--header-bg": theme.headerBg, "--surface": theme.surfaceColor,
    "--border": theme.borderColor, "--text-primary": theme.textPrimary,
    "--text-secondary": theme.textSecondary, "--login-bg": theme.loginBackground,
    "--login-bg-image": theme.loginBackgroundImageUrl ? `url("${theme.loginBackgroundImageUrl}")` : "none",
    "--radius-theme": theme.borderRadius, "--font-theme": `'${theme.fontFamily}', system-ui, sans-serif`,
  };
  Object.entries(variables).forEach(([key, value]) => root.style.setProperty(key, value));
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const resolvedMode = theme.colorMode === "system" ? (prefersDark ? "dark" : "light") : theme.colorMode;
  root.dataset.colorMode = theme.colorMode;
  root.dataset.resolvedMode = resolvedMode;
  root.dataset.sidebarStyle = theme.sidebarStyle;
  root.dataset.headerStyle = theme.headerStyle;
  root.dataset.buttonStyle = theme.buttonStyle;
  root.dataset.cardStyle = theme.cardStyle;
  if (branding.tenantName) document.title = branding.tenantName;
  if (branding.faviconUrl) {
    let icon = document.querySelector("link[rel~='icon']") || document.createElement("link");
    icon.rel = "icon"; icon.href = branding.faviconUrl; document.head.appendChild(icon);
  }
  return theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [branding, setBranding] = useState({});
  const [loading, setLoading] = useState(true);

  const install = useCallback((payload, persist = true) => {
    const next = applyTheme(payload?.values, payload);
    setTheme(next); setBranding(payload || {});
    if (persist) localStorage.setItem(cacheKey(), JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("theme-updated", { detail: payload }));
    return next;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const code = tenantCodeFromLocation();
      if (token) install(unwrap(await themeService.get()));
      else if (code) install(unwrap(await themeService.getPublic(code)));
      else install({ values: DEFAULT_THEME }, false);
    } catch {
      // Keep a successfully hydrated cached theme during a transient network failure.
      if (!localStorage.getItem(cacheKey())) install({ values: DEFAULT_THEME }, false);
    }
    finally { setLoading(false); }
  }, [install]);

  useEffect(() => {
    try { const cached = JSON.parse(localStorage.getItem(cacheKey())); if (cached) install(cached, false); } catch { /* corrupt cache */ }
    refresh();
  }, [install, refresh]);

  useEffect(() => {
    const onCompanyUpdated = () => refresh();
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSystemModeChanged = () => { if (theme.colorMode === "system") applyTheme(theme, branding); };
    window.addEventListener("company-updated", onCompanyUpdated);
    media?.addEventListener?.("change", onSystemModeChanged);
    return () => {
      window.removeEventListener("company-updated", onCompanyUpdated);
      media?.removeEventListener?.("change", onSystemModeChanged);
    };
  }, [branding, refresh, theme]);

  const value = useMemo(() => ({ theme, branding, loading, install, refresh }), [theme, branding, loading, install, refresh]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
