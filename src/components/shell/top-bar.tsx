"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "@/context/workspace-context";

interface TopBarProps {
  onOpenCommandPalette: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  activeNav,
  setActiveNav,
}) => {
  const {
    currentUser,
    currentWorkspace,
    theme,
    setTheme,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useWorkspace();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) setIsNotifOpen(false);
      if (userRef.current && !userRef.current.contains(target)) setIsUserMenuOpen(false);
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "time", label: "Time" },
    { id: "budget", label: "Budget" },
    { id: "invoices", label: "Invoices" },
    { id: "clients", label: "Clients" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <header className="top" role="banner">
      {/* 1. Left: Logo & mobile drawer trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="round sm lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Menu boczne"
        >
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="logo" onClick={() => setActiveNav("home")} style={{ cursor: "pointer" }}>
          <i />
          <span>velodrome</span>
        </div>
      </div>

      {/* 2. Middle: Navigation Pills */}
      <nav className="pills" aria-label="Główna nawigacja platformy">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            data-v={item.id === "home" ? "" : item.id}
            aria-current={activeNav === item.id ? "page" : undefined}
            onClick={() => setActiveNav(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* 3. Right: Action Buttons */}
      <div className="right">
        {/* Search */}
        <button
          type="button"
          className="round"
          onClick={onOpenCommandPalette}
          aria-label="Szukaj (Ctrl+K)"
          title="Szukaj (Ctrl+K)"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            className="round"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Powiadomienia"
            title="Powiadomienia"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" />
            </svg>
            <span className="dot" />
          </button>

          {isNotifOpen && (
            <div className="pop float absolute right-0 top-12 w-80 p-3 z-50 space-y-2">
              <div className="text-xs font-semibold text-[var(--muted)] pb-1 border-b border-[var(--line)]">
                Powiadomienia (3)
              </div>
              <div className="text-xs p-2 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer">
                <b>INV-1045</b> opłacona przez Helix Labs (1 830 zł)
              </div>
              <div className="text-xs p-2 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer">
                <b>Budżet Q2</b> osiągnął próg 75%
              </div>
              <div className="text-xs p-2 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer">
                <b>Anna Nowak</b> przypisała Cię do zadania Redesign
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          id="theme"
          className="round"
          onClick={toggleTheme}
          aria-label="Przełącz motyw"
          title="Przełącz motyw"
        >
          <svg viewBox="0 0 24 24">
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
          </svg>
        </button>

        {/* User Avatar */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            className="round avatar"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-label="Konto użytkownika"
          >
            <span>{currentUser.full_name.charAt(0)}</span>
          </button>

          {isUserMenuOpen && (
            <div className="pop float absolute right-0 top-12 w-56 p-2 z-50 space-y-1">
              <div className="p-2 border-b border-[var(--line)]">
                <div className="font-semibold text-xs text-[var(--text)]">{currentUser.full_name}</div>
                <div className="text-[0.68rem] text-[var(--muted)]">{currentUser.email}</div>
              </div>
              <button
                type="button"
                className="mi"
                onClick={() => {
                  setActiveNav("settings");
                  setIsUserMenuOpen(false);
                }}
              >
                <span>Ustawienia profilu</span>
              </button>
              <button
                type="button"
                className="mi"
                onClick={() => {
                  onOpenCommandPalette();
                  setIsUserMenuOpen(false);
                }}
              >
                <span>Paleta poleceń (Ctrl+K)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
