/**
 * 🐝 SMART CALENDAR PRO
 * calendar-generator.js (STABLE FINAL)
 */

import { getIcons } from "./icons.js";

export function generateMonth(year, month, containerId, beeCalendarData) {

  const container = document.getElementById(containerId);

  if (!container) {
    console.warn(`❌ Brak kontenera: ${containerId}`);
    return;
  }

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  let html = `
    <table>
      <tr>
        <th>PON</th><th>WT</th><th>ŚR</th><th>CZW</th>
        <th>PT</th><th>SOB</th><th>ND</th>
      </tr>
      <tr>
  `;

  let startDay = (firstDay.getDay() + 6) % 7;
  let dayCounter = 0;

  for (let i = 0; i < startDay; i++) {
    html += "<td></td>";
    dayCounter++;
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {

    const day = String(d).padStart(2, "0");
    const monthStr = String(month).padStart(2, "0");
    const dateKey = `${year}-${monthStr}-${day}`;

    const event = beeCalendarData?.[dateKey];
    const text = (event?.text || "").toLowerCase();

    // 🧠 AI ENGINE
    const ai = window.analyzeDay
      ? window.analyzeDay(event, dateKey, window.__weatherCache?.today)
      : { risk: 0, decision: "OK" };

    // 🎨 COLOR SYSTEM
    let cls = "green";

    if (ai.risk >= 80) cls = "red";
    else if (ai.risk >= 50) cls = "yellow";
    else if (event?.type === "rojka") cls = "red";
    else if (event?.type === "leczenie") cls = "yellow";

    // 🐝 ICON ENGINE (SMART MODULE)
    const icons = getIcons ? getIcons(text) : ["📒"];

    html += `
      <td class="${cls}" onclick="window.__openDay('${dateKey}', this)">

        <span class="day-number"
          data-day="${day}"
          data-month="${monthStr}">
          ${d}
        </span>

        <div class="icons">
          ${icons.map(i => `<span>${i}</span>`).join(" ")}
        </div>

        ${event?.text ? `<small>${event.text}</small>` : ""}

        <div class="ai-badge">
          ${ai.decision}
        </div>

      </td>
    `;

    dayCounter++;

    if (dayCounter % 7 === 0) {
      html += "</tr><tr>";
    }
  }

  html += `
      </tr>
    </table>
  `;

  container.innerHTML = html;
}