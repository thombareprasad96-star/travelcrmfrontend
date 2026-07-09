import { Sun, Moon, Monitor } from "lucide-react";
import { useConsoleTheme } from "./ConsoleThemeProvider";

const OPTIONS = [
  { key: "light", Icon: Sun, label: "Light" },
  { key: "dark", Icon: Moon, label: "Dark" },
  { key: "system", Icon: Monitor, label: "System" },
];

/** Segmented sun / moon / monitor control. Reads + sets the console theme preference. */
export default function ThemeToggle() {
  const { theme, setTheme } = useConsoleTheme();
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
      {OPTIONS.map(({ key, Icon, label }) => {
        const active = theme === key;
        return (
          <button
            key={key}
            type="button"
            title={label}
            aria-label={`${label} theme`}
            aria-pressed={active}
            onClick={() => setTheme(key)}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              active
                ? "bg-accent text-accent-text"
                : "text-muted hover:bg-surface-hover hover:text-body"
            }`}
          >
            <Icon size={15} strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}