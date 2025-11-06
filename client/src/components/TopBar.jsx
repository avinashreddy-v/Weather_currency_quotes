// src/components/TopBar.jsx
import React from "react";

export default function TopBar({ name, theme, setTheme, onOpenNameModal }) {
  return (
    <header className="topbar-wrapper py-4">
      <div className="flex items-center gap-3">
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>

      <div className="flex items-center gap-4">
        <div>
          {name ? (
            <div className="name-badge">{`Hello, ${name}`}</div>
          ) : (
            <button onClick={onOpenNameModal} className="name-badge">Set your name</button>
          )}
        </div>
      </div>
    </header>
  );
}

function ThemeSwitch({ theme, setTheme }) {
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="theme-toggle">
      <span className="text-sm helper">Light</span>
      <button onClick={toggle} aria-label="Toggle theme" className={`w-12 h-6 rounded-full p-1 flex items-center transition ${theme === "dark" ? "bg-violet-600" : "bg-gray-300"}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow transform transition ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`} />
      </button>
      <span className="text-sm helper">Dark</span>
    </div>
  );
}
