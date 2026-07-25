import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ─── FONT LOADER ──────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("f1-fonts")) return;
    const link = document.createElement("link");
    link.id = "f1-fonts";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const from = 0;
    const to = value;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{display}</>;
};

const SEASON_DATA = {
  "Stagione 1": {
    races: [
      { race: "Miami",      results: ["Leclerc","Russell","Igor","Gasly","Norris","Alex","Hulkenberg","Antonelli","Hadjar","Verstappen","Bearman","Colapinto","Lawson","Perez","Alonso","Lindblad","Piastri","Ocon","Stroll","Bortoleto","Hamilton","Bottas"] },
      { race: "Singapore",  results: ["Russell","Verstappen","Antonelli","Norris","Hamilton","Leclerc","Piastri","Ocon","Gasly","Colapinto","Bottas","Perez","Alonso","Lindblad","Hadjar","Hulkenberg","Lawson","Bortoleto","Bearman","Stroll","Igor","Alex"] },
      { race: "Austin",     results: [] },
      { race: "Giappone",   results: [] },
      { race: "Bahrain",    results: [] },
      { race: "Monza",      results: [] },
      { race: "Qatar",      results: [] },
      { race: "Zandvoort",  results: [] },
    ],
    raceExtras: [
      { race: "Miami",        pole: "Russell", overtakes: "Antonelli", fastest: "Leclerc", loyal: "Igor"   },
      { race: "Singapore",    pole: "Norris",  overtakes: "Lindblad",  fastest: "Russell", loyal: "Igor"   },
      { race: "Austin",       pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "Giappone",     pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "Bahrain",      pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "Monza",        pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "Qatar",        pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "Zandvoort",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
    ],
    calendar: [
      { round: 1, race: "Miami",        city: "Miami",       status: "done",     winner: "Leclerc", raceKey: "Miami"      },
      { round: 2, race: "Singapore",    city: "Singapore",   status: "done",     winner: "Russell", raceKey: "Singapore"  },
      { round: 3, race: "Austin",       city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 4, race: "Giappone",     city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 5, race: "Bahrain",      city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 6, race: "Monza",        city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 7, race: "Qatar",        city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 8, race: "Zandvoort",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
    ],
    driverPoles: { Alex: 0, Igor: 0, Norris: 1, Verstappen: 0, Hamilton: 0, Russell: 1, Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0, Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0, Hulkenberg: 0, Bortoleto: 0 }
  },
  "Stagione 2": {
    races: [
      { race: "?",  results: [] },
      { race: "?",  results: [] },
      { race: "?",  results: [] },
      { race: "?",  results: [] },
      { race: "?",  results: [] },
      { race: "?",  results: [] },
      { race: "?",  results: [] },
    ],
    raceExtras: [
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
      { race: "?",    pole: "...", overtakes: "...",   fastest: "...",   loyal: "..."   },
    ],
    calendar: [
      { round: 1, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 2, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 3, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 4, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 5, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 6, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
      { round: 7, race: "?",    city: "?",   status: "undone",     winner: "...", raceKey: "..."  },
    ],
    driverPoles: { Alex: 0, Igor: 0, Norris: 0, Verstappen: 0, Hamilton: 0, Russell: 0, Piastri: 0, Antonelli: 0, Leclerc: 0, Alonso: 0, Albon: 0, Sainz: 0, Stroll: 0, Lawson: 0, Tsunoda: 0, Bearman: 0, Manuel: 0, Gasly: 0, Hulkenberg: 0, Bortoleto: 0 }
  },
};

// FIX: le pole vanno calcolate dai raceExtras di ogni gara, non da un valore statico sempre a 0
function computeSeasonPoles(raceExtras) {
  const poles = {};
  raceExtras.forEach((e) => {
    if (e.pole && e.pole !== "...") poles[e.pole] = (poles[e.pole] || 0) + 1;
  });
  return poles;
}

const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const DRIVER_TEAMS_BASE = {
  Piastri:    { team: "McLaren",          num: 81, flag: "🇦🇺" },
  Norris:     { team: "McLaren",          num: 4,  flag: "🇬🇧" },
  Verstappen: { team: "Red Bull",         num: 1,  flag: "🇳🇱" },
  Hadjar:     { team: "Red Bull",         num: 22, flag: "🇫🇷" },
  Russell:    { team: "Mercedes",         num: 63, flag: "🇬🇧" },
  Antonelli:  { team: "Mercedes",         num: 12, flag: "🇮🇹" },
  Leclerc:    { team: "Ferrari",          num: 16, flag: "🇲🇨" },
  Hamilton:   { team: "Ferrari",          num: 44, flag: "🇬🇧" },
  Alex:       { team: "Williams",         num: 99, flag: "🇮🇹" },
  Igor:       { team: "Williams",         num: 92, flag: "🇮🇹" },
  Alonso:     { team: "Aston Martin",     num: 14, flag: "🇪🇸" },
  Stroll:     { team: "Aston Martin",     num: 18, flag: "🇨🇦" },
  Lawson:     { team: "Visa Cash App RB", num: 40, flag: "🇳🇿" },
  Lindblad:   { team: "Visa Cash App RB", num: 92, flag: "🇬🇧" },
  Bearman:    { team: "Haas",             num: 87, flag: "🇬🇧" },
  Ocon:       { team: "Haas",             num: 31, flag: "🇫🇷" },
  Gasly:      { team: "Alpine",           num: 10, flag: "🇫🇷" },
  Colapinto:  { team: "Alpine",           num: 43, flag: "🇦🇷" },
  Hulkenberg: { team: "Sauber",           num: 27, flag: "🇩🇪" },
  Bortoleto:  { team: "Sauber",           num: 5,  flag: "🇧🇷" },
  Bottas:     { team: "Cadillac",         num: 77, flag: "🇫🇮" },
  Perez:      { team: "Cadillac",         num: 11, flag: "🇲🇽"},
};

const TEAM_CHANGES = {
};

function getDriverTeamsForSeason(season) {
  const changes = TEAM_CHANGES[season] || {};
  return Object.keys(DRIVER_TEAMS_BASE).reduce((acc, driver) => {
    acc[driver] = { ...DRIVER_TEAMS_BASE[driver], ...(changes[driver] || {}) };
    return acc;
  }, {});
}

const TEAM_COLORS = {
  "McLaren":          "#FF8000",
  "Red Bull":         "#3070ca",
  "Mercedes":         "#a1a1a1",
  "Ferrari":          "#f10030",
  "Williams":         "#171bff",
  "Aston Martin":     "#228b6f",
  "Visa Cash App RB": "#4460ff",
  "Haas":             "#999999",
  "Alpine":           "#3de2ff",
  "Sauber":           "#31ff31",
  "Cadillac":         "#606060",
};

// ─── BONUS CONFIG ─────────────────────────────────────────────────
// Centralised so adding a new bonus type only requires one edit here
const BONUS_CONFIG = {
  pole:       { icon: "🅿️",  label: "Pole",     color: "#00d4ff", bg: "rgba(0,212,255,0.1)",  border: "rgba(0,212,255,0.2)",  dotColor: "#00d4ff" },
  overtakes:  { icon: "⚡",  label: "Sorpassi", color: "#FF8000", bg: "rgba(255,128,0,0.1)",  border: "rgba(255,128,0,0.2)",  dotColor: "#FF8000" },
  interpole:  { icon: "🌧️",  label: "Interpole",color: "#00c820", bg: "rgba(0,168,22,0.1)",   border: "rgba(0,168,22,0.2)",   dotColor: "#00c820" },
  fastest:    { icon: "⏱️",  label: "Fastest",  color: "#c77dff", bg: "rgba(199,125,255,0.1)",border: "rgba(199,125,255,0.2)",dotColor: "#c77dff" },
  loyal:      { icon: "🤝",  label: "Loyal",    color: "#ffd166", bg: "rgba(255,209,102,0.1)",border: "rgba(255,209,102,0.2)",dotColor: "#ffd166" },
};

const ALL_BONUS_KEYS = Object.keys(BONUS_CONFIG);

function computeBonusPoints(raceExtras, driverName) {
  const counts = {};
  ALL_BONUS_KEYS.forEach(k => { counts[k] = 0; });
  raceExtras.forEach(extra => {
    ALL_BONUS_KEYS.forEach(k => {
      if (extra[k] === driverName) counts[k]++;
    });
  });
  counts.total = ALL_BONUS_KEYS.reduce((s, k) => s + counts[k], 0);
  return counts;
}

function computeDriverStandings(raceResults, raceExtras, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const pts = {}, wins = {}, podiums = {};
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      pts[d] = (pts[d] || 0) + POINTS_TABLE[i];
      if (i === 0) wins[d] = (wins[d] || 0) + 1;
      if (i < 3)  podiums[d] = (podiums[d] || 0) + 1;
    });
  });
  return Object.keys(DRIVER_TEAMS)
    .filter(name => DRIVER_TEAMS[name].team !== "No Seat")
    .map((name) => {
      const bonus = computeBonusPoints(raceExtras, name);
      const racePts = pts[name] || 0;
      return {
        name,
        points: racePts + bonus.total,
        racePoints: racePts,
        bonusBreakdown: bonus,
        bonusTotal: bonus.total,
        wins: wins[name] || 0,
        podiums: podiums[name] || 0,
        wdc: 0,
        ...DRIVER_TEAMS[name]
      };
    })
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

function computeTeamStandings(raceResults, raceExtras, season) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const teams = {};
  Object.values(DRIVER_TEAMS).forEach(driver => {
    if (driver.team !== "No Seat" && !teams[driver.team]) teams[driver.team] = { points: 0, wins: 0, poles: 0, wcc: 0 };
  });
  raceResults.forEach(({ results }) => {
    results.forEach((d, i) => {
      if (i >= POINTS_TABLE.length) return;
      const info = DRIVER_TEAMS[d];
      if (!info || info.team === "No Seat") return;
      teams[info.team].points += POINTS_TABLE[i];
      if (i === 0) teams[info.team].wins += 1;
    });
  });
  Object.keys(DRIVER_TEAMS).forEach(driverName => {
    const info = DRIVER_TEAMS[driverName];
    if (!info || info.team === "No Seat") return;
    const bonus = computeBonusPoints(raceExtras, driverName);
    if (teams[info.team]) teams[info.team].points += bonus.total;
  });
  return Object.entries(teams).map(([team, data]) => ({ team, ...data })).sort((a, b) => b.points - a.points);
}

const SEASONS = ["Stagione 1", "Stagione 2"];

const CAREER_STATS = {
  Piastri:       { totalPoints: 6,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Norris:        { totalPoints: 23, totalWins: 0,   totalPoles: 1,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Verstappen:    { totalPoints: 19, totalWins: 0,   totalPoles: 0,  totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Hadjar:        { totalPoints: 2,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Russell:       { totalPoints: 45, totalWins: 1,   totalPoles: 1,  totalPodiums: 2,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Antonelli:     { totalPoints: 20, totalWins: 0,   totalPoles: 0,  totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Leclerc:       { totalPoints: 34, totalWins: 1,   totalPoles: 0,  totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Hamilton:      { totalPoints: 10, totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Alex:          { totalPoints: 8,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Igor:          { totalPoints: 17, totalWins: 0,   totalPoles: 0,  totalPodiums: 1,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Alonso:        { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Stroll:        { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Lawson:        { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Lindblad:      { totalPoints: 1,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Ocon:          { totalPoints: 4,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Bearman:       { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Gasly:         { totalPoints: 14, totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Colapinto:     { totalPoints: 1,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Hulkenberg:    { totalPoints: 6,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Bortoleto:     { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Perez:         { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
  Bottas:        { totalPoints: 0,  totalWins: 0,   totalPoles: 0,  totalPodiums: 0,  HatTrick: 0, GrandSlam: 0, championships: 0, constructorchamp: 0 },
};

const TEAM_CAREER_STATS = {
  "McLaren":            { totalPoints: 29, totalWins: 0, totalPoles: 1, championships: 0, driverchamp: 0 },
  "Red Bull":           { totalPoints: 21, totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Mercedes":           { totalPoints: 62, totalWins: 1, totalPoles: 1, championships: 0, driverchamp: 0 },
  "Ferrari":            { totalPoints: 44, totalWins: 1, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Williams":           { totalPoints: 25, totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Aston Martin":       { totalPoints: 0,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Visa Cash App RB":   { totalPoints: 1,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Haas":               { totalPoints: 4,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Alpine":             { totalPoints: 15, totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Sauber":             { totalPoints: 6,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
  "Cadillac":           { totalPoints: 0,  totalWins: 0, totalPoles: 0, championships: 0, driverchamp: 0 },
};

const NAV = [
  { id: "leaderboard", label: "Classifica", icon: "🏆" },
  { id: "calendar",    label: "Calendario", icon: "📅" },
  { id: "h2h",         label: "H2H",        icon: "⚔️" },
  { id: "career",      label: "Carriera",   icon: "🏁" },
];

// ─── MASTER CSS ───────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px #e8001d, 0 0 12px rgba(232,0,29,0.4); }
    50%       { opacity: 0.4; box-shadow: 0 0 2px #e8001d; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  :root {
    --red:    #e8001d;
    --cyan:   #00d4ff;
    --gold:   #FFD700;
    --silver: #C0C0C0;
    --bronze: #CD7F32;
    --bg0:    #030508;
    --bg1:    #080c14;
    --bg2:    #0d1421;
    --bg3:    #121a2b;
    --border: rgba(255,255,255,0.06);
    --text:   #c8d6e0;
    --muted:  #3d5a6e;
    --dim:    #1e3040;
  }

  .f1-root {
    min-height: 100vh;
    background: var(--bg0);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .f1-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 256px;
    opacity: 0.35;
  }

  .f1-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.022) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .f1-accent-lines {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 48px,
      rgba(232,0,29,0.012) 48px,
      rgba(232,0,29,0.012) 49px
    );
  }

  .f1-vignette {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 90% 70% at 50% 35%, transparent 30%, rgba(3,5,8,0.7) 100%);
  }

  .f1-scanline {
    position: fixed; left: 0; right: 0; height: 2px; top: 0;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.06), transparent);
    pointer-events: none; z-index: 1;
    animation: scanline 8s linear infinite;
  }

  .f1-header {
    position: relative; z-index: 10;
    background: linear-gradient(180deg, rgba(8,12,20,0.98) 0%, rgba(3,5,8,0.95) 100%);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px);
  }
  .f1-header::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--red), var(--cyan), var(--red), transparent);
    opacity: 0.4;
  }

  .f1-header-top {
    padding: 14px 20px 0;
    max-width: 1440px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }

  .f1-logo-area { display: flex; align-items: center; gap: 14px; }

  .f1-stripes { display: flex; gap: 3px; align-items: stretch; height: 34px; }
  .f1-stripe  { width: 4px; border-radius: 2px; }
  .f1-stripe:nth-child(1) { background: var(--red); opacity: 0.9; }
  .f1-stripe:nth-child(2) { background: var(--red); opacity: 0.5; }
  .f1-stripe:nth-child(3) { background: var(--cyan); opacity: 0.7; }

  .f1-status { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .f1-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--red);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .f1-status-label { font-size: 9px; color: var(--red); text-transform: uppercase; letter-spacing: 3px; font-weight: 600; font-family: 'Share Tech Mono', monospace; }
  .f1-title-row { display: flex; align-items: baseline; gap: 10px; }
  .f1-title {
    font-family: 'Orbitron', sans-serif; font-size: 20px; font-weight: 900; color: #fff;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #fff 0%, rgba(200,214,224,0.85) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .f1-subtitle { font-size: 9px; color: var(--dim); font-family: 'Share Tech Mono', monospace; letter-spacing: 0.5px; }

  .f1-nav {
    display: flex; gap: 1px;
    padding: 12px 20px 0;
    max-width: 1440px; margin: 0 auto;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .f1-nav::-webkit-scrollbar { display: none; }
  .f1-nav-btn {
    position: relative;
    padding: 9px 18px 10px;
    background: transparent; border: none; border-bottom: 2px solid transparent;
    color: var(--muted);
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 1.2px; text-transform: uppercase; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-radius: 6px 6px 0 0; white-space: nowrap; flex-shrink: 0;
    overflow: hidden;
  }
  .f1-nav-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 100%, rgba(232,0,29,0.1) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.25s;
  }
  .f1-nav-btn:hover { color: #8aacbe; }
  .f1-nav-btn:hover::before { opacity: 1; }
  .f1-nav-btn.active { color: #fff; border-bottom-color: var(--red); }
  .f1-nav-btn.active::before { opacity: 1; }
  .f1-nav-icon { margin-right: 5px; font-size: 11px; }

  .f1-page {
    position: relative; z-index: 1;
    padding: 20px 16px 56px;
    max-width: 1440px; margin: 0 auto; width: 100%;
    flex: 1;
  }

  .page-enter { animation: slideInUp 0.3s cubic-bezier(.4,0,.2,1) both; }

  .page-header {
    margin-bottom: 20px;
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .page-header-left h2 { font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 700; color: #e8ecf0; letter-spacing: 0.3px; margin-bottom: 4px; }
  .page-header-left p  { font-size: 11px; color: var(--dim); letter-spacing: 0.5px; font-family: 'Share Tech Mono', monospace; }

  .season-selector { position: relative; }
  .season-btn {
    padding: 8px 14px; background: var(--bg2);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: all 0.2s;
  }
  .season-btn:hover, .season-btn.open { border-color: rgba(232,0,29,0.4); background: rgba(232,0,29,0.06); color: #fff; }
  .season-btn-chevron { font-size: 8px; transition: transform 0.25s; }
  .season-btn.open .season-btn-chevron { transform: rotate(180deg); }
  .season-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: var(--bg2); border: 1px solid var(--border); border-radius: 9px;
    overflow: hidden; min-width: 160px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 100;
    animation: slideInUp 0.18s ease;
  }
  .season-option {
    padding: 10px 16px; font-size: 12px; font-weight: 600;
    color: var(--text); cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
  }
  .season-option:last-child { border-bottom: none; }
  .season-option:hover { background: rgba(232,0,29,0.08); color: #fff; }
  .season-option.active { color: var(--red); background: rgba(232,0,29,0.1); }

  /* ═══ LEADERBOARD ════════════════════════════════════════════ */
  .lb-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .lb-tab {
    padding: 8px 20px; border-radius: 7px;
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-tab:hover { border-color: rgba(255,255,255,0.12); color: var(--text); }
  .lb-tab.active { background: rgba(232,0,29,0.1); border-color: rgba(232,0,29,0.4); color: var(--red); }

  .lb-list { border-radius: 12px; border: 1px solid var(--border); overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.3); }

  .lb-list-header {
    display: grid;
    grid-template-columns: 52px 1fr 40px 40px 40px 90px;
    padding: 9px 16px;
    background: var(--bg2); border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .lb-list-header span { font-size: 8px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; font-family: 'Share Tech Mono', monospace; }
  .lb-list-header span:nth-child(3),
  .lb-list-header span:nth-child(4),
  .lb-list-header span:nth-child(5) { text-align: center; }
  .lb-list-header span:last-child { text-align: right; }

  .lb-row {
    display: grid;
    grid-template-columns: 52px 1fr 40px 40px 40px 90px;
    align-items: center;
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    background: var(--bg1);
    transition: background 0.18s;
    animation: rowIn 0.35s cubic-bezier(.4,0,.2,1) both;
  }
  .lb-row:last-child { border-bottom: none; }
  .lb-row:hover { background: rgba(255,255,255,0.025); }
  .lb-row.rank-1 { background: linear-gradient(90deg, rgba(255,215,0,0.055) 0%, var(--bg1) 50%); }
  .lb-row.rank-2 { background: linear-gradient(90deg, rgba(192,192,192,0.035) 0%, var(--bg1) 50%); }
  .lb-row.rank-3 { background: linear-gradient(90deg, rgba(205,127,50,0.035) 0%, var(--bg1) 50%); }

  .lb-pos-wrap { display: flex; align-items: center; justify-content: center; }
  .lb-pos {
    font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 900;
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    letter-spacing: -0.5px;
  }
  .lb-pos.p1 { color: #000; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-color: #FFD700; box-shadow: 0 0 14px rgba(255,215,0,0.4), 0 2px 6px rgba(0,0,0,0.4); font-size: 14px; }
  .lb-pos.p2 { color: #000; background: linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%); border-color: #C0C0C0; box-shadow: 0 0 10px rgba(192,192,192,0.3), 0 2px 6px rgba(0,0,0,0.3); }
  .lb-pos.p3 { color: #000; background: linear-gradient(135deg, #D4905A 0%, #A0522D 100%); border-color: #CD7F32; box-shadow: 0 0 10px rgba(205,127,50,0.3), 0 2px 6px rgba(0,0,0,0.3); }

  .lb-driver-cell { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .lb-team-bar    { width: 3px; min-width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0; }
  .lb-driver-info { min-width: 0; flex: 1; }
  .lb-driver-name { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #e8ecf0; letter-spacing: 0.1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lb-driver-meta { display: flex; align-items: center; gap: 5px; margin-top: 2px; flex-wrap: wrap; }
  .lb-driver-team { font-size: 9px; color: var(--muted); font-family: 'Share Tech Mono', monospace; white-space: nowrap; }
  .lb-driver-num  { font-size: 8px; color: var(--dim); font-family: 'Orbitron', sans-serif; }

  .lb-bonus-row { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; margin-top: 3px; }
  .lb-bonus-badge {
    display: inline-flex; align-items: center; gap: 2px;
    padding: 1px 5px; border-radius: 3px;
    font-size: 7.5px; font-weight: 700; letter-spacing: 0.3px;
    font-family: 'Share Tech Mono', monospace; white-space: nowrap;
  }

  .lb-race-toggle { font-size: 9px; color: var(--dim); cursor: pointer; background: none; border: none; font-family: 'Share Tech Mono', monospace; letter-spacing: 0.5px; padding: 0; transition: color 0.2s; margin-top: 3px; display: block; }
  .lb-race-toggle:hover { color: var(--cyan); }
  .lb-race-list { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s; margin-top: 2px; }
  .lb-race-list.open { max-height: 700px; opacity: 1; }
  .lb-race-item { display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 9.5px; }
  .lb-race-item:last-child { border-bottom: none; }
  .lb-race-item-name { color: var(--muted); }
  .lb-race-item-pos  { color: var(--text); font-family: 'Orbitron', sans-serif; font-size: 9px; flex-shrink: 0; margin-left: 8px; }

  .lb-stat { font-size: 14px; font-weight: 900; text-align: center; color: var(--muted); font-family: 'Orbitron', sans-serif; display: flex; align-items: center; justify-content: center; }
  .lb-stat.wins-col    { color: var(--gold); }
  .lb-stat.podiums-col { color: var(--bronze); }
  .lb-stat.poles-col   { color: var(--cyan); }
  .lb-stat.zero        { color: var(--dim); font-size: 12px; font-weight: 600; }

  .lb-pts-wrap { text-align: right; }
  .lb-pts { font-family: 'Orbitron', sans-serif; font-size: 18px; font-weight: 900; color: var(--red); line-height: 1; display: block; text-align: right; }
  .lb-pts-breakdown { font-size: 7.5px; color: var(--muted); margin-top: 2px; font-family: 'Share Tech Mono', monospace; text-align: right; }
  .lb-bar-wrap  { width: 100%; height: 2px; background: rgba(255,255,255,0.06); border-radius: 2px; margin-top: 5px; overflow: hidden; }
  .lb-bar-fill  { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--red), #ff4060); transition: width 1s cubic-bezier(.4,0,.2,1); }

  @media (max-width: 520px) {
    .lb-list-header { grid-template-columns: 46px 1fr 34px 34px 76px; }
    .lb-row          { grid-template-columns: 46px 1fr 34px 34px 76px; padding: 10px 11px; }
    .lb-list-header span:nth-child(5),
    .lb-row .lb-stat.poles-col { display: none; }
    .lb-pos { width: 30px; height: 30px; font-size: 11px; border-radius: 7px; }
    .lb-pts { font-size: 15px; }
    .lb-driver-name { font-size: 10px; }
    .lb-team-bar { height: 30px; }
  }
  @media (max-width: 380px) {
    .lb-list-header { grid-template-columns: 40px 1fr 32px 72px; }
    .lb-row          { grid-template-columns: 40px 1fr 32px 72px; padding: 9px 9px; }
    .lb-list-header span:nth-child(3),
    .lb-row .lb-stat.wins-col { display: none; }
  }

  /* ═══ CALENDAR ════════════════════════════════════════════════ */
  .cal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
  .cal-card {
    background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 0;
    position: relative; overflow: hidden;
    animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .cal-card.done { cursor: pointer; }
  .cal-card.done:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,0,29,0.2); border-color: rgba(232,0,29,0.25); }
  .cal-card.upcoming:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .cal-card-stripe { height: 3px; width: 100%; background: linear-gradient(90deg, var(--red), transparent); }
  .cal-card.upcoming .cal-card-stripe { background: linear-gradient(90deg, var(--cyan), transparent); }
  .cal-card-body { padding: 13px 15px 14px; }
  .cal-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .cal-round { font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 700; color: var(--dim); letter-spacing: 1.5px; }
  .cal-status { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: 'Share Tech Mono', monospace; }
  .cal-status.done     { background: rgba(232,0,29,0.12); color: var(--red); }
  .cal-status.upcoming { background: rgba(0,212,255,0.1);  color: var(--cyan); }
  .cal-race-name { font-family: 'Orbitron', sans-serif; font-size: 11.5px; font-weight: 700; color: #e8ecf0; margin-bottom: 3px; line-height: 1.2; }
  .cal-city { font-size: 10px; color: var(--muted); margin-bottom: 10px; }
  .cal-winner { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text); font-weight: 600; }
  .cal-bonuses { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
  .cal-bonus-chip { font-size: 8px; padding: 2px 6px; border-radius: 4px; font-family: 'Share Tech Mono', monospace; }

  /* ═══ MODAL ═════════════════════════════════════════════════ */
  .modal-bonus-section { display: flex; gap: 10px; flex-wrap: wrap; padding: 10px 14px; margin-bottom: 14px; background: rgba(0,212,255,0.03); border: 1px solid rgba(0,212,255,0.1); border-radius: 9px; }
  .modal-bonus-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
  .modal-bonus-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .modal-bonus-label  { color: var(--muted); }
  .modal-bonus-driver { color: var(--text); font-weight: 700; }
  .modal-bonus-pts    { color: var(--red); font-size: 9px; font-family: 'Share Tech Mono', monospace; }

  /* ═══ CAREER ════════════════════════════════════════════════ */
  .career-section { margin-bottom: 32px; }
  .career-section-title { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; color: #e8ecf0; margin-bottom: 16px; padding-bottom: 9px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .career-section-title::before { content: ''; display: block; width: 3px; height: 16px; background: var(--red); border-radius: 2px; }
  .career-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
  .career-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 16px; animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; position: relative; overflow: hidden; }
  .career-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--team-color, var(--red)), transparent); }
  .career-card:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); }
  .career-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .career-entity-dot  { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 8px currentColor; }
  .career-entity-name { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #e8ecf0; }
  .career-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(68px, 1fr)); gap: 8px; }
  .career-stat-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 8px; text-align: center; transition: border-color 0.2s; }
  .career-stat-box:hover { border-color: rgba(255,255,255,0.1); }
  .career-stat-label { font-size: 7px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; font-family: 'Share Tech Mono', monospace; }
  .career-stat-val { font-family: 'Orbitron', sans-serif; font-size: 17px; font-weight: 900; color: #e8ecf0; line-height: 1; }
  .career-stat-val.pts     { color: var(--red); }
  .career-stat-val.wins    { color: var(--gold); }
  .career-stat-val.poles   { color: var(--cyan); }
  .career-stat-val.interpole { color: #00c820; }
  .career-stat-val.podiums { color: var(--bronze); }
  .career-stat-val.wdc     { color: var(--gold); }
  .career-stat-val.wcc     { color: var(--gold); }
  .career-stat-val.GrandSlam { color: #ffea60; }
  .career-stat-val.HatTrick  { color: #ffea60; }
  .career-stat-val.constructorchamp { color: #ffea60; }
  .career-stat-val.driverchamp      { color: #ffea60; }

  /* ═══ HEAD TO HEAD ════════════════════════════════════════════ */
  .h2h-team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
  .h2h-team-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .h2h-team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.08); }
  .h2h-team-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; background: var(--bg2); }
  .h2h-team-dot  { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .h2h-team-name { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #e8ecf0; }
  .h2h-drivers-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 16px 18px; gap: 14px; background: linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 100%); }
  .h2h-driver { display: flex; flex-direction: column; gap: 3px; }
  .h2h-driver.right { align-items: flex-end; }
  .h2h-driver-name { font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700; color: #e8ecf0; display: flex; align-items: center; gap: 5px; }
  .h2h-driver-num  { font-size: 9px; color: var(--muted); font-family: 'Share Tech Mono', monospace; }
  .h2h-vs { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 900; color: var(--red); padding: 6px 12px; background: rgba(232,0,29,0.1); border: 1px solid rgba(232,0,29,0.2); border-radius: 6px; }
  .h2h-stats-grid { background: var(--border); display: grid; gap: 1px; border-top: 1px solid var(--border); }
  .h2h-stat-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; background: var(--bg1); padding: 9px 18px; gap: 12px; transition: background 0.15s; }
  .h2h-stat-row:hover { background: rgba(255,255,255,0.02); }
  .h2h-stat-val { font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 900; color: var(--muted); transition: color 0.2s; }
  .h2h-stat-val.left   { text-align: right; }
  .h2h-stat-val.winner { color: var(--red); }
  .h2h-stat-label { font-size: 8px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.2px; text-align: center; font-weight: 700; font-family: 'Share Tech Mono', monospace; white-space: nowrap; }
  .h2h-detail-section { padding: 14px 18px; border-top: 1px solid var(--border); }
  .h2h-detail-title { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 10px; font-family: 'Share Tech Mono', monospace; }
  .h2h-race-results { display: flex; flex-direction: column; gap: 4px; }
  .h2h-race-item { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; padding: 7px 10px; background: var(--bg2); border-radius: 7px; font-size: 10px; transition: background 0.15s; }
  .h2h-race-item:hover { background: rgba(255,255,255,0.04); }
  .h2h-race-name { color: var(--muted); }
  .h2h-race-pos  { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; color: var(--text); min-width: 28px; text-align: center; }
  .h2h-race-pos.winner { color: var(--red); }

  /* ═══ SETUP ═════════════════════════════════════════════════ */
  .setup-creator-container { display: grid; grid-template-columns: 360px 1fr; gap: 16px; min-height: 600px; }
  .setup-left-panel { display: flex; flex-direction: column; gap: 14px; }
  .track-selector-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 18px; animation: slideInUp 0.4s ease; }
  .track-selector-title { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #e8ecf0; margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
  .track-select { width: 100%; padding: 10px 14px; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 600; outline: none; cursor: pointer; transition: border-color 0.2s; }
  .track-select:focus { border-color: var(--cyan); }
  .track-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
  .track-info-item { padding: 10px; background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.15); border-radius: 8px; }
  .track-info-label { font-size: 7px; color: var(--dim); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; font-family: 'Share Tech Mono', monospace; }
  .track-info-value { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: var(--cyan); }
  .quick-guides-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 18px; flex: 1; overflow-y: auto; }
  .quick-guide-title { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #e8ecf0; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
  .quick-guide-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .quick-guide-section:last-child { border-bottom: none; }
  .quick-guide-section h4 { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 600; color: var(--muted); margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
  .quick-tip { font-size: 10px; color: #6a8ea0; line-height: 1.6; padding-left: 12px; position: relative; margin-bottom: 3px; }
  .quick-tip::before { content: '→'; position: absolute; left: 0; color: var(--cyan); font-size: 9px; }
  .setup-right-panel { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
  .setup-editor-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; flex-wrap: wrap; gap: 10px; }
  .setup-editor-title { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; color: #e8ecf0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
  .setup-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .setup-action-btn { padding: 8px 16px; background: var(--bg2); border: 1px solid var(--border); border-radius: 7px; color: var(--text); font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
  .setup-action-btn:hover { border-color: var(--cyan); color: var(--cyan); }
  .setup-action-btn.primary { background: linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(232,0,29,0.15) 100%); border-color: rgba(0,212,255,0.3); color: var(--cyan); }
  .setup-action-btn.primary:hover { background: linear-gradient(135deg, rgba(0,212,255,0.25) 0%, rgba(232,0,29,0.25) 100%); box-shadow: 0 4px 16px rgba(0,212,255,0.2); }
  .setup-categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
  .setup-category-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; animation: slideInUp 0.4s ease both; }
  .setup-category-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
  .setup-category-header { padding: 13px 18px; background: var(--bg2); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .setup-category-title { font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; color: #e8ecf0; display: flex; align-items: center; gap: 7px; }
  .setup-category-body { padding: 18px; }
  .setup-param-group { margin-bottom: 18px; }
  .setup-param-group:last-child { margin-bottom: 0; }
  .setup-param-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .setup-param-name  { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-family: 'Share Tech Mono', monospace; }
  .setup-param-value { font-family: 'Orbitron', sans-serif; font-size: 15px; font-weight: 900; color: var(--cyan); }
  .setup-slider { width: 100%; height: 4px; background: var(--bg2); border-radius: 2px; outline: none; -webkit-appearance: none; cursor: pointer; }
  .setup-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: var(--cyan); border-radius: 50%; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 8px rgba(0,212,255,0.5); }
  .setup-slider::-webkit-slider-thumb:hover { transform: scale(1.25); box-shadow: 0 0 16px rgba(0,212,255,0.7); }
  .setup-slider::-moz-range-thumb { width: 18px; height: 18px; background: var(--cyan); border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 0 8px rgba(0,212,255,0.5); }
  .setup-hint { margin-top: 8px; padding: 7px 11px; background: rgba(0,212,255,0.04); border-left: 2px solid rgba(0,212,255,0.35); border-radius: 0 5px 5px 0; font-size: 9.5px; color: rgba(0,212,255,0.7); line-height: 1.5; font-family: 'Share Tech Mono', monospace; }
  .setup-multi-param { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; }
  .setup-multi-item  { display: flex; flex-direction: column; gap: 5px; }
  .setup-multi-label { font-size: 7px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; text-align: center; font-family: 'Share Tech Mono', monospace; }
  .setup-multi-input { padding: 9px; background: var(--bg2); border: 1px solid var(--border); border-radius: 7px; color: var(--text); font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; text-align: center; outline: none; transition: all 0.2s; width: 100%; }
  .setup-multi-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(0,212,255,0.1); }
  .export-modal-overlay { position: fixed; inset: 0; background: rgba(3,5,8,0.9); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.2s ease; }
  .export-modal { background: var(--bg1); border: 1px solid var(--border); border-radius: 14px; max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto; animation: modalIn 0.28s cubic-bezier(.4,0,.2,1); }
  .export-modal-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .export-modal-title { font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700; color: #e8ecf0; }
  .export-modal-close { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--muted); cursor: pointer; font-size: 18px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
  .export-modal-close:hover { background: rgba(232,0,29,0.1); color: var(--red); }
  .export-modal-body { padding: 18px 22px; }
  .export-format-label { font-size: 11px; color: var(--muted); margin-bottom: 10px; display: block; font-family: 'Rajdhani', sans-serif; }
  .export-formats { display: flex; gap: 10px; margin-bottom: 18px; }
  .export-format-btn { flex: 1; padding: 14px; background: var(--bg2); border: 1px solid var(--border); border-radius: 9px; cursor: pointer; transition: all 0.2s; text-align: center; }
  .export-format-btn:hover { border-color: rgba(0,212,255,0.3); }
  .export-format-btn.active { border-color: var(--red); background: rgba(232,0,29,0.08); }
  .export-format-icon { font-size: 22px; margin-bottom: 7px; }
  .export-format-name { font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; color: #e8ecf0; }
  .export-preview { background: var(--bg2); border: 1px solid var(--border); border-radius: 9px; padding: 14px; font-family: 'Share Tech Mono', monospace; font-size: 9.5px; color: var(--text); max-height: 260px; overflow-y: auto; white-space: pre-wrap; line-height: 1.7; }
  .export-actions { display: flex; gap: 10px; margin-top: 16px; }
  .export-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(232,0,29,0.2) 100%); border: 1px solid rgba(0,212,255,0.3); border-radius: 9px; color: var(--cyan); font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .export-btn:hover { box-shadow: 0 6px 24px rgba(0,212,255,0.25); transform: translateY(-2px); }

  /* ═══ RULES ══════════════════════════════════════════════════ */
  .rules-grid { display: grid; gap: 10px; }
  .rule-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; animation: slideInUp 0.4s cubic-bezier(.4,0,.2,1) both; transition: border-color 0.2s, box-shadow 0.2s; }
  .rule-card:hover { border-color: rgba(255,255,255,0.08); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .rule-header { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; background: linear-gradient(90deg, rgba(255,255,255,0.01) 0%, transparent 100%); transition: background 0.2s; }
  .rule-header:hover { background: rgba(255,255,255,0.02); }
  .rule-header-left { display: flex; align-items: center; gap: 12px; }
  .rule-icon { font-size: 20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(232,0,29,0.08); border: 1px solid rgba(232,0,29,0.15); border-radius: 10px; }
  .rule-title { font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700; color: #e8ecf0; }
  .rule-toggle { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: var(--bg2); border: 1px solid var(--border); color: var(--muted); font-size: 10px; transition: transform 0.35s cubic-bezier(.4,0,.2,1), background 0.2s, color 0.2s; }
  .rule-card.expanded .rule-toggle { transform: rotate(180deg); background: rgba(232,0,29,0.1); color: var(--red); border-color: rgba(232,0,29,0.2); }
  .rule-content { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.45s cubic-bezier(.4,0,.2,1), opacity 0.3s; }
  .rule-card.expanded .rule-content { max-height: none; opacity: 1; }
  .rule-content-inner { padding: 0 20px 20px; border-top: 1px solid var(--border); }
  .rule-text { font-size: 12px; color: #6a8ea0; line-height: 1.8; margin-top: 16px; font-family: 'Rajdhani', sans-serif; }
  .rule-text-item { margin-bottom: 5px; }

  @media (max-width: 900px) {
    .setup-creator-container { grid-template-columns: 1fr; height: auto; }
    .setup-left-panel { flex-direction: row; }
    .track-selector-card, .quick-guides-card { flex: 1; min-width: 0; }
    .h2h-team-grid { grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
    .career-grid   { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
  }
  @media (max-width: 600px) {
    .f1-header-top { padding: 12px 14px 0; }
    .f1-title { font-size: 16px; }
    .f1-subtitle { display: none; }
    .f1-nav { padding: 8px 14px 0; }
    .f1-nav-btn { padding: 8px 11px; font-size: 10px; }
    .f1-page { padding: 14px 10px 44px; }
    .lb-driver-name { font-size: 10.5px; }
    .lb-pts { font-size: 15px; }
    .cal-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .cal-race-name { font-size: 10px; }
    .h2h-team-grid { grid-template-columns: 1fr; }
    .career-grid { grid-template-columns: 1fr; }
    .setup-creator-container { grid-template-columns: 1fr; }
    .setup-left-panel { flex-direction: column; }
    .setup-categories-grid { grid-template-columns: 1fr; }
    .export-formats { flex-direction: column; }
  }
  @media (max-width: 380px) {
    .f1-title { font-size: 14px; }
    .f1-nav-btn { padding: 7px 9px; font-size: 9px; }
    .f1-nav-icon { display: none; }
    .cal-grid { grid-template-columns: 1fr; }
    .career-stat-val { font-size: 15px; }
  }
`;

// ─── BONUS BADGE component ────────────────────────────────────────
function BonusBadge({ bonusKey, count }) {
  const cfg = BONUS_CONFIG[bonusKey];
  if (!cfg || count === 0) return null;
  return (
    <span className="lb-bonus-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} ×{count}
    </span>
  );
}

// ─── SEASON SELECTOR ──────────────────────────────────────────────
function SeasonSelector({ currentSeason, onSeasonChange }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="season-selector">
      <button className={`season-btn${isOpen ? " open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{currentSeason}</span>
        <span className="season-btn-chevron">▼</span>
      </button>
      {isOpen && (
        <div className="season-dropdown">
          {SEASONS.map((season) => (
            <div key={season} className={`season-option${season === currentSeason ? " active" : ""}`}
              onClick={() => { onSeasonChange(season); setIsOpen(false); }}>
              {season}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── RACE RESULTS MODAL ───────────────────────────────────────────
function RaceResultsModal({ race, raceResults, raceExtras, season, onClose }) {
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);
  const raceData  = raceResults.find(r => r.race === race.raceKey);
  const extraData = raceExtras.find(r => r.race === race.raceKey);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!raceData) return null;

  // Build per-driver bonus icons from all bonus keys
  const driverBonuses = {};
  if (extraData) {
    ALL_BONUS_KEYS.forEach(k => {
      const winner = extraData[k];
      if (winner) {
        driverBonuses[winner] = [...(driverBonuses[winner] || []), { icon: BONUS_CONFIG[k].icon, key: k }];
      }
    });
  }

  // Which bonus keys have a winner this race
  const activeBonuses = extraData
    ? ALL_BONUS_KEYS.filter(k => extraData[k])
    : [];

  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(3,5,8,0.92)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#080c14',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          width: '100%',
          maxWidth: 440,
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: '#e8ecf0' }}>{race.race}</div>
            <div style={{ fontSize: 10, color: '#3d5a6e', marginTop: 3, fontFamily: "'Share Tech Mono', monospace" }}>{race.city} · Round {race.round}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#3d5a6e', cursor: 'pointer', fontSize: 20, lineHeight: 1, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, flexShrink: 0 }}>×</button>
        </div>

        {/* Body scrollabile */}
        <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1 }}>

          {/* Bonus section — now shows ALL bonus types */}
          {activeBonuses.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '9px 13px', marginBottom: 13, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 9 }}>
              {activeBonuses.map(k => {
                const cfg = BONUS_CONFIG[k];
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dotColor, flexShrink: 0 }} />
                    <span style={{ color: '#3d5a6e' }}>{cfg.label}:</span>
                    <span style={{ color: '#c8d6e0', fontWeight: 700 }}> {extraData[k]}</span>
                    <span style={{ color: '#e8001d', fontSize: 9, fontFamily: "'Share Tech Mono',monospace" }}> +1pt</span>
                  </div>
                );
              })}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 44 }} />
              <col />
              <col style={{ width: 52 }} />
            </colgroup>
            <tbody>
              {raceData.results.map((driver, i) => {
                const info    = DRIVER_TEAMS[driver];
                const points  = i < POINTS_TABLE.length ? POINTS_TABLE[i] : 0;
                const bonuses = driverBonuses[driver] || [];
                const totalPts = points + bonuses.length;
                const posColor = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#3d5a6e';
                return (
                  <tr key={`${driver}-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 4px', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 700, fontSize: 11, color: posColor, display: 'inline-block', minWidth: 32 }}>P{i + 1}</span>
                    </td>
                    <td style={{ padding: '8px 4px', verticalAlign: 'middle', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                        <span style={{ fontSize: 13, flexShrink: 0 }}>{info?.flag || '🏁'}</span>
                        <span style={{ color: '#e8ecf0', fontWeight: 600, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{driver}</span>
                        {bonuses.map((b, bi) => <span key={bi} style={{ fontSize: 11, flexShrink: 0 }}>{b.icon}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '8px 4px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 10, color: '#3d5a6e', fontFamily: "'Share Tech Mono',monospace" }}>
                        {totalPts > 0 ? `${totalPts}pt` : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────
function LeaderboardPage({ season }) {
  const [tab, setTab] = useState("drivers");
  const [expandedDriver, setExpandedDriver] = useState(null);
  const seasonData      = SEASON_DATA[season];
  const driverStandings = useMemo(() => computeDriverStandings(seasonData.races, seasonData.raceExtras, season), [season]);
  const teamStandings   = useMemo(() => computeTeamStandings(seasonData.races, seasonData.raceExtras, season), [season]);
  const seasonPoles     = useMemo(() => computeSeasonPoles(seasonData.raceExtras), [season]);
  const maxPts     = driverStandings[0]?.points || 1;
  const maxTeamPts = teamStandings[0]?.points || 1;

  function getDriverRaces(driverName) {
    return seasonData.races.map(({ race, results }, raceIdx) => {
      const pos   = results.indexOf(driverName);
      const extra = seasonData.raceExtras[raceIdx] || {};
      const bonuses = ALL_BONUS_KEYS
        .filter(k => extra[k] === driverName)
        .map(k => BONUS_CONFIG[k].icon);
      const racePts = pos >= 0 && pos < POINTS_TABLE.length ? POINTS_TABLE[pos] : 0;
      return { race, pos: pos >= 0 ? pos + 1 : null, pts: racePts + bonuses.length, bonuses };
    }).filter(r => r.pos !== null);
  }

  return (
    <>
      <div className="lb-tabs">
        <button className={`lb-tab${tab === "drivers" ? " active" : ""}`} onClick={() => setTab("drivers")}>Piloti</button>
        <button className={`lb-tab${tab === "teams"   ? " active" : ""}`} onClick={() => setTab("teams")}>Costruttori</button>
      </div>

      {tab === "drivers" && (
        <div className="lb-list">
          <div className="lb-list-header">
            <span>#</span>
            <span>Pilota</span>
            <span>V</span>
            <span>Podi</span>
            <span>Pole</span>
            <span>Punti</span>
          </div>
          {driverStandings.map((d, i) => {
            const isExp = expandedDriver === d.name;
            const races = isExp ? getDriverRaces(d.name) : [];
            const pct   = Math.round((d.points / maxPts) * 100);
            const poles = seasonPoles[d.name] || 0;
            const posClass = i === 0 ? " p1" : i === 1 ? " p2" : i === 2 ? " p3" : "";
            // Which bonus keys this driver earned at least once
            const earnedBonuses = ALL_BONUS_KEYS.filter(k => (d.bonusBreakdown?.[k] || 0) > 0);
            return (
              <div key={d.name} className={`lb-row rank-${i + 1}`} style={{ animationDelay: `${i * 0.035}s` }}>
                {/* Position */}
                <div className="lb-pos-wrap">
                  <div className={`lb-pos${posClass}`}>{i + 1}</div>
                </div>
                {/* Driver */}
                <div className="lb-driver-cell">
                  <div className="lb-team-bar" style={{ background: TEAM_COLORS[d.team] || "#555", boxShadow: `0 0 6px ${TEAM_COLORS[d.team] || "#555"}44` }} />
                  <div className="lb-driver-info">
                    <div className="lb-driver-name">{d.flag} {d.name}</div>
                    <div className="lb-driver-meta">
                      <span className="lb-driver-team">{d.team}</span>
                      <span className="lb-driver-num">#{d.num}</span>
                    </div>
                    {/* Bonus badges — all types */}
                    {earnedBonuses.length > 0 && (
                      <div className="lb-bonus-row">
                        {earnedBonuses.map(k => (
                          <BonusBadge key={k} bonusKey={k} count={d.bonusBreakdown[k]} />
                        ))}
                      </div>
                    )}
                    {seasonData.races.some(r => r.results.includes(d.name)) && (
                      <>
                        <button className="lb-race-toggle" onClick={() => setExpandedDriver(isExp ? null : d.name)}>
                          {isExp ? "▲ chiudi" : "▼ risultati"}
                        </button>
                        <div className={`lb-race-list${isExp ? " open" : ""}`}>
                          {races.map((r) => (
                            <div className="lb-race-item" key={r.race}>
                              <span className="lb-race-item-name">{r.race}</span>
                              <span className="lb-race-item-pos">
                                P{r.pos} · {r.pts}pt
                                {r.bonuses.length > 0 && <span style={{ color: 'var(--red)' }}> {r.bonuses.join('')}</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* V */}
                <span className={`lb-stat wins-col${d.wins === 0 ? " zero" : ""}`}>{d.wins}</span>
                {/* Podi */}
                <span className={`lb-stat podiums-col${d.podiums === 0 ? " zero" : ""}`}>{d.podiums}</span>
                {/* Pole */}
                <span className={`lb-stat poles-col${poles === 0 ? " zero" : ""}`}>{poles}</span>
                {/* Punti */}
                <div className="lb-pts-wrap">
                  <span className="lb-pts">{d.points}</span>
                  {d.bonusTotal > 0 && <div className="lb-pts-breakdown">{d.racePoints}+{d.bonusTotal}b</div>}
                  <div className="lb-bar-wrap"><div className="lb-bar-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "teams" && (
        <div className="lb-list">
          <div className="lb-list-header">
            <span>#</span>
            <span>Costruttore</span>
            <span>V</span>
            <span>Pole</span>
            <span></span>
            <span>Punti</span>
          </div>
          {teamStandings.map((t, i) => {
            const pct = Math.round((t.points / maxTeamPts) * 100);
            const tc  = TEAM_COLORS[t.team] || 'var(--red)';
            const posClass = i === 0 ? " p1" : i === 1 ? " p2" : i === 2 ? " p3" : "";
            const DRIVER_TEAMS_CUR = getDriverTeamsForSeason(season);
            const teamPoles = Object.entries(DRIVER_TEAMS_CUR)
              .filter(([, info]) => info.team === t.team)
              .reduce((sum, [name]) => sum + (seasonPoles[name] || 0), 0);
            return (
              <div key={t.team} className={`lb-row rank-${i + 1}`} style={{ animationDelay: `${i * 0.045}s` }}>
                <div className="lb-pos-wrap">
                  <div className={`lb-pos${posClass}`}>{i + 1}</div>
                </div>
                <div className="lb-driver-cell">
                  <div className="lb-team-bar" style={{ background: tc, boxShadow: `0 0 6px ${tc}44` }} />
                  <div className="lb-driver-info">
                    <div className="lb-driver-name">{t.team}</div>
                  </div>
                </div>
                <span className={`lb-stat wins-col${t.wins === 0 ? " zero" : ""}`}>{t.wins}</span>
                <span className={`lb-stat poles-col${teamPoles === 0 ? " zero" : ""}`}>{teamPoles}</span>
                <span></span>
                <div className="lb-pts-wrap">
                  <span className="lb-pts">{t.points}</span>
                  <div className="lb-bar-wrap"><div className="lb-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${tc},${tc}88)` }} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────
function CalendarPage({ season }) {
  const [selectedRace, setSelectedRace] = useState(null);
  const seasonData = SEASON_DATA[season];
  return (
    <>
      <div className="cal-grid">
        {seasonData.calendar.map((race, i) => {
          const extra = seasonData.raceExtras.find(e => e.race === race.raceKey) || {};
          // Collect all active bonuses for this race
          const activeBonuses = ALL_BONUS_KEYS.filter(k => extra[k]);
          return (
            <div key={race.round}
              className={`cal-card ${race.status}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => race.status === "done" && race.raceKey && setSelectedRace(race)}>
              <div className="cal-card-stripe" />
              <div className="cal-card-body">
                <div className="cal-card-header">
                  <span className="cal-round">Round {String(race.round).padStart(2, '0')}</span>
                  <span className={`cal-status ${race.status}`}>{race.status === "done" ? "✓ Done" : "Soon"}</span>
                </div>
                <div className="cal-race-name">{race.race}</div>
                <div className="cal-city">{race.city}</div>
                {race.winner && race.winner !== "..." && (
                  <div className="cal-winner">
                    <span>🏆</span>
                    <span style={{ fontFamily: 'Orbitron', fontSize: 11, fontWeight: 700 }}>{race.winner}</span>
                  </div>
                )}
                {/* Bonus chips — all types */}
                {race.status === "done" && activeBonuses.length > 0 && (
                  <div className="cal-bonuses">
                    {activeBonuses.map(k => {
                      const cfg = BONUS_CONFIG[k];
                      return (
                        <span key={k} className="cal-bonus-chip" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {extra[k]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedRace && (
        <RaceResultsModal
          race={selectedRace}
          raceResults={seasonData.races}
          raceExtras={seasonData.raceExtras}
          season={season}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </>
  );
}

// ─── CAREER PAGE ──────────────────────────────────────────────────
function CareerPage() {
  const drivers = useMemo(() => {
    const currentTeams = getDriverTeamsForSeason("Stagione 1");
    return Object.keys(DRIVER_TEAMS_BASE).map((name) => ({
      name, ...DRIVER_TEAMS_BASE[name],
      team: currentTeams[name]?.team || DRIVER_TEAMS_BASE[name].team,
      ...CAREER_STATS[name],
    })).sort((a, b) =>
      b.championships - a.championships ||
      b.totalWins     - a.totalWins     ||
      b.totalPodiums  - a.totalPodiums  ||
      b.totalPoints   - a.totalPoints
    );
  }, []);
  const teams = useMemo(() => {
    return Object.entries(TEAM_CAREER_STATS)
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) =>
        b.championships - a.championships ||
        b.totalWins     - a.totalWins     ||
        b.totalPoints   - a.totalPoints
      );
  }, []);
  const driversWithInterpole = ['Igor', 'Alex', 'Manuel'];

  return (
    <>
      <div className="career-section">
        <h3 className="career-section-title">Piloti</h3>
        <div className="career-grid">
          {drivers.map((d, i) => (
            <div className="career-card" key={d.name} style={{ animationDelay: `${i * 0.03}s`, '--team-color': TEAM_COLORS[d.team] || 'var(--red)' }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[d.team] || '#555', color: TEAM_COLORS[d.team] || '#555' }} />
                <div className="career-entity-name">{d.flag} {d.name}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box"><div className="career-stat-label">Punti</div><div className="career-stat-val pts">{d.totalPoints}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Pole</div><div className="career-stat-val poles">{d.totalPoles}</div></div>
                {driversWithInterpole.includes(d.name) && (
                  <div className="career-stat-box"><div className="career-stat-label">Interpole</div><div className="career-stat-val interpole">{d.totalInterpole || 0}</div></div>
                )}
                <div className="career-stat-box"><div className="career-stat-label">Vittorie</div><div className="career-stat-val wins">{d.totalWins}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Podi</div><div className="career-stat-val podiums">{d.totalPodiums}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Hat Trick</div><div className="career-stat-val HatTrick">{d.HatTrick}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Grand Slam</div><div className="career-stat-val GrandSlam">{d.GrandSlam}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WDC</div><div className="career-stat-val wdc">{d.championships}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WCC</div><div className="career-stat-val wcc">{d.constructorchamp}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="career-section">
        <h3 className="career-section-title">Costruttori</h3>
        <div className="career-grid">
          {teams.map((t, i) => (
            <div className="career-card" key={t.team} style={{ animationDelay: `${i * 0.035}s`, '--team-color': TEAM_COLORS[t.team] || 'var(--red)' }}>
              <div className="career-card-header">
                <div className="career-entity-dot" style={{ background: TEAM_COLORS[t.team] || '#555', color: TEAM_COLORS[t.team] || '#555' }} />
                <div className="career-entity-name">{t.team}</div>
              </div>
              <div className="career-stats">
                <div className="career-stat-box"><div className="career-stat-label">Punti</div><div className="career-stat-val pts">{t.totalPoints}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Pole</div><div className="career-stat-val poles">{t.totalPoles}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">Vittorie</div><div className="career-stat-val wins">{t.totalWins}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WCC</div><div className="career-stat-val wcc">{t.championships}</div></div>
                <div className="career-stat-box"><div className="career-stat-label">WDC</div><div className="career-stat-val wdc">{t.driverchamp}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── HEAD TO HEAD PAGE ────────────────────────────────────────────
function HeadToHeadPage({ season }) {
  const seasonData   = SEASON_DATA[season];
  const seasonPoles  = useMemo(() => computeSeasonPoles(seasonData.raceExtras), [season]);
  const DRIVER_TEAMS = getDriverTeamsForSeason(season);

  const teamPairs = useMemo(() => {
    const teams = {};
    Object.entries(DRIVER_TEAMS).forEach(([driver, info]) => {
      if (!teams[info.team]) teams[info.team] = [];
      teams[info.team].push({ name: driver, ...info });
    });
    return Object.entries(teams)
      .filter(([, drivers]) => drivers.length === 2)
      .map(([team, drivers]) => ({ team, drivers }));
  }, [season]);

  function calculateH2H(driver1, driver2) {
    const s1 = { points: 0, wins: 0, podiums: 0, poles: 0, raceWins: 0, races: [] };
    const s2 = { points: 0, wins: 0, podiums: 0, poles: 0, raceWins: 0, races: [] };
    seasonData.races.forEach(({ race, results }, idx) => {
      const pos1  = results.indexOf(driver1.name);
      const pos2  = results.indexOf(driver2.name);
      const extra = seasonData.raceExtras[idx] || {};
      if (pos1 >= 0 && pos1 < POINTS_TABLE.length) s1.points += POINTS_TABLE[pos1];
      if (pos2 >= 0 && pos2 < POINTS_TABLE.length) s2.points += POINTS_TABLE[pos2];
      if (pos1 === 0) s1.wins++;
      if (pos2 === 0) s2.wins++;
      if (pos1 >= 0 && pos1 < 3) s1.podiums++;
      if (pos2 >= 0 && pos2 < 3) s2.podiums++;
      ALL_BONUS_KEYS.forEach(k => {
        if (extra[k] === driver1.name) s1.points++;
        if (extra[k] === driver2.name) s2.points++;
      });
      s1.poles = seasonPoles[driver1.name] || 0;
      s2.poles = seasonPoles[driver2.name] || 0;
      if (pos1 >= 0 && pos2 >= 0) {
        if (pos1 < pos2) s1.raceWins++;
        else if (pos2 < pos1) s2.raceWins++;
        s1.races.push({ race, pos: pos1 + 1 });
        s2.races.push({ race, pos: pos2 + 1 });
      }
    });
    return { stats1: s1, stats2: s2 };
  }

  return (
    <div className="h2h-team-grid">
      {teamPairs.map(({ team, drivers }, idx) => {
        const [driver1, driver2] = drivers;
        const { stats1, stats2 } = calculateH2H(driver1, driver2);
        return (
          <div className="h2h-team-card" key={team} style={{ animationDelay: `${idx * 0.055}s` }}>
            <div className="h2h-team-header">
              <div className="h2h-team-dot" style={{ background: TEAM_COLORS[team] || '#555', boxShadow: `0 0 8px ${TEAM_COLORS[team] || '#555'}66` }} />
              <div className="h2h-team-name">{team}</div>
            </div>
            <div className="h2h-drivers-row">
              <div className="h2h-driver">
                <div className="h2h-driver-name"><span>{driver1.flag}</span><span>{driver1.name}</span></div>
                <div className="h2h-driver-num">#{driver1.num}</div>
              </div>
              <div className="h2h-vs">VS</div>
              <div className="h2h-driver right">
                <div className="h2h-driver-name"><span>{driver2.name}</span><span>{driver2.flag}</span></div>
                <div className="h2h-driver-num">#{driver2.num}</div>
              </div>
            </div>
            <div className="h2h-stats-grid">
              {[
                [stats1.points,  stats2.points,  "Punti"],
                [stats1.wins,    stats2.wins,    "Vittorie"],
                [stats1.podiums, stats2.podiums, "Podi"],
                [stats1.poles,   stats2.poles,   "Pole"],
                [stats1.raceWins,stats2.raceWins,"H2H"],
              ].map(([v1, v2, label]) => (
                <div className="h2h-stat-row" key={label}>
                  <div className={`h2h-stat-val left${v1 > v2 ? " winner" : ""}`}>{v1}</div>
                  <div className="h2h-stat-label">{label}</div>
                  <div className={`h2h-stat-val${v2 > v1 ? " winner" : ""}`}>{v2}</div>
                </div>
              ))}
            </div>
            {stats1.races.length > 0 && (
              <div className="h2h-detail-section">
                <div className="h2h-detail-title">Risultati Gara per Gara</div>
                <div className="h2h-race-results">
                  {stats1.races.map((r1, i) => {
                    const r2 = stats2.races[i];
                    return (
                      <div className="h2h-race-item" key={r1.race}>
                        <div className="h2h-race-name">{r1.race}</div>
                        <div className={`h2h-race-pos${r1.pos < r2.pos ? " winner" : ""}`}>P{r1.pos}</div>
                        <div className={`h2h-race-pos${r2.pos < r1.pos ? " winner" : ""}`}>P{r2.pos}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}



// ─── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  useFonts();
  const [page, setPage]     = useState("leaderboard");
  const [season, setSeason] = useState(SEASONS[0]);
  const [pageKey, setPageKey] = useState(0);

  const seasonData     = SEASON_DATA[season];
  const completedRaces = seasonData.calendar.filter(r => r.status === "done").length;
  const totalRaces     = seasonData.calendar.length;

  const handleNav    = (id) => { setPage(id); setPageKey(k => k + 1); };
  const handleSeason = (s)  => { setSeason(s); setPageKey(k => k + 1); };

  const pageInfo = {
    leaderboard: { title: "Classifica Generale",  subtitle: `${season} · ${completedRaces}/${totalRaces} gare completate` },
    calendar:    { title: "Calendario",           subtitle: `${season} · ${totalRaces} gare programmate` },
    h2h:         { title: "Head-to-Head",         subtitle: `${season} · Confronto compagni di squadra` },
    career:      { title: "Statistiche Carriera", subtitle: `Tutte le stagioni · Totali carriera` },
  };

  const showSeasonSelector = ["leaderboard", "calendar", "h2h"].includes(page);

  return (
    <>
      <style>{css}</style>
      <div className="f1-root">
        <div className="f1-grid-bg" />
        <div className="f1-accent-lines" />
        <div className="f1-vignette" />
        <div className="f1-scanline" />

        <header className="f1-header">
          <div className="f1-header-top">
            <div className="f1-logo-area">
              <div className="f1-stripes">
                <div className="f1-stripe" />
                <div className="f1-stripe" />
                <div className="f1-stripe" />
              </div>
              <div className="f1-logo-text">
                <div className="f1-status">
                  <div className="f1-status-dot" />
                  <span className="f1-status-label">{season} · Live</span>
                </div>
                <div className="f1-title-row">
                  <h1 className="f1-title">F1 Dashboard</h1>
                  <span className="f1-subtitle">Pro · Season Manager</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="f1-nav">
            {NAV.map((n) => (
              <button key={n.id} className={`f1-nav-btn${page === n.id ? " active" : ""}`} onClick={() => handleNav(n.id)}>
                <span className="f1-nav-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="f1-page">
          <div className="page-header">
            <div className="page-header-left">
              <h2>{pageInfo[page].title}</h2>
              <p>{pageInfo[page].subtitle}</p>
            </div>
            {showSeasonSelector && <SeasonSelector currentSeason={season} onSeasonChange={handleSeason} />}
          </div>

          <div key={pageKey} className="page-enter">
            {page === "leaderboard" && <LeaderboardPage season={season} />}
            {page === "calendar"    && <CalendarPage    season={season} />}
            {page === "h2h"         && <HeadToHeadPage  season={season} />}
            {page === "career"      && <CareerPage />}
          </div>
        </div>
      </div>
    </>
  );
}