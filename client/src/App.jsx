// src/App.jsx
import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import WeatherModule from "./components/WeatherModule";
import CurrencyConverter from "./components/CurrencyConverter";
import QuoteGenerator from "./components/QuoteGenerator";

export default function App() {
  const [name, setName] = useState(() => localStorage.getItem("infohub_name") || "");
  const [showNameModal, setShowNameModal] = useState(!Boolean(localStorage.getItem("infohub_name")));
  const [theme, setTheme] = useState(() => localStorage.getItem("infohub_theme") || "light");
  const [activeTab, setActiveTab] = useState("Weather");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("infohub_theme", theme);
  }, [theme]);

  function handleNameSave(newName) {
    const trimmed = (newName || "").trim();
    if (trimmed) {
      setName(trimmed);
      localStorage.setItem("infohub_name", trimmed);
      setShowNameModal(false);
    }
  }

  function handleCancelName() {
    setName("");
    localStorage.removeItem("infohub_name");
    setShowNameModal(true);
  }

  return (
    <div className="min-h-screen transition-colors">
      <div className="main-container">
        <TopBar name={name} theme={theme} setTheme={setTheme} onOpenNameModal={() => setShowNameModal(true)} />

        {/* Name modal */}
        {showNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 modal-backdrop" />
            <div className="relative w-full max-w-md rounded-2xl p-6 card-violet">
              <h2 className="text-xl font-semibold mb-3 card-title">Welcome to InfoHub</h2>
              <p className="helper mb-4">Please enter your name to continue</p>
              <NameForm initialName={name} onSave={handleNameSave} onCancel={handleCancelName} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center justify-center py-6">
          {["Weather", "Currency", "Quotes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mx-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow"
                  : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 border border-transparent hover:shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Desktop: 3 columns (visible on md+) */}
        <section className="hidden md:grid md:grid-cols-3 md:gap-6 mb-8">
          <div className="card-violet"><WeatherModule /></div>
          <div className="card-violet"><CurrencyConverter /></div>
          <div className="card-violet"><QuoteGenerator /></div>
        </section>

        {/* Mobile: show only the active tab (visible on small screens) */}
        <section className="md:hidden mb-8">
          <div className="card-violet">
            {activeTab === "Weather" && <WeatherModule />}
            {activeTab === "Currency" && <CurrencyConverter />}
            {activeTab === "Quotes" && <QuoteGenerator />}
          </div>
        </section>
      </div>
    </div>
  );
}

function NameForm({ initialName = "", onSave, onCancel }) {
  const [value, setValue] = useState(initialName);

  return (
    <div>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your name..."
        className="input-ui"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => { setValue(""); onCancel(); }} className="btn-secondary">Cancel</button>
        <button onClick={() => onSave(value)} className="btn-primary">Continue</button>
      </div>
    </div>
  );
}
