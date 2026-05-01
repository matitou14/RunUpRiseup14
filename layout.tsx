@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');
@import "tailwindcss";

:root {
  --bg: #0e0e0e;
  --surface: #161616;
  --surface2: #1e1e1e;
  --surface3: #272727;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.13);
  --text: #f0ede8;
  --text2: #a8a49e;
  --text3: #5a5652;
  --green: #2dcc8f;
  --blue: #4a9eff;
  --amber: #f5a623;
  --red: #ff5c5c;
  --purple: #b06eff;
  --coral: #ff7c5c;
  --teal: #5DCAA5;
  --gray: #888780;
  --r: 10px;
  --r-lg: 14px;
  --font-display: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--surface); }
::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 4px; }
::selection { background: rgba(74,158,255,0.25); color: var(--text); }
:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 4px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
}

.animate-fade-up { animation: fadeUp 0.35s ease both; }
.animate-fade-in { animation: fadeIn 0.2s ease both; }
.animate-pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
.stagger > *:nth-child(6) { animation-delay: 300ms; }
.stagger > *:nth-child(7) { animation-delay: 360ms; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  transition: border-color 0.15s;
}
.card:hover { border-color: var(--border2); }

.pill {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid;
  font-weight: 500;
  display: inline-block;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.gradient-text {
  background: linear-gradient(135deg, var(--green), var(--blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
