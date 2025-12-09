"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Check, Palette } from "lucide-react";
import clsx from "clsx";

const COLORS = [
    { name: "Blue", value: "#2563EB" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Green", value: "#059669" },
    { name: "Red", value: "#DC2626" },
    { name: "Orange", value: "#EA580C" },
    { name: "Black", value: "#000000" },
];

export default function SettingsPage() {
    const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();

    return (
        <div className="p-8 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">Settings</h1>
                <p className="text-text-secondary">Customize your workspace preferences.</p>
            </header>

            <div className="space-y-8">

                {/* Appearance Section */}
                <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Palette size={24} className="text-primary" />
                        Appearance
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Theme Toggle */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Theme Mode</h3>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        theme === "light" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                    )}
                                >
                                    <Sun size={18} /> Light
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        theme === "dark" ? "bg-gray-700 shadow-sm text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                    )}
                                >
                                    <Moon size={18} /> Dark
                                </button>
                            </div>
                        </div>

                        {/* Primary Color */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Primary Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setPrimaryColor(color.value)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-gray-200"
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {primaryColor === color.value && <Check size={18} className="text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Section (Placeholder) */}
                <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border opacity-60">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Account</h2>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse"></div>
                        <div className="h-10 bg-gray-100 rounded-lg w-3/4 animate-pulse"></div>
                        <p className="text-sm text-text-secondary">Account settings coming soon...</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
