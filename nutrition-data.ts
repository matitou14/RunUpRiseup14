"use client";

import { ATHLETE, TRAINING_BLOCKS, WEEKLY_PLAN, HEART_RATE_ZONES } from "@/lib/training-data";
import { getDaysToEvents, getCurrentWeekNumber } from "@/lib/utils";
import { 
  Target, Timer, Flame, Zap, Heart, Dumbbell, 
  ChevronRight, TrendingUp, Activity, Calendar
} from "lucide-react";

const DAY_NAMES = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
const MONTH_NAMES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function typeColor(type: string) {
  if (type === "CUESTA" || type === "FARTLEK") return "#f5a623";
  if (type === "Z2" || type === "Z2+F" || type === "FONDO") return "#4a9eff";
  if (type === "HIIT+F") return "#b06eff";
  if (type === "Z1" || type === "RECUPERACION") return "#5DCAA5";
  if (type === "EVENTO") return "#f5a623";
  return "#5a5652";
}

export function Dashboard() {
  const today = new Date();
  const dayName = DAY_NAMES[today.getDay()];
  const dayNum = today.getDate();
  const monthName = MONTH_NAMES[today.getMonth()];
  const year = today.getFullYear();

  const events = getDaysToEvents();
  const weekNum = getCurrentWeekNumber();

  // Find today's training in weekly plan
  const todayKey = `${dayNum < 10 ? "0" : ""}${dayNum} ${monthName.slice(0,3)}`;
  
  // Find current week
  const currentWeek = WEEKLY_PLAN.find(w => {
    const [start] = w.dates.split("–");
    return weekNum >= 1 && weekNum <= WEEKLY_PLAN.length;
  }) ?? WEEKLY_PLAN[Math.min(weekNum - 1, WEEKLY_PLAN.length - 1)];

  // Find current block
  const todayDate = new Date();
  const currentBlock = TRAINING_BLOCKS.find(b => todayDate >= b.startDate && todayDate <= b.endDate)
    ?? TRAINING_BLOCKS[0];

  // Today's session from current week
  const dayOfWeek = today.getDay(); // 0=Sun
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0
  const todaySession = currentWeek?.dias[Math.min(dayIndex, 6)] ?? currentWeek?.dias[0];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div 
        className="animate-fade-up rounded-xl p-5 border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(74,158,255,0.08) 0%, var(--surface) 60%)", borderColor: "rgba(74,158,255,0.2)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--blue) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative">
          <div>
            <p className="section-label mb-1">{dayName}, {dayNum} de {monthName} {year}</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>
              Hola, {ATHLETE.name} 👋
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="pill" style={{ background: currentBlock.bg, color: currentBlock.color, borderColor: currentBlock.color + "40" }}>
                {currentBlock.shortName} — {currentBlock.badge}
              </span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>Semana {weekNum} del plan</span>
            </div>
          </div>

          {/* Event countdowns */}
          <div className="flex gap-3 flex-wrap">
            {events.map((e) => (
              <div key={e.id} className="text-center px-4 py-3 rounded-lg" style={{ background: "var(--surface2)", border: "1px solid var(--border)", minWidth: 80 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: e.color, lineHeight: 1 }}>
                  {e.days}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)", marginTop: 3, textTransform: "uppercase" }}>
                  dias
                </div>
                <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 2 }}>
                  {e.emoji} {e.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's session + block info */}
      <div className="grid md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "60ms" }}>
        {/* Today */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              Sesion de hoy
            </span>
          </div>

          {todaySession ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="pill" style={{ background: typeColor(todaySession.type) + "22", color: typeColor(todaySession.type), borderColor: typeColor(todaySession.type) + "40" }}>
                  {todaySession.type}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>
                  {todaySession.rpe}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{todaySession.desc}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 8 }}>{todaySession.lbl}</p>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--text2)" }}>Descanso — recuperacion activa</p>
          )}
        </div>

        {/* Current block KPI */}
        <div className="card p-4" style={{ borderLeftWidth: 3, borderLeftColor: currentBlock.color }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} style={{ color: currentBlock.color }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              {currentBlock.shortName} — Bloque actual
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 8 }}>
            {currentBlock.objetivo}
          </p>
          <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
            <p className="section-label" style={{ marginBottom: 2 }}>KPI del bloque</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: currentBlock.color }}>
              {currentBlock.kpi}
            </p>
          </div>
        </div>
      </div>

      {/* This week's days */}
      {currentWeek && (
        <div className="card p-4 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: "var(--blue)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>
                {currentWeek.num} — {currentWeek.dates}
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>
              {currentWeek.km}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>{currentWeek.focus}</p>

          <div className="grid grid-cols-7 gap-1">
            {currentWeek.dias.map((dia, i) => {
              const isToday = dayIndex === i;
              const c = typeColor(dia.type);
              return (
                <div key={i} 
                  className="rounded-lg p-1.5 flex flex-col gap-1"
                  style={{ 
                    background: isToday ? c + "18" : "var(--surface2)",
                    border: `1px solid ${isToday ? c + "50" : "var(--border)"}`,
                    minHeight: 72,
                  }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: isToday ? c : "var(--text3)", textTransform: "uppercase" }}>
                    {dia.lbl.split(" ")[0]}
                  </p>
                  <span style={{ fontSize: 8, fontWeight: 600, color: c, background: c + "20", borderRadius: 3, padding: "1px 3px", alignSelf: "flex-start" }}>
                    {dia.type}
                  </span>
                  <p style={{ fontSize: 8, color: isToday ? "var(--text)" : "var(--text2)", lineHeight: 1.35, flex: 1 }}>
                    {dia.desc}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: "var(--text3)" }}>
                    {dia.rpe}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3 pt-3 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
            <div>
              <p className="section-label">Sesion clave</p>
              <p style={{ fontSize: 11, color: "var(--amber)", marginTop: 2 }}>{currentWeek.sesionClave}</p>
            </div>
            <div>
              <p className="section-label">Fondo</p>
              <p style={{ fontSize: 11, color: "var(--blue)", marginTop: 2 }}>{currentWeek.fondo}</p>
            </div>
          </div>
        </div>
      )}

      {/* HR Zones quick ref */}
      <div className="card p-4 animate-fade-up" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center gap-2 mb-3">
          <Heart size={14} style={{ color: "var(--red)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>Zonas de FC</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {HEART_RATE_ZONES.map((z) => (
            <div key={z.zone} className="text-center p-2 rounded-lg" style={{ background: z.color + "12", border: `1px solid ${z.color}30` }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: z.color }}>{z.zone}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text2)", marginTop: 2 }}>{z.bpm}</p>
              <p style={{ fontSize: 9, color: "var(--text3)", marginTop: 1 }}>{z.pace}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Athlete profile quick */}
      <div className="card p-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} style={{ color: "var(--green)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700 }}>Perfil del atleta</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Edad", val: ATHLETE.age + " años" },
            { label: "FC Z2", val: ATHLETE.fcZ2 },
            { label: "Metodo", val: ATHLETE.method },
            { label: "Ubicacion", val: ATHLETE.location },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
              <p className="section-label" style={{ marginBottom: 3 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{item.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
