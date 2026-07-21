export const DEFAULT_THEME = Object.freeze({
  primaryColor: "#2563EB", secondaryColor: "#4F46E5", accentColor: "#D97706",
  sidebarBg: "#0F172A", headerBg: "#FFFFFF", surfaceColor: "#FFFFFF",
  borderColor: "#E2E8F0", textPrimary: "#0F172A", textSecondary: "#64748B",
  loginBackground: "#F8FAFC", fontFamily: "Plus Jakarta Sans", sidebarStyle: "solid",
  loginBackgroundImageUrl: null,
  headerStyle: "light", buttonStyle: "rounded", cardStyle: "elevated",
  colorMode: "light", borderRadius: "0.5rem",
});

export const mergeTheme = (values) => ({ ...DEFAULT_THEME, ...(values || {}) });
