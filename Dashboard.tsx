"use client";

import { useState } from "react";
import { TRAINING_BLOCKS, WEEKLY_PLAN } from "@/lib/training-data";
import { Calendar, ChevronDown, ChevronRight, Target, Zap, Dumbbell, TrendingUp } from "lucide-react";

function typeColor(type: string) {
  if (type === "CUESTA" || type === "FARTLEK") return "#f5a623";
  if (type === "Z2" || type === "Z2+F" || type === "FONDO") return "#4a9eff";
  if (type === "HIIT+F") return "#b06eff";
  if (type === "Z1" || type === "RECUPERACION") return "#5DCAA5";
  if (type === "EVENTO") return "#f5a623";
  return "#5a5652";
}

export function Periodization() {
  const [openBlocks, setOpenBlocks] = useState<string[]>([]);
  const [openWeeks, setOpenWeeks] = useState<string[]>([]);
  const [view, setView] = useState<"annual" | "weekly" | "cuestas">("annual");

  const toggle = (id: string, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    set(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const today = new Date();
  const currentBlockId = TRAINING_BLOCKS.find(b => today >= b.startDate && today <= b.endDate)?.id;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, color: "var(--text)" }}>
            Periodizacion 2026
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
            CADS + Grantham · 3 carreras · Abr–Nov
          </p>
        </div>

        {/* View selector */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          {([
            { id: "annual", label: "Plan anual" },
            { id: "weekly", label: "Sem a sem" },
            { id: "cuestas", label: "Cuestas zigzag" },
          ] as const).map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 500,
                background: view === v.id ? "var(--surface3)" : "transparent",
                color: view === v.id ? "var(--text)" : "var(--text2)",
                transition: "all 0.15s",
              }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline bar */}
      <div className="card p-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TRAINING_BLOCKS.map(block => (
            <div key={block.id}
              onClick={() => { setView("annual"); toggle(block.id, setOpenBlocks); }}
              className="flex-none rounded-lg p-2 text-center cursor-pointer transition-all hover:scale-105"
              style={{
                background: block.id === currentBlockId ? block.color + "25" : block.bg,
                border: `1px solid ${block.id === currentBlockId ? block.color + "60" : "var(--border)"}`,
                minWidth: 72,
              }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: block.color }}>
                {block.shortName}
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)", marginTop: 2 }}>
                {block.dates.split("–")[0].trim()}
              </p>
              {block.id === currentBlockId && (
                <div className="animate-pulse-dot mx-auto mt-1" style={{ width: 5, height: 5, borderRadius: "50%", background: block.color }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Annual view */}
      {view === "annual" && (
        <div className="space-y-2 animate-fade-in stagger">
          {TRAINING_BLOCKS.map((block) => {
            const isOpen = openBlocks.includes(block.id);
            const isCurrent = block.id === currentBlockId;
            return (
              <div key={block.id} className="card overflow-hidden animate-fade-up">
                <button
                  onClick={() => toggle(block.id, setOpenBlocks)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                  <div style={{ width: 3, height: 40, borderRadius: 2, background: block.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                        {block.name}
                      </span>
                      <span className="pill" style={{ background: block.bg, color: block.color, borderColor: block.color + "40" }}>
                        {block.badge}
                      </span>
                      {isCurrent && (
                        <span className="pill" style={{ background: "rgba(45,204,143,0.1)", color: "var(--green)", borderColor: "rgba(45,204,143,0.3)" }}>
                          ● Ahora
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                      {block.dates}
                    </p>
                  </div>
                  {isOpen ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
                </button>

                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: 16 }} className="animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                        <p className="section-label" style={{ marginBottom: 4 }}>Objetivo</p>
                        <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{block.objetivo}</p>
                      </div>
                      <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                        <p className="section-label" style={{ marginBottom: 4 }}>KPI</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: block.color, lineHeight: 1.5 }}>{block.kpi}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        { icon: <TrendingUp size={11} />, label: "Volumen", val: block.volumen, color: "var(--blue)" },
                        { icon: <Zap size={11} />, label: "Sesion clave", val: block.sesionClave, color: "var(--amber)" },
                        { icon: <Dumbbell size={11} />, label: "Fuerza", val: block.fuerza, color: "var(--green)" },
                        { icon: <Target size={11} />, label: "Ritmos", val: block.ritmos, color: "var(--purple)" },
                      ].map(item => (
                        <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                          <div className="flex items-center gap-1 mb-1" style={{ color: item.color }}>
                            {item.icon}
                            <p className="section-label" style={{ color: item.color }}>{item.label}</p>
                          </div>
                          <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.4 }}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                    {block.notas && (
                      <div style={{ marginTop: 10, background: block.bg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${block.color}30` }}>
                        <p style={{ fontSize: 11, color: block.color === "#888780" ? "var(--text2)" : block.color, lineHeight: 1.5 }}>
                          💡 {block.notas}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly breakdown */}
      {view === "weekly" && (
        <div className="space-y-2 animate-fade-in stagger">
          {WEEKLY_PLAN.map((week, wi) => {
            const isOpen = openWeeks.includes(week.num);
            return (
              <div key={week.num} className="card overflow-hidden animate-fade-up" style={week.peak ? { borderColor: "rgba(245,166,35,0.25)" } : {}}>
                <button
                  onClick={() => toggle(week.num, setOpenWeeks)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                  <div style={{ 
                    width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--surface2)", border: "1px solid var(--border)", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: "var(--text2)" }}>
                      {wi + 1}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                        {week.num}
                      </span>
                      <span className="pill" style={{ background: "var(--surface3)", color: "var(--text2)", borderColor: "var(--border2)" }}>
                        {week.bloque}
                      </span>
                      {week.peak && (
                        <span className="pill" style={{ background: "rgba(245,166,35,0.1)", color: "var(--amber)", borderColor: "rgba(245,166,35,0.3)" }}>
                          ⚡ Semana pico
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                      {week.dates} · {week.km}
                    </p>
                  </div>
                  {isOpen ? <ChevronDown size={14} color="var(--text3)" /> : <ChevronRight size={14} color="var(--text3)" />}
                </button>

                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: 16 }} className="animate-fade-in">
                    <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>{week.focus}</p>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {week.dias.map((dia, i) => {
                        const c = typeColor(dia.type);
                        return (
                          <div key={i} className="rounded-lg p-1.5 flex flex-col gap-1"
                            style={{ background: c + "10", border: `1px solid ${c}30`, minHeight: 80 }}>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase" }}>
                              {dia.lbl.split(" ")[0]}
                            </p>
                            <p style={{ fontSize: 7, color: "var(--text3)" }}>{dia.lbl.split(" ")[1]}</p>
                            <span style={{ fontSize: 8, fontWeight: 600, color: c, background: c + "20", borderRadius: 3, padding: "1px 3px", alignSelf: "flex-start" }}>
                              {dia.type}
                            </span>
                            <p style={{ fontSize: 8, color: "var(--text2)", lineHeight: 1.3, flex: 1 }}>{dia.desc}</p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: "var(--text3)", marginTop: "auto" }}>{dia.rpe}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid md:grid-cols-3 gap-2">
                      {[
                        { label: "Sesion clave", val: week.sesionClave, color: "var(--amber)" },
                        { label: "Fondo largo", val: week.fondo, color: "var(--blue)" },
                        { label: "Fuerza", val: week.fuerza, color: "var(--green)" },
                      ].map(item => (
                        <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                          <p className="section-label" style={{ marginBottom: 3 }}>{item.label}</p>
                          <p style={{ fontSize: 11, color: item.color, lineHeight: 1.4 }}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cuestas zigzag */}
      {view === "cuestas" && (
        <div className="space-y-4 animate-fade-in">
          <div style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 12, padding: "12px 14px", marginBottom: 4 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--amber)", marginBottom: 4 }}>
              Sesion de referencia — Garmin 19 nov 2025
            </p>
            <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
              10×300m zigzag · 3.30 km · 23:51 · 7:13/km · 12m desnivel positivo · 388 kcal.<br/>
              Tramos subida 5–8 seg = trabajo alactico puro. Bajada = recuperacion excentrica activa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 stagger">
            {TRAINING_BLOCKS.filter(b => b.cuestas !== null).map((block) => {
              const c = block.cuestas!;
              return (
                <div key={block.id} className="card p-4 animate-fade-up">
                  <div className="flex items-center gap-2 mb-3">
                    <div style={{ width: 3, height: 28, borderRadius: 2, background: block.color }} />
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                        {block.shortName}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>{c.label}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Reps", val: c.reps + "×300m" },
                      { label: "Intensidad", val: c.intensidad },
                      { label: "Pausa", val: c.pausa },
                    ].map(item => (
                      <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "7px 9px", border: "1px solid var(--border)", textAlign: "center" }}>
                        <p className="section-label" style={{ marginBottom: 2 }}>{item.label}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: block.color }}>{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: block.bg, borderRadius: 8, padding: "8px 10px", border: `1px solid ${block.color}30` }}>
                    <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
                      {c.nota}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: block.color, marginTop: 4 }}>{c.rpe}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
