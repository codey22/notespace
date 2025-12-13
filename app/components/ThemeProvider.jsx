"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem("theme") : null;
            if (stored) return stored;
            if (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        } catch {}
        return "light";
    });

    // Update HTML class and localStorage when theme changes
    useEffect(() => {
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
            html.classList.remove("light"); // Just in case
        } else {
            html.classList.remove("dark");
            html.classList.add("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Minimal Context Setup
import { createContext, useContext } from "react";
const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);
