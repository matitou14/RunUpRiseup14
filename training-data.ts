"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Plus, Trash2, CheckCircle, Circle, Scale, Clock, Heart } from "lucide-react";
import { EVENTS } from "@/lib/training-data";
import { daysUntil } from "@/lib/utils";

interface SessionLog {
  id: string;
  date: string;
  type: string;
  duration: string;
  distance: string;
  fc: string;
  pace: string;
  rpe: string;
  notes: string;
}

interface WeightLog {
  date: string;
  weight: string;
}

const EMPTY_SESSION: Omit<SessionLog, "id" | "date"> = {
  type: "Z2",
  duration: "",
  distance: "",
  fc: "",
  pace: "",
  rpe: "",
  notes: "",
};

function useLocalStorage<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(init);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setVal(JSON.parse(stored));
    } catch {}
  }, [key]);

  const set = (v: T | ((prev: T) => T)) => {
    setVal(prev => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [val, set] as const;
}

export function Progress() {
  const [sessions, setSessions] = useLocalStorage<SessionLog[]>("training-sessions", []);
  const [weights, setWeights] = useLocalStorage<WeightLog[]>("weight-log", []);
  const [showForm, setShowForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [form, setForm] = useState(EMPTY_SESSION);
  const [newWeight, setNewWeight] = useState("");
  const [view, setView] = useState<"sessions" | "weight" | "events">("events");

  const addSession = () => {
    if (!form.duration) return;
    const session: SessionLog = {
      ...form,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("es-AR"),
    };
    setSessions(prev => [session, ...prev]);
    setForm(EMPTY_SESSION);
    setShowForm(false);
  };

  const addWeight = () => {
    if (!newWeight) return;
    setWeights(prev => [{ date: new Date().toLocaleDateString("es-AR"), weight: newWeight }, ...prev]);
    setNewWeight("");
    setShowWeightForm(false);
  };

  const deleteSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

  const typeColor = (type: string) => {
    if (type === "CUESTA" || type === "FARTLEK" || type === "SERIES") return "#f5a623";
    if (type === "Z2" || type === "FONDO") return "#4a9eff";
    if (type === "HIIT") return "#b06eff";
    if (type === "Z1") return "#5DCAA5";
    if (type === "Z3" || type === "Z4") return "#ff7c5c";
    return "#888780";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, color: "var(--text)" }}>
            Progreso
          </h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
            Registro de sesiones · Peso · Countdown a carreras
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          {([
            { id: "events", label: "Carreras" },
            { id: "sessions", label: "Sesiones" },
            { id: "weight", label: "Peso" },
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

      {/* Events countdown */}
      {view === "events" && (
        <div className="space-y-4 animate-fade-in stagger">
          {EVENTS.map((event) => {
            const days = daysUntil(event.date);
            const isPast = days === 0;
            const totalDays = Math.ceil((event.date.getTime() - new Date("2026-04-10").getTime()) / (1000 * 60 * 60 * 24));
            const elapsed = totalDays - days;
            const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

            return (
              <div key={event.id} className="card p-5 animate-fade-up" style={{ borderLeftWidth: 3, borderLeftColor: event.color }}>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 20 }}>{event.emoji}</span>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text)" }}>
                        {event.name}
                      </h3>
                      <span className="pill" style={{ background: event.color + "15", color: event.color, borderColor: event.color + "40" }}>
                        {event.type === "control" ? "TEST" : `Objetivo ${event.type}`}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text2)" }}>{event.desc}</p>
                  </div>
                  <div style={{ textAlign: "center", background: event.color + "10", borderRadius: 12, padding: "10px 18px", border: `1px solid ${event.color}30` }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: event.color, lineHeight: 1 }}>
                      {days}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 }}>
                      {days === 1 ? "dia" : "dias"}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 8 }}>
                  <div className="flex justify-between mb-1">
                    <p className="section-label">Progreso del plan hacia esta carrera</p>
                    <p className="section-label">{Math.round(progress)}%</p>
                  </div>
                  <div style={{ height: 6, background: "var(--surface3)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3, background: event.color,
                      width: `${progress}%`, transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>

                <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 12px", border: "1px solid var(--border)" }}>
                  <p className="section-label" style={{ marginBottom: 2 }}>Objetivo</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: event.color, fontWeight: 600 }}>
                    {event.goal}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sessions */}
      {view === "sessions" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <p style={{ fontSize: 12, color: "var(--text2)" }}>
              {sessions.length} sesiones registradas
            </p>
            <button onClick={() => setShowForm(!showForm)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 20, border: "1px solid rgba(45,204,143,0.4)",
                background: "rgba(45,204,143,0.08)", color: "var(--green)",
                fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500,
              }}>
              <Plus size={13} /> Registrar sesion
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="card p-4 animate-fade-up" style={{ borderColor: "rgba(45,204,143,0.3)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 12 }}>
                Nueva sesion — {new Date().toLocaleDateString("es-AR")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {([
                  { key: "type", label: "Tipo", placeholder: "Z2, CUESTA, FARTLEK...", type: "text" },
                  { key: "duration", label: "Duracion *", placeholder: "45 min", type: "text" },
                  { key: "distance", label: "Distancia", placeholder: "8.5 km", type: "text" },
                  { key: "fc", label: "FC promedio", placeholder: "145 ppm", type: "text" },
                  { key: "pace", label: "Ritmo promedio", placeholder: "5:45/km", type: "text" },
                  { key: "rpe", label: "RPE", placeholder: "5", type: "text" },
                ] as const).map(field => (
                  <div key={field.key}>
                    <p className="section-label" style={{ marginBottom: 4 }}>{field.label}</p>
                    <input
                      value={form[field.key]}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 8,
                        background: "var(--surface2)", border: "1px solid var(--border2)",
                        color: "var(--text)", fontSize: 12, fontFamily: "var(--font-body)",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <p className="section-label" style={{ marginBottom: 4 }}>Notas</p>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Como te senti, observaciones, condiciones..."
                  rows={2}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    background: "var(--surface2)", border: "1px solid var(--border2)",
                    color: "var(--text)", fontSize: 12, fontFamily: "var(--font-body)",
                    outline: "none", resize: "vertical",
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowForm(false)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={addSession}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "var(--green)", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Guardar sesion
                </button>
              </div>
            </div>
          )}

          {/* Sessions list */}
          {sessions.length === 0 ? (
            <div className="card p-8 text-center">
              <p style={{ fontSize: 32, marginBottom: 8 }}>🏃</p>
              <p style={{ fontSize: 14, color: "var(--text2)" }}>Sin sesiones registradas todavia</p>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>Registra tu primera sesion para empezar a trackear tu progreso</p>
            </div>
          ) : (
            <div className="space-y-2 stagger">
              {sessions.map((s) => (
                <div key={s.id} className="card p-3 animate-fade-up flex items-start gap-3">
                  <div style={{ width: 3, height: "100%", minHeight: 40, borderRadius: 2, background: typeColor(s.type), flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="pill" style={{ background: typeColor(s.type) + "20", color: typeColor(s.type), borderColor: typeColor(s.type) + "40" }}>
                        {s.type}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>{s.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {s.duration && <span style={{ fontSize: 12, color: "var(--text)" }}>⏱ {s.duration}</span>}
                      {s.distance && <span style={{ fontSize: 12, color: "var(--blue)" }}>📍 {s.distance}</span>}
                      {s.fc && <span style={{ fontSize: 12, color: "var(--red)" }}>❤️ {s.fc}</span>}
                      {s.pace && <span style={{ fontSize: 12, color: "var(--amber)" }}>⚡ {s.pace}</span>}
                      {s.rpe && <span style={{ fontSize: 12, color: "var(--purple)" }}>RPE {s.rpe}</span>}
                    </div>
                    {s.notes && <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, lineHeight: 1.4 }}>{s.notes}</p>}
                  </div>
                  <button onClick={() => deleteSession(s.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text3)", padding: 4, flexShrink: 0 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weight */}
      {view === "weight" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>{weights.length} registros</p>
              {weights.length > 0 && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", marginTop: 2 }}>
                  Ultimo: {weights[0].weight} kg — {weights[0].date}
                </p>
              )}
            </div>
            <button onClick={() => setShowWeightForm(!showWeightForm)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 20, border: "1px solid rgba(45,204,143,0.4)",
                background: "rgba(45,204,143,0.08)", color: "var(--green)",
                fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500,
              }}>
              <Scale size={13} /> Registrar peso
            </button>
          </div>

          {showWeightForm && (
            <div className="card p-4 animate-fade-up" style={{ borderColor: "rgba(45,204,143,0.3)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 10 }}>
                Peso hoy — {new Date().toLocaleDateString("es-AR")}
              </p>
              <div className="flex gap-2 items-end">
                <div style={{ flex: 1 }}>
                  <p className="section-label" style={{ marginBottom: 4 }}>Peso (kg)</p>
                  <input
                    value={newWeight} onChange={e => setNewWeight(e.target.value)}
                    placeholder="95.5"
                    type="number" step="0.1"
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8,
                      background: "var(--surface2)", border: "1px solid var(--border2)",
                      color: "var(--text)", fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 700,
                      outline: "none",
                    }}
                  />
                </div>
                <button onClick={addWeight}
                  style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "var(--green)", color: "#000", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Weight goal card */}
          <div className="card p-4" style={{ borderColor: "rgba(45,204,143,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Scale size={14} style={{ color: "var(--green)" }} />
              <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>Objetivo de peso</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Peso actual", val: weights[0]?.weight ? weights[0].weight + " kg" : ">95 kg", color: "var(--text)" },
                { label: "Objetivo", val: "85-87 kg", color: "var(--green)" },
                { label: "Deficit target", val: "500 kcal/dia", color: "var(--amber)" },
              ].map(item => (
                <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px", border: "1px solid var(--border)", textAlign: "center" }}>
                  <p className="section-label" style={{ marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: item.color }}>{item.val}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "rgba(45,204,143,0.06)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(45,204,143,0.2)" }}>
              <p style={{ fontSize: 11, color: "var(--teal)", lineHeight: 1.5 }}>
                💡 Cada kg menos = ~2–3 seg menos por km = ~20–30 seg en el 10K completo.
              </p>
            </div>
          </div>

          {/* Weight log */}
          {weights.length > 0 && (
            <div className="card overflow-hidden">
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>Historial de peso</p>
              </div>
              {weights.map((w, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < weights.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{w.date}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: i === 0 ? "var(--green)" : "var(--text)" }}>
                    {w.weight} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
