/**/**
 * 🐝 FINAL BOSS v3 ENTRY POINT (STABLE CLEAN v1)
 */

import { initApp } from "./orchestrator.js";
import { initQuickPanel } from "./quickPanel.js";
import { initDashboard } from "./dashboard.js";
import { generateMonth } from "./calendar-generator.js";
import { beeCalendarData } from "./bee-data.js";

import { initGPS } from "./gps.js";
import { initAssistantPro } from "./assistant-pro.js";
import { loadWeather } from "./weather.js";
import { saveNote, loadNote } from "./firebase.js";

/* =========================
   🚀 BOOT APP
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  console.log("🚀 MAIN.JS START");

  initDashboard();
  initQuickPanel();
  initGPS();
  initAssistantPro();

  await initApp();

  /* 🌦 WEATHER CACHE */
  window.__weatherCache = await loadWeather();

  /* =========================
     📅 CALENDAR ENGINE
  ========================= */

  const calendar = document.getElementById("calendar");
  if (!calendar) return;

  calendar.innerHTML = "";

  let html = "";

  for (let m = 1; m <= 12; m++) {
    const id = `month-${String(m).padStart(2, "0")}`;
    html += `<div id="${id}"></div>`;
  }

  calendar.innerHTML = html;

  for (let m = 1; m <= 12; m++) {
    generateMonth(
      2026,
      m,
      `month-${String(m).padStart(2, "0")}`,
      beeCalendarData
    );
  }

  /* 📍 AUTO SCROLL */
  requestAnimationFrame(() => {
    const currentMonth = new Date().getMonth() + 1;
    const target = document.getElementById(
      `month-${String(currentMonth).padStart(2, "0")}`
    );

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

});

/* =========================
   🐝 CLICK DAY ENGINE
========================= */

let selectedDate = null;
let selectedDayElement = null;

const dayPanel = document.getElementById("day-panel");
const dayTitle = document.getElementById("day-title");
const dayEvent = document.getElementById("day-event");
const dayNotes = document.getElementById("day-notes");

async function openDay(dateKey, event) {

  selectedDate = dateKey;

  if (!dayPanel) return;

  dayPanel.classList.remove("hidden");

  dayTitle.innerHTML = `📅 ${dateKey}`;

  const weather = window.__weatherCache?.today || null;

  const ai = analyzeDay(event, dateKey, weather);

  /* EVENT */
  if (event) {
    let icon = "📌";

    if (event.type === "miodobranie") icon = "🍯";
    if (event.type === "leczenie") icon = "💊";
    if (event.type === "rojka") icon = "🐝";

    dayEvent.innerHTML = `
      ${icon} ${event.type.toUpperCase()}<br>
      ${event.text || ""}
    `;
  } else {
    dayEvent.innerHTML = "Brak zdarzeń";
  }

  /* WEATHER */
  if (weather) {
    dayEvent.innerHTML += `
      <br><br>🌡 ${weather.temp}°C
      <br>💨 ${weather.wind} km/h
    `;
  }

  /* AI */
  const aiPanel = document.getElementById("ai-panel");
  if (aiPanel) {
    aiPanel.innerHTML = `
      🧠 DECYZJA: <b>${ai.decision}</b><br>
      ⚠️ RYZYKO: ${ai.risk}%
    `;
  }

  /* NOTES */
  if (dayNotes) {
    try {
      dayNotes.value = (await loadNote(dateKey)) || "";
    } catch {
      dayNotes.value = "";
    }
  }
}

function closeDay() {
  dayPanel?.classList.add("hidden");
}

/* =========================
   🌍 GLOBAL HOOK
========================= */

window.__openDay = (dateKey, element) => {

  /* reset highlight */
  if (selectedDayElement) {
    selectedDayElement.classList.remove("today");
  }

  selectedDayElement = element;

  const event = window.beeCalendarData?.[dateKey] || null;

  openDay(dateKey, event);
};

/* =========================
   🧠 AI ENGINE
========================= */

function analyzeDay(event, dateKey, weather) {

  const month = new Date(dateKey).getMonth() + 1;

  let risk = 10;
  let decision = "OK";

  if (event?.type === "miodobranie") {
    risk += 30;
    decision = "🍯 MIODOBRANIE";
  }

  if (event?.type === "leczenie") {
    risk += 20;
    decision = "💊 NIE OTWIERAJ ULA";
  }

  if (event?.type === "rojka") {
    risk += 50;
    decision = "🐝 RYZYKO ROJENIA";
  }

  if (month >= 7 && month <= 8) {
    risk += 15;
  }

  if (weather) {
    if (weather.temp < 10) {
      risk += 30;
      decision = "🥶 ZA ZIMNO";
    }

    if (weather.temp > 30) {
      risk += 20;
      decision = "🥵 UPAŁ";
    }

    if (weather.wind > 25) {
      risk += 25;
      decision = "💨 WIATR";
    }
  }

  if (risk > 60) {
    decision = "⚠️ OSTROŻNOŚĆ";
  }

  return { risk, decision };
}

/* =========================
   💾 SAVE NOTE ENGINE
========================= */

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("save-day");
  if (!btn) return;

  btn.addEventListener("click", async () => {

    if (!selectedDate) return;

    const notes = document.getElementById("day-notes");
    if (!notes) return;

    try {
      await saveNote(selectedDate, notes.value);
    } catch (e) {
      console.warn("Firebase save error", e);
    }

    console.log("💾 zapisano dzień");

    closeDay();

    if (selectedDayElement) {
      selectedDayElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      selectedDayElement.classList.add("today");

      setTimeout(() => {
        selectedDayElement.classList.remove("today");
      }, 1500);
    }
  });

});