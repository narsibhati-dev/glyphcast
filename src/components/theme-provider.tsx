"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "glyphcast-theme",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => defaultTheme);
  const skipInitialDomApply = useRef(true);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentionally sync state from DOM before initial paint
    setThemeState((prev) => {
      const fromDom = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      return prev === fromDom ? prev : fromDom;
    });
  }, []);

  useEffect(() => {
    if (skipInitialDomApply.current) {
      skipInitialDomApply.current = false;
      return;
    }

    const root = document.documentElement;
    let lock: HTMLStyleElement | undefined;

    if (disableTransitionOnChange) {
      lock = document.createElement("style");
      lock.setAttribute("data-theme-transition-lock", "");
      lock.textContent = "*,*::before,*::after{transition:none!important}";
      document.head.appendChild(lock);
    }

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore quota / private mode */
    }

    if (lock) {
      window.getComputedStyle(document.body);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lock?.remove();
        });
      });
    }
  }, [disableTransitionOnChange, storageKey, theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
