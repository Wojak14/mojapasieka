import { getPosition } from "./gps.js";

export function initAssistantPro() {
  runAssistant();
  setInterval(runAssistant, 60000); // aktualizacja co 60s
}

function runAssistant() {
  const box = document.getElementById("assistant");
  if (!box) return;

  const weather = window.__weatherCache || null;
  const pos = getPosition();

  const decision = analyzeGlobalState(weather, pos);

  box.innerHTML = `
    🧠 <b>ASYSTENT PSZCZELARZA PRO</b><br><br>
    📍 Lokalizacja: ${pos ? pos.lat.toFixed(3) + ", " + pos.lon.toFixed(3) : "brak"}<br>
    🌦 Pogoda: ${weather ? weather.temp + "°C / " + weather.wind + " km/h" : "brak"}<br><br>

    ⚠️ <b>DECYZJA:</b> ${decision.action}<br>
    📊 Ryzyko: ${decision.risk}%<br><br>

    🐝 <b>Rekomendacja:</b><br>
    ${decision.tip}
  `;
}

function analyzeGlobalState(weather, pos) {

  let risk = 10;
  let action = "OK";
  let tip = "Możesz pracować normalnie w pasiece.";

  // 🌦 pogoda
  if (weather) {
    if (weather.temp < 10) {
      risk += 30;
      action = "STOP";
      tip = "Za zimno — nie otwieraj uli.";
    }

    if (weather.temp > 30) {
      risk += 20;
      action = "OSTROŻNIE";
      tip = "Upał — tylko szybkie inspekcje.";
    }

    if (weather.wind > 25) {
      risk += 25;
      action = "STOP";
      tip = "Silny wiatr — brak pracy przy ulach.";
    }
  }

  // 📍 GPS (bonus logika)
  if (!pos) {
    risk += 10;
    tip += " Brak GPS — używasz trybu pasieki.";
  }

  if (risk > 70) action = "NIE PRACUJ";

  return { risk, action, tip };
}