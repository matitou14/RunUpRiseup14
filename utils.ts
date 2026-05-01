"use client";

import { useState } from "react";
import { NUTRITION_DAYS, MACROS, NUTRITION_PRINCIPLES, RACE_DAY_PROTOCOL, type DayType } from "@/lib/nutrition-data";
import { Utensils, Flame, Beef, Wheat, Droplets, Apple } from "lucide-react";

const DAY_OPTIONS: { id: DayType; label: string }[] = [
  { id: "sesion-larga", label: "Sesion larga" },
  { id: "sesion-media", label: "Sesion media" },
  { id: "cuestas-series", label: "Cuestas/Series" },
  { id: "recuperacion", label: "Recuperacion" },
  { id: "descanso", label: "Descanso" },
];

export function Nutrition() {
  const [selected, setSelected] = useState<DayType>("sesion-media");
  const [raceView, setRaceView] = useState<"principles" | "days" | "race">("days");

  const day = NUTRITION_DAYS[selected];
  const macros = MACROS[selected];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, color: "var(--text)" }}>
            Plan Nutricional
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
            Periodizado por tipo de sesion · Objetivo: -8/10 kg
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          {([
            { id: "days", label: "Por dia" },
            { id: "principles", label: "Principios" },
            { id: "race", label: "Dia de carrera" },
          ] as const).map(v => (
            <button key={v.id} onClick={() => setRaceView(v.id)}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 500,
                background: raceView === v.id ? "var(--surface3)" : "transparent",
                color: raceView === v.id ? "var(--text)" : "var(--text2)",
                transition: "all 0.15s",
              }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Days view */}
      {raceView === "days" && (
        <div className="animate-fade-in space-y-4">
          {/* Day type selector */}
          <div className="flex gap-2 flex-wrap">
            {DAY_OPTIONS.map(opt => {
              const d = NUTRITION_DAYS[opt.id];
              const isSelected = selected === opt.id;
              return (
                <button key={opt.id} onClick={() => setSelected(opt.id)}
                  style={{
                    padding: "7px 14px", borderRadius: 20, border: `1px solid ${isSelected ? d.color + "60" : "var(--border)"}`,
                    background: isSelected ? d.color + "18" : "var(--surface)",
                    color: isSelected ? d.color : "var(--text2)",
                    fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Day overview */}
          <div className="card p-4 animate-fade-up" style={{ borderLeftWidth: 3, borderLeftColor: day.color }}>
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                  {day.name}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{day.description}</p>
              </div>
              <div style={{ background: day.color + "15", borderRadius: 10, padding: "6px 14px", border: `1px solid ${day.color}30`, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: day.color, lineHeight: 1 }}>
                  {day.calories}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>kcal/dia</p>
              </div>
            </div>

            {/* Macros bar */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: <Beef size={11} />, label: "Proteina", val: macros.protein + "g", color: "#ff7c5c", pct: Math.round(macros.protein * 4 / day.calories * 100) },
                { icon: <Wheat size={11} />, label: "Hidratos", val: macros.carbs + "g", color: "#f5a623", pct: Math.round(macros.carbs * 4 / day.calories * 100) },
                { icon: <Droplets size={11} />, label: "Grasas", val: macros.fat + "g", color: "#4a9eff", pct: Math.round(macros.fat * 9 / day.calories * 100) },
              ].map(m => (
                <div key={m.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-1 mb-1" style={{ color: m.color }}>
                    {m.icon}
                    <p className="section-label" style={{ color: m.color }}>{m.label}</p>
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: m.color }}>{m.val}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)", marginTop: 1 }}>{m.pct}% kcal</p>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="space-y-2">
              {day.meals.map((meal, i) => (
                <div key={i} style={{ background: "var(--surface2)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <Utensils size={11} style={{ color: day.color }} />
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                        {meal.title}
                      </p>
                    </div>
                    <span className="pill" style={{ background: day.color + "15", color: day.color, borderColor: day.color + "40" }}>
                      {meal.calories} kcal
                    </span>
                  </div>
                  <div className="px-3 py-2 flex flex-wrap gap-1">
                    {meal.items.map((item, j) => (
                      <span key={j} style={{ fontSize: 11, color: "var(--text2)", background: "var(--surface3)", borderRadius: 6, padding: "2px 8px", border: "1px solid var(--border)" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Principles */}
      {raceView === "principles" && (
        <div className="grid md:grid-cols-2 gap-3 animate-fade-in stagger">
          {NUTRITION_PRINCIPLES.map((p, i) => (
            <div key={i} className="card p-4 animate-fade-up">
              <div className="flex items-start gap-3">
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Race day */}
      {raceView === "race" && (
        <div className="space-y-4 animate-fade-in stagger">
          {Object.entries(RACE_DAY_PROTOCOL).map(([key, protocol]) => {
            const color = key === "10k-mayo" ? "var(--amber)" : "var(--coral)";
            const bg = key === "10k-mayo" ? "rgba(245,166,35,0.08)" : "rgba(255,124,92,0.08)";
            const bc = key === "10k-mayo" ? "rgba(245,166,35,0.25)" : "rgba(255,124,92,0.25)";
            return (
              <div key={key} className="card p-4 animate-fade-up" style={{ borderLeftWidth: 3, borderLeftColor: color }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color }}>
                  {protocol.name}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 12, marginTop: 2 }}>
                  {protocol.timing}
                </p>

                <div className="space-y-3">
                  <div style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 8, padding: "10px 12px" }}>
                    <p className="section-label" style={{ color, marginBottom: 6 }}>Que comer</p>
                    <div className="flex flex-wrap gap-1">
                      {protocol.items.map((item, i) => (
                        <span key={i} style={{ fontSize: 11, color: "var(--text)", background: "var(--surface2)", borderRadius: 6, padding: "3px 9px", border: "1px solid var(--border)" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                      <p className="section-label" style={{ marginBottom: 4 }}>💧 Hidratacion</p>
                      <p style={{ fontSize: 12, color: "var(--blue)" }}>{protocol.hydration}</p>
                    </div>
                    <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                      <p className="section-label" style={{ marginBottom: 4 }}>⛔ Evitar</p>
                      <p style={{ fontSize: 12, color: "var(--red)" }}>{protocol.avoid}</p>
                    </div>
                  </div>

                  <div style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 8, padding: "8px 12px" }}>
                    <p style={{ fontSize: 12, color, lineHeight: 1.5, fontWeight: 500 }}>
                      📌 {protocol.rule}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
