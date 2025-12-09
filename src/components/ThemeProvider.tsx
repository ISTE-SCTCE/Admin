"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    primaryColor: string;
    setTheme: (theme: Theme) => void;
    setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [primaryColor, setPrimaryColorState] = useState("#2563EB"); // Default Blue
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from local storage
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedColor = localStorage.getItem("primaryColor");

        if (savedTheme) setThemeState(savedTheme);
        if (savedColor) setPrimaryColorState(savedColor);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply Dark Mode
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    useEffect(() => {
        if (!mounted) return;

        // Apply Primary Color
        const root = document.documentElement;
        // We need to set --primary, --primary-hover, --primary-light
        // Ideally we calculate shades, but for MVP we might just set the base
        // and let CSS calc handle it or just set one variable if refactored simple.
        // Our globals.css expects --primary, --primary-hover.

        // Simplification: We will just set --primary. 
        // Button hovers might not be perfect without calculating shades, 
        // but we can assume the user picks a decent color.

        root.style.setProperty("--primary", primaryColor);
        // Rough heuristic for hover: same color (or add opacity/brightness logic later)
        root.style.setProperty("--primary-hover", primaryColor);

        localStorage.setItem("primaryColor", primaryColor);
    }, [primaryColor, mounted]);

    const setTheme = (t: Theme) => setThemeState(t);
    const setPrimaryColor = (c: string) => setPrimaryColorState(c);

    // Simplification: Always render provider to allow useTheme to work. 
    // We handle hydration mismatch by effect-based updates.
    return (
        <ThemeContext.Provider value={{ theme, primaryColor, setTheme, setPrimaryColor }}>
            {/* 
         To avoid hydration mismatch for components that access theme immediately, 
         we can either render children always (accepting potential mismatch)
         or return null until mounted. 
         But returning null hurts SEO. 
         Ideally, we just render children. 
      */}
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
