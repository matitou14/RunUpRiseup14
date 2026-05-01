"use client";

import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Periodization } from "@/components/Periodization";
import { Nutrition } from "@/components/Nutrition";
import { Progress } from "@/components/Progress";
import { getDaysToEvents } from "@/lib/utils";
import { LayoutDashboard, Calendar, Utensils, TrendingUp, Menu, X, Timer } from "lucide-react";

type Tab = "dashboard" | "periodization" | "nutrition" | "progress";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Hoy", icon: <LayoutDashboard size={15} /> },
  { id: "periodization", label: "Plan", icon: <Calendar size={15} /> },
  { id: "nutrition", label: "Nutricion", icon: <Utensils size={15} /> },
  { id: "progress", label: "Progreso", icon: <TrendingUp size={15} /> },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const events = getDaysToEvents();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(14,14,14,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(74,158,255,0.12)", border: "1px solid rgba(74,158,255,0.25)",
              }}>
                <span style={{ fontSize: 16 }}>🏃</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
                  Matias 2026
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>
                  CADS + GRANTHAM
                </p>
              </div>
            </div>

            {/* Desktop nav */}
            <nav style={{ display: "flex", gap: 2 }} className="hidden-mobile">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: tab === t.id ? "var(--surface3)" : "transparent",
                    color: tab === t.id ? "var(--text)" : "var(--text2)",
                    fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 500,
                    transition: "all 0.15s",
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </nav>

            {/* Countdowns - desktop */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="hidden-mobile">
              {events.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color }} />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: e.color }}>
                    {e.days}d
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>
                    {e.emoji}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: 6, cursor: "pointer", color: "var(--text2)" }}
              className="show-mobile">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: 12 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
                  background: tab === t.id ? "var(--surface3)" : "transparent",
                  color: tab === t.id ? "var(--text)" : "var(--text2)",
                  fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500,
                }}>
                {t.icon} {t.label}
              </button>
            ))}
            <div style={{ display: "flex", gap: 12, padding: "10px 12px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
              {events.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 12 }}>{e.emoji}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: e.color }}>
                    {e.days}d
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 100px" }}>
        {tab === "dashboard" && <Dashboard />}
        {tab === "periodization" && <Periodization />}
        {tab === "nutrition" && <Nutrition />}
        {tab === "progress" && <Progress />}
      </main>

      {/* Mobile bottom nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(14,14,14,0.95)", backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "8px 4px",
        paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
      }} className="show-mobile">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === t.id ? "var(--surface3)" : "transparent",
              color: tab === t.id ? "var(--text)" : "var(--text3)",
              transition: "all 0.15s",
            }}>
            {t.icon}
            <span style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>{t.label}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        @media (min-width: 640px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 639px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
