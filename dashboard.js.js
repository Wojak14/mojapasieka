/**
 * 🐝 HIVE CONTROL CENTER v3
 * CLEAN ARCH DASHBOARD
 */

import { getWeatherData } from "./orchestrator.js";

let lastData = null;

// =========================
// 🚀 INIT DASHBOARD
// =========================

export function initDashboard() {
  renderEmpty();
}

// =========================
// 📊 UPDATE DASHBOARD
// =========================

export function updateDashboard({ swarm, rojak, queen }) {

  const box = document.getElementById("dashboard");
  if (!box) return;

  lastData = { swarm, rojak, queen };

  box.innerHTML = `
    <h2>🐝 HIVE CONTROL CENTER</h2>

    <div class="dash-grid">

      <div class="dash-card">
        <h3>🧠 Swarm AI</h3>
        ${renderSwarm(swarm)}
      </div>

      <div class="dash-card">
        <h3>🚨 Rojak Predictor</h3>
        ${renderRojak(rojak)}
      </div>

      <div class="dash-card">
        <h3>👑 Queen AI</h3>
        ${renderQueen(queen)}
      </div>

    </div>
  `;
}

// =========================
// 🧠 SWARM RENDER
// =========================

function renderSwarm(data = []) {
  return data.slice(0, 3).map(d => `
    <div>📅 ${d.date || ""}</div>
    <div>🔥 risk: ${d.risk ?? d.score ?? 0}</div>
    <hr/>
  `).join("");
}

// =========================
// 🚨 ROJAK RENDER
// =========================

function renderRojak(data = []) {
  return data.slice(0, 3).map(d => `
    <div>📅 ${d.date}</div>
    <div>${d.label}</div>
    <div>📊 ${d.score}%</div>
    <hr/>
  `).join("");
}

// =========================
// 👑 QUEEN RENDER
// =========================

function renderQueen(data = []) {
  return data.slice(0, 3).map(d => `
    <div>📅 ${d.date}</div>
    <div>${d.label}</div>
    <div>👑 ${d.stage}</div>
    <hr/>
  `).join("");
}

// =========================
// 🧹 EMPTY STATE
// =========================

function renderEmpty() {
  const box = document.getElementById("dashboard");
  if (!box) return;

  box.innerHTML = `
    <h2>🐝 HIVE CONTROL CENTER</h2>
    <p>Ładowanie AI pasieki...</p>
  `;
}