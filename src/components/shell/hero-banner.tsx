"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace, TabName, SeasonName, PlatformFilter } from "@/context/workspace-context";

interface HeroBannerProps {
  onOpenCommandPalette: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenCommandPalette }) => {
  const {
    currentWorkspace,
    currentUser,
    activeTab,
    setActiveTab,
    season,
    setSeason,
    platform,
    setPlatform,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useWorkspace();

  const [dateStr, setDateStr] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Good Morning");
  const [isSeasonOpen, setIsSeasonOpen] = useState<boolean>(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false);

  const seasonRef = useRef<HTMLDivElement>(null);
  const platRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDateStr(now.toLocaleDateString("en-US", options));
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (seasonRef.current && !seasonRef.current.contains(target)) setIsSeasonOpen(false);
      if (platRef.current && !platRef.current.contains(target)) setIsPlatformOpen(false);
      if (userRef.current && !userRef.current.contains(target)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setIsNotifOpen(false);
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const TABS: TabName[] = ["Overview", "Analytics", "Customers", "Billing", "Reports", "Settings"];
  const SEASONS: SeasonName[] = ["2024 Season", "2025 Season", "2026 Season"];
  const PLATFORMS: PlatformFilter[] = ["All", "Tiktok Shop", "Instagram", "Shopify"];

  return (
    <header className="hero" role="banner">
      <div className="stripes" />

      {/* Top row: Greeting, Date, Pills & Quick Icons */}
      <div className="top">
        <div>
          <div className="date">{dateStr}</div>
          <h1>
            <span>{greeting} </span>
            <em>{currentWorkspace.name}</em>
          </h1>
          <div className="pills">
            <span className="pill hg">
              <b>Stable</b> 1,21%
            </span>
            <span className="pill hg">
              <b>Growing</b> 5,30%
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="icons">
          {/* Mobile hamburger button */}
          <button
            type="button"
            className="ib hg lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar Menu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Settings button */}
          <button
            type="button"
            className="ib hg"
            onClick={() => setActiveTab("Settings")}
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
            </svg>
          </button>

          {/* Help button */}
          <button
            type="button"
            className="ib hg"
            onClick={onOpenCommandPalette}
            aria-label="Help & Command Palette"
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z" />
              <path d="M12 6v14" />
            </svg>
          </button>

          {/* Notifications button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="ib hg dot"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" />
                <path d="M10 21h4" />
              </svg>
            </button>
            {isNotifOpen && (
              <div className="pop min-w-[19rem] shadow-2xl" style={{ right: 0, top: "2.8rem" }}>
                <div className="pt font-semibold border-b border-[var(--line)] pb-1 mb-1">
                  Powiadomienia (3)
                </div>
                <div className="nt hover:bg-[var(--chip)] cursor-pointer">
                  <b>INV-1045</b> opłacona przez Helix Labs (1 830 zł)
                </div>
                <div className="nt hover:bg-[var(--chip)] cursor-pointer">
                  <b>Budżet Q2</b> osiągnął próg 75%
                </div>
                <div className="nt hover:bg-[var(--chip)] cursor-pointer">
                  <b>Anna Nowak</b> przypisała Cię do zadania Redesign
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              className="av"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User Account"
            >
              {currentUser.full_name.charAt(0)}
            </button>
            {isUserMenuOpen && (
              <div className="pop min-w-[14rem] shadow-2xl" style={{ right: 0, top: "2.8rem" }}>
                <div className="pt border-b border-[var(--line)] pb-1 mb-1">
                  <div className="font-semibold text-[var(--text)]">{currentUser.full_name}</div>
                  <div className="text-[0.68rem] text-[var(--muted)]">{currentUser.email}</div>
                </div>
                <button
                  type="button"
                  className="mi"
                  onClick={() => {
                    setActiveTab("Settings");
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
      </div>

      {/* Bottom row: Context Tabs & Selectors/Search Controls */}
      <div className="bar">
        {/* Navigation Tabs */}
        <nav className="tabs" role="tablist" aria-label="Dashboard views">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className="tab"
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Filter Controls & Search */}
        <div className="ctrls">
          {/* Season Selector */}
          <div className="relative" ref={seasonRef}>
            <button
              type="button"
              className="sel hg"
              onClick={() => setIsSeasonOpen(!isSeasonOpen)}
              aria-label="Select season"
            >
              <span>{season}</span>
              <svg viewBox="0 0 10 10">
                <path d="M1 3h8L5 8z" />
              </svg>
            </button>
            {isSeasonOpen && (
              <div className="pop min-w-[13rem] shadow-2xl" style={{ left: 0, top: "2.5rem" }}>
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="mi"
                    onClick={() => {
                      setSeason(s);
                      setIsSeasonOpen(false);
                    }}
                  >
                    <span className={s === season ? "font-bold text-[var(--rose)]" : ""}>{s}</span>
                    {s === season && <span className="text-[var(--rose)] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platform Selector */}
          <div className="relative" ref={platRef}>
            <button
              type="button"
              className="sel hg"
              onClick={() => setIsPlatformOpen(!isPlatformOpen)}
              aria-label="Select platform"
            >
              <span>{platform}</span>
              <svg viewBox="0 0 10 10">
                <path d="M1 3h8L5 8z" />
              </svg>
            </button>
            {isPlatformOpen && (
              <div className="pop min-w-[13rem] shadow-2xl" style={{ left: 0, top: "2.5rem" }}>
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="mi"
                    onClick={() => {
                      setPlatform(p);
                      setIsPlatformOpen(false);
                    }}
                  >
                    <span className={p === platform ? "font-bold text-[var(--rose)]" : ""}>{p}</span>
                    {p === platform && <span className="text-[var(--rose)] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search */}
          <input
            type="text"
            className={`qi ${isSearchInputOpen ? "open" : ""}`}
            placeholder="Szukaj transakcji lub zadań..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpenCommandPalette();
            }}
          />
          <button
            type="button"
            className="search"
            onClick={() => {
              if (!isSearchInputOpen) {
                setIsSearchInputOpen(true);
              } else {
                onOpenCommandPalette();
              }
            }}
          >
            <span>Search</span>
            <svg viewBox="0 0 16 16">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
