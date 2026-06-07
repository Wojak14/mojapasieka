export const beeCalendarData = {
  "2026-07-01": { type: "pozytek", text: "lipa (resztki)" },
  "2026-07-02": { type: "miodobranie", text: "miodobranie lipa" },
  "2026-07-03": { type: "miodobranie" },
  "2026-07-20": { type: "kontrola", text: "ocena rodzin" },

  "2026-08-20": { type: "karmienie", text: "START KARMIENIA" },
  "2026-09-21": { type: "leczenie", text: "warroza start" },
  "2026-10-16": { type: "alert", text: "przymrozki" },
};

export const CalendarModule = (() => {

  // =========================
  // STATE
  // =========================
  let currentDay = null;
  let currentMonth = null;
  let currentApiary = null;

  const YEAR = 2026;

  let isBound = false;

  // =========================
  // UTILS
  // =========================
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getKey(day, month) {
    return `${pad(day)}.${pad(month)}.${YEAR}`;
  }

  function isValidKey(key) {
    return /^\d{2}\.\d{2}\.\d{2}2026$/.test(key);
  }

  function apiaryKey(key) {
    return currentApiary ? `${currentApiary.id}_${key}` : key;
  }

  // =========================
  // 🧠 AI NOTE ENGINE (NOWY BLOK)
  // =========================
  function analyzeNoteAI(note, weather) {

    const text = (note || "").toLowerCase();

    let risk = 10;
    let type = "GENERAL";
    let advice = "Standardowe działania";

    if (text.includes("rój") || text.includes("rojka")) {
      risk += 50;
      type = "SWARM";
      advice = "⚠️ Możliwe ryzyko rójki – sprawdź matkę i miejsce";
    }

    if (text.includes("miód") || text.includes("miodobranie")) {
      risk += 30;
      type = "HONEY";
      advice = "🍯 Dzień zbioru miodu – sprawdź warunki";
    }

    if (text.includes("warroza") || text.includes("leczenie")) {
      type = "TREATMENT";
      advice = "💊 Zabiegi – kontroluj czas i temperaturę";
    }

    if (weather) {
      if (weather.wind > 30) risk += 30;
      if (weather.temp < 12) risk += 20;
      if (weather.rain > 40) risk += 25;

      if (weather.temp >= 18 && weather.wind < 15 && weather.rain < 20) {
        advice = "🐝 Idealne warunki do pracy w ulu";
        risk -= 10;
      }
    }

    risk = Math.max(0, Math.min(100, risk));

    return { risk, type, advice };
  }

  // =========================
  // STORAGE
  // =========================
  function getNote(key) {
    return localStorage.getItem(apiaryKey(key)) || "";
  }

  function saveNote(key, value) {
    localStorage.setItem(apiaryKey(key), value);
  }

  // =========================
  // ICON ENGINE
  // =========================
function generateIcons(text = "") {

  const t = text.toLowerCase();
  const icons = [];

  if (t.includes("miód") || t.includes("miodobranie") || t.includes("wirowanie")) icons.push("🫙");
  if (t.includes("odwirowanie") || t.includes("wirowanie")) icons.push("⚙️🍯");
  if (t.includes("odsklepianie")) icons.push("🧹🍯");
  if (t.includes("ramka") || t.includes("ramki")) icons.push("🧱");
  if (t.includes("nadstawka")) icons.push("📦");

  if (t.includes("rój") || t.includes("rojka") || t.includes("rójka")) icons.push("🐝🔥");
  if (t.includes("matka") || t.includes("wymiana matki")) icons.push("👑🐝");
  if (t.includes("czerw") || t.includes("czerwiu")) icons.push("🐣");
  if (t.includes("trutnie")) icons.push("👨‍🌾");
  if (t.includes("pszczoły") || t.includes("pszczo")) icons.push("🐝");

  if (t.includes("leczenie") || t.includes("warroza")) icons.push("💊");
  if (t.includes("apiwarol") || t.includes("kwas")) icons.push("🧪💊");
  if (t.includes("paski")) icons.push("🏷️💊");
  if (t.includes("dezynfekcja")) icons.push("🧴");
  if (t.includes("zakażenie") || t.includes("choroba")) icons.push("🦠");

  if (t.includes("pożytek")) icons.push("🌸");
  if (t.includes("nektar")) icons.push("🍯🌼");
  if (t.includes("pyłek")) icons.push("🌼🐝");

  if (t.includes("ul") || t.includes("ule")) icons.push("🏠");
  if (t.includes("inspekcja") || t.includes("kontrola") || t.includes("przegląd")) icons.push("🔍");
  if (t.includes("przenoszenie") || t.includes("transport")) icons.push("🚚🐝");
  if (t.includes("łączenie rodzin")) icons.push("🔗🐝");

  if (t.includes("deszcz")) icons.push("🌧️");
  if (t.includes("wiatr")) icons.push("💨");
  if (t.includes("burza")) icons.push("🌩️");
  if (t.includes("śnieg")) icons.push("❄️");
  if (t.includes("mróz")) icons.push("🥶");
  if (t.includes("upał")) icons.push("🥵");
  if (t.includes("pochmurno")) icons.push("☁️");
  if (t.includes("mgła")) icons.push("🌫️");
  if (t.includes("słonecznie")) icons.push("☀️");

  if (t.includes("rój") || t.includes("rojka")) icons.push("⚠️🐝");
  if (t.includes("brak prac")) icons.push("⛔");
  if (t.includes("złe warunki")) icons.push("⚠️");
  if (t.includes("ucieczka pszczół")) icons.push("🏃‍♂️🐝");

  return icons.length ? icons : ["📒"];
}

function analyzeNoteAI(note = "", weather = null) {

  const t = note.toLowerCase();

  let risk = 10;
  let type = "GENERAL";
  let priority = "LOW";
  let advice = "Standardowe działania w pasiece";
  let alerts = [];

  // =========================
  // 🐝 ROJKA (HIGHEST RISK)
  // =========================
  if (t.includes("rój") || t.includes("rojka") || t.includes("rójka")) {
    risk += 60;
    type = "SWARM";
    priority = "HIGH";
    advice = "⚠️ Ryzyko rójki – sprawdź matkę, miejsce i wentylację";
    alerts.push("🐝 RYZYKO ROJENIA");
  }

  // =========================
  // 👑 MATKA
  // =========================
  if (t.includes("matka") || t.includes("wymiana matki")) {
    risk += 30;
    type = "QUEEN";
    priority = "MEDIUM";
    advice = "👑 Operacja na matce – kontroluj rodzinę i czerw";
    alerts.push("👑 MATKA");
  }

  // =========================
  // 🍯 MIÓD
  // =========================
  if (t.includes("miód") || t.includes("miodobranie") || t.includes("wirowanie")) {
    risk += 25;
    type = "HONEY";
    priority = "MEDIUM";
    advice = "🍯 Praca przy miodzie – sprawdź pogodę i siłę rodzin";
    alerts.push("🍯 MIÓD");
  }

  // =========================
  // 💊 LECZENIE
  // =========================
  if (t.includes("warroza") || t.includes("leczenie") || t.includes("apiwarol")) {
    risk += 20;
    type = "TREATMENT";
    priority = "MEDIUM";
    advice = "💊 Zabiegi lecznicze – kontroluj temperaturę i czas";
    alerts.push("💊 LECZENIE");
  }

  // =========================
  // 🌧️ POGODA RYZYKA
  // =========================
  if (weather) {

    if (weather.wind > 30) {
      risk += 30;
      alerts.push("💨 SILNY WIATR");
    }

    if (weather.temp < 12) {
      risk += 25;
      alerts.push("🥶 ZA ZIMNO");
    }

    if (weather.rain > 40) {
      risk += 25;
      alerts.push("🌧 DESZCZ");
    }

    if (weather.temp >= 18 && weather.wind < 15 && weather.rain < 20) {
      risk -= 15;
      priority = "LOW";
      advice = "🐝 IDEALNE WARUNKI DO PRACY";
    }
  }

  // =========================
  // 🔥 FINAL NORMALIZACJA
  // =========================
  risk = Math.max(0, Math.min(100, risk));

  if (risk >= 70) priority = "HIGH";
  else if (risk >= 40) priority = "MEDIUM";
  else priority = "LOW";

  return {
    risk,
    type,
    priority,
    advice,
    alerts
  };
}

  // =========================
  // MARKERS ENGINE
  // =========================
function updateMarkers(weatherData = null) {

  const spans = document.querySelectorAll("td .day-number");
  if (!spans.length) return;

  spans.forEach(span => {

    const td = span.closest("td");
    if (!td) return;

    const day = span.dataset.day;
    const month = span.dataset.month;

    const key = getKey(day, month);
    const note = getNote(key);

    // 🧠 AI ANALYSIS
    const ai = analyzeNoteAI(note, weatherData);

    // RESET
    td.classList.remove(
      "has-note",
      "risk-low",
      "risk-medium",
      "risk-high"
    );

    const old = td.querySelector(".note-marker");
    if (old) old.remove();

    // =========================
    // 🟢🟡🔴 COLOR SYSTEM
    // =========================
    if (ai.risk >= 70) td.classList.add("risk-high");
    else if (ai.risk >= 40) td.classList.add("risk-medium");
    else td.classList.add("risk-low");

    // =========================
    // NOTE MARKER
    // =========================
    if (note.trim()) {

      td.classList.add("has-note");

      const marker = document.createElement("span");
      marker.className = "note-marker";
      marker.textContent = generateIcons(note).join(" ");

      span.after(marker);
    }

    // =========================
    // ⚠️ HIGH RISK ALERT
    // =========================
    if (ai.risk >= 70) {
      const alert = document.createElement("div");
      alert.className = "day-alert";
      alert.textContent = "🚨 NIE OTWIERAJ ULA";

      td.appendChild(alert);
    }

  });
}

  // =========================
  // CLICK SYSTEM
  // =========================
  function bindClicks(onOpenNote) {

    if (isBound) return;
    isBound = true;

    document.querySelectorAll("td .day-number").forEach(span => {

      span.addEventListener("click", () => {

        currentDay = span.dataset.day;
        currentMonth = span.dataset.month;

        const key = getKey(currentDay, currentMonth);

        onOpenNote?.({
          key,
          day: currentDay,
          month: currentMonth
        });
      });
    });
  }

  // =========================
  // SAVE
  // =========================
  function saveFromTextarea(textarea) {

    if (!textarea) return;

    const key = (currentDay && currentMonth)
      ? getKey(currentDay, currentMonth)
      : getKey(new Date().getDate(), new Date().getMonth() + 1);

    saveNote(key, textarea.value);

    updateMarkers();
  }

  // =========================
  // SEARCH
  // =========================
  function searchNotes(query) {

    if (!query) return [];

    query = query.toLowerCase();

    const results = [];

    for (let i = 0; i < localStorage.length; i++) {

      const key = localStorage.key(i);
      if (!key || !isValidKey(key)) continue;

      const note = localStorage.getItem(key);

      if (note?.toLowerCase().includes(query)) {
        results.push({ key, note });
      }
    }

    return results;
  }

function updateMarkers(weatherData = null) {

  const spans = document.querySelectorAll("td .day-number");
  if (!spans.length) return;

  spans.forEach(span => {

    const td = span.closest("td");
    if (!td) return;

    const day = span.dataset.day;
    const month = span.dataset.month;

    const key = getKey(day, month);
    const note = getNote(key);

    td.classList.remove("has-note", "risk-low", "risk-medium", "risk-high");

    const ai = calculateDayAI(note, weatherData?.today);

    // 🎨 RISK COLORS
    if (ai.risk === "LOW") td.classList.add("risk-low");
    if (ai.risk === "MEDIUM") td.classList.add("risk-medium");
    if (ai.risk === "HIGH") td.classList.add("risk-high");
    if (ai.risk === "CRITICAL") td.classList.add("risk-high");

    // 🏷 marker reset
    const old = td.querySelector(".note-marker");
    if (old) old.remove();

    if (note.trim()) {

      const marker = document.createElement("span");
      marker.className = "note-marker";
      marker.textContent =
        `🐝 ${ai.score}% ${ai.risk}`;

      span.after(marker);
    }

    // ⚠ AI ALERT TEXT
    const alert = td.querySelector(".day-alert");
    if (alert) alert.remove();

    const alertDiv = document.createElement("div");
    alertDiv.className = "day-alert";
    alertDiv.textContent = ai.label;

    td.appendChild(alertDiv);

  });
}

  // =========================
  // TODAY
  // =========================
  function scrollToToday() {

    const d = pad(new Date().getDate());
    const m = pad(new Date().getMonth() + 1);

    const el = document.querySelector(
      `.day-number[data-day="${d}"][data-month="${m}"]`
    );

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

// =========================
// 🤖 AI PASIEKA PLANNER (AUTOPILOT WEEK)
// =========================

function mockWeek(weatherData) {

  const base = weatherData?.forecast || [];

  return base.slice(0, 7).map((d) => ({
    date: d.name,
    temp: d.tempMax,
    wind: d.wind,
    rain: d.rain
  }));
}

// =========================
// 🧠 AI WEEK PLANNER (LEVEL 3)
// =========================

function generateWeekPlan(weatherData) {

  const week = mockWeek(weatherData);
  const plan = [];

  for (const d of week) {

    let task = "📒 brak prac";

    if (d.temp >= 18 && d.wind < 15 && d.rain < 20) {
      task = "🐝 przegląd rodzin / miodobranie";
    }

    if (d.temp < 12) {
      task = "❄️ brak prac – kontrola tylko z zewnątrz";
    }

    if (d.wind > 25) {
      task = "💨 nie otwierać ula";
    }

    if (d.rain > 50) {
      task = "🌧️ dzień pasywny";
    }

    plan.push({
      ...d,
      task
    });
  }

  return plan;
}

// =========================
// 🤖 AI AUTOPILOT ULA
// =========================

export function autopilotCalendar(weatherData) {

  const week = weatherData?.forecast || [];
  const YEAR = 2026;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getKeyFromIndex(i) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${YEAR}`;
  }

  for (let i = 0; i < week.length; i++) {

    const d = week[i];
    const key = getKeyFromIndex(i);

    let note = "";

    // 🌧 PASYWNY DZIEŃ
    if (d.rain > 50) {
      note = "🌧 AI: dzień pasywny – brak prac w pasiece";
    }

    // 💨 WIATR
    else if (d.wind > 25) {
      note = "💨 AI: nie otwierać ula – silny wiatr";
    }

    // ❄️ ZIMNO
    else if (d.tempMax < 12) {
      note = "❄️ AI: kontrola tylko z zewnątrz";
    }

    // 🐝 IDEALNE WARUNKI
    else if (d.tempMax >= 18 && d.wind < 15 && d.rain < 20) {
      note = "🐝 AI: przegląd rodzin / możliwe miodobranie";
    }

    // 📒 fallback
    else {
      note = "📒 AI: standardowe prace pasieczne";
    }

    localStorage.setItem(`AI_${key}`, note);
  }
}

// =========================
// 🤖 AI LIVE UI WRITER (LEVEL 5)
// =========================

export function writeAIToCalendarUI(weatherData) {

  const week = weatherData?.forecast || [];

  const spans = document.querySelectorAll("td .day-number");

  if (!spans.length) return;

  const YEAR = 2026;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getKeyFromOffset(i) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${YEAR}`;
  }

  for (let i = 0; i < week.length; i++) {

    const d = week[i];
    const key = getKeyFromOffset(i);

    let aiNote = "";

    // 🧠 LOGIKA AI
    if (d.wind > 25) {
      aiNote = "💨 AI: nie otwierać ula";
    }
    else if (d.rain > 50) {
      aiNote = "🌧 AI: dzień pasywny";
    }
    else if (d.tempMax >= 18 && d.wind < 15) {
      aiNote = "🐝 AI: miodobranie / przegląd";
    }
    else if (d.tempMax < 12) {
      aiNote = "❄️ AI: kontrola zewnętrzna";
    }
    else {
      aiNote = "📒 AI: standardowe prace";
    }

    // 💾 zapis (backup)
    localStorage.setItem(`AI_${key}`, aiNote);

    // 🧠 UPDATE UI
    const span = document.querySelector(
      `.day-number[data-day="${key.slice(0,2)}"][data-month="${key.slice(3,5)}"]`
    );

    if (!span) continue;

    const td = span.closest("td");
    if (!td) continue;

    // usuń poprzedni AI marker
    let old = td.querySelector(".ai-note");
    if (old) old.remove();

    const marker = document.createElement("div");
    marker.className = "ai-note";
    marker.style.fontSize = "10px";
    marker.style.marginTop = "2px";
    marker.style.color = "#d97706";
    marker.textContent = aiNote;

    td.appendChild(marker);
  }
}

// =========================
// 🧠 AI EXPORT (HOOK DO ORCHESTRATORA)
// =========================

export function getWeekAI(weatherData) {
  return generateWeekPlan(weatherData);
}


  // =========================
  // INIT
  // =========================
  function init({ currentApiary = null, onOpenNote } = {}) {

    currentApiary = currentApiary;

    updateMarkers(null);
    bindClicks(onOpenNote);
    scrollToToday();
  }

// =========================
// 🧠 AI CALENDAR OVERLAY v2
// =========================

function calculateDayAI(note = "", weather = null) {

  const text = (note || "").toLowerCase();

  let score = 10;
  let label = "OK";
  let risk = "LOW";

  // 🐝 swarm logic
  if (text.includes("rój") || text.includes("rojka")) {
    score += 50;
    label = "RYZYKO ROJENIA";
    risk = "HIGH";
  }

  if (text.includes("miód") || text.includes("miodobranie")) {
    score += 30;
    label = "PRACA MIODOWA";
  }

  if (text.includes("leczenie") || text.includes("warroza")) {
    label = "LECZENIE";
    score += 20;
  }

  // 🌤 weather impact
  if (weather) {
    if (weather.wind > 30) score += 20;
    if (weather.temp < 12) score += 20;
    if (weather.rain > 40) score += 25;

    if (weather.temp >= 18 && weather.wind < 15 && weather.rain < 20) {
      score -= 10;
      label = "IDEALNE WARUNKI";
    }
  }

  if (score > 80) risk = "CRITICAL";
  else if (score > 60) risk = "HIGH";
  else if (score > 40) risk = "MEDIUM";

  return {
    score: Math.max(0, Math.min(100, score)),
    label,
    risk
  };
}


  // =========================
  // API
  // =========================
  return {
    init,
    updateMarkers,
    saveFromTextarea,
    searchNotes,
    scrollToToday,
    getKey,
    getNote,
    saveNote,
    analyzeNoteAI
  };

})();