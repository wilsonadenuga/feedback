"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark" || !theme || theme === "system";

  return (
    <div className="flex items-center">
      {isDark ? (
        <button
          aria-label="Switch to light mode"
          className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ring-2 ring-ring"
          style={{ lineHeight: 0 }}
          onClick={() => setTheme("light")}
        >
          <Sun size={16} />
        </button>
      ) : (
        <button
          aria-label="Switch to dark mode"
          className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ring-2 ring-ring"
          style={{ lineHeight: 0 }}
          onClick={() => setTheme("dark")}
        >
          <Moon size={16} />
        </button>
      )}
    </div>
  );
}
