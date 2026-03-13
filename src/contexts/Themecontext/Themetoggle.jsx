import React from "react";
import { useTheme } from "./ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";


const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-blue-100 border-blue-200"
      } ${className}`}
    >
      {/* Track pill */}
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
          isDark ? "translate-x-7 bg-slate-700" : "translate-x-0 bg-white"
        }`}
      >
        {isDark ? (
          <FaMoon className="text-blue-300 text-[11px]" />
        ) : (
          <FaSun className="text-amber-400 text-[11px]" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
