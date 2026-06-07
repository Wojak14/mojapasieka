/**
 * 🐝 FINAL BOSS ARCHITECTURE v2
 * CORE ORCHESTRATOR (FIXED)
 */

import { getCurrentApiary, getGPSOnce } from "./apiary.js";
import { loadWeather, getBeeStatus, isBeeDanger } from "./weather.js";
import { CalendarModule } from "./calendar.js";

// AI WARSTWA
import { runSwarmAI } from "../ai/swarm.js";
import { runRojakPredictor } from "../ai/rojakPredictor.js";
import { runQueenBreedingAI } from "../ai/queenBreeding.js";

let weatherData = null;
let calendarInitialized = false;

// =========================
// 🚀 START SYSTEMU
// =========================

export async function initApp() {

  console.log("🐝 FINAL BOSS v2 START");

  try {

    getGPSOnce(async () => {
      await bootSystem();
    });

    setTimeout(async () => {
      if (!calendarInitialized) {
        await bootSystem();
      }
    }, 2500);

    startLoops();

  } catch (err) {
    console.error("❌ ORCHESTRATOR ERROR:", err);
  }
}

// =========================
// 🚀 BOOT SYSTEM
// =========================

async function bootSystem() {

  if (calendarInitialized) return;
  calendarInitialized = true;

  try {

    await refreshWeather();

    initCalendar();

    syncCalendarWithWeather();

  } catch (err) {
    console.error("❌ BOOT ERROR:", err);
  }
}

// =========================
// 🔄 SYNC CALENDAR
// =========================

function syncCalendarWithWeather() {
  if (!weatherData) return;

  CalendarModule?.updateMarkers?.(weatherData);
}

// =========================
// 📅 CALENDAR INIT
// =========================

function initCalendar() {

  const apiary = getCurrentApiary();

  CalendarModule.init({
    currentApiary: apiary,
    onOpenNote: (data) => {

      const textarea = document.getElementById("notes");
      if (!textarea) return;

      textarea.value = CalendarModule.getNote(data.key, apiary) || "";
    }
  });
}

// =========================
// 🌤️ WEATHER + AI PIPELINE
// =========================

async function refreshWeather() {

  try {

    const apiary = getCurrentApiary();

    weatherData = await loadWeather({
      lat: apiary?.lat || 52.24,
      lon: apiary?.lon || 23.10
    });

    if (!weatherData) return;

    // 🤖 AI LAYER
    const swarm = runSwarmAI(weatherData);
    const rojak = runRojakPredictor(weatherData, swarm);
    const queen = runQueenBreedingAI(weatherData, swarm);

    console.log("🐝 SWARM:", swarm);
    console.log("🚨 ROJAK:", rojak);
    console.log("👑 QUEEN:", queen);

    renderWeather();
    renderBeeStatus();

    // 🔄 update calendar AFTER AI
    syncCalendarWithWeather();

  } catch (e) {
    console.error("❌ WEATHER REFRESH:", e);
  }
}

// =========================
// 🌤️ WEATHER UI
// =========================

function renderWeather() {

  const box = document.getElementById("weather");
  if (!box || !weatherData?.today) return;

  const t = weatherData.today;

  box.innerHTML = `
    <h3>🌤 Pogoda</h3>
    🌡 ${t.temp}°C<br>
    💨 ${t.wind} km/h<br>
    🌧 ${t.rain}%<br>
    Min: ${t.min}°C<br>
    Max: ${t.max}°C
  `;
}

// =========================
// 🐝 STATUS PSZCZÓŁ
// =========================

function renderBeeStatus() {

  const box = document.getElementById("assistant");
  if (!box || !weatherData?.today) return;

  const status = getBeeStatus(weatherData.today);
  const danger = isBeeDanger(weatherData.today);

  let html = `
    <h3>🐝 Asystent</h3>
    ${status}
  `;

  if (danger) {
    html += `
      <div style="
        margin-top:10px;
        padding:10px;
        border-radius:8px;
        background:#ffdddd;
        font-weight:bold;
      ">
        🔴 DZIŚ NIE OTWIERAJ ULA
      </div>
    `;
  }

  box.innerHTML = html;
}

// =========================
// 🔄 LOOP
// =========================

function startLoops() {

  setInterval(() => {
    refreshWeather();
  }, 900000);
}

// =========================
// 📤 API
// =========================

export function getWeatherData() {
  return weatherData;
}