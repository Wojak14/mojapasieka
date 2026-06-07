/**
 * 🐝 SWARM AI ENGINE v1
 * CLEAN ARCH v3
 * Odpowiada tylko za:
 * - ryzyko rojki
 * - alerty pasieczne
 * - predykcję zachowań rodziny
 */

export function runSwarmAI(weather) {

  const forecast = weather?.forecast || [];

  if (!forecast.length) {
    return [];
  }

  return forecast.map((day) => {

    let risk = 10;
    const signals = [];

    const temp = day.tempMax ?? 0;
    const wind = day.wind ?? 0;
    const rain = day.rain ?? 0;

    // =========================
    // 🔥 WARUNKI ROJENIA
    // =========================

    if (temp >= 26) {
      risk += 30;
      signals.push("🔥 wysoka temperatura");
    }

    if (temp >= 22 && wind < 12) {
      risk += 25;
      signals.push("🌡️ stabilna pogoda + niski wiatr");
    }

    if (wind < 8) {
      risk += 15;
      signals.push("💨 bardzo niski wiatr");
    }

    if (rain < 20) {
      risk += 10;
      signals.push("🌤️ dobra pogoda do lotów");
    }

    if (rain > 60) {
      risk -= 20;
      signals.push("🌧️ deszcz blokuje loty");
    }

    if (temp < 12) {
      risk -= 30;
      signals.push("❄️ za zimno dla aktywności");
    }

    // =========================
    // 🧠 NORMALIZACJA
    // =========================

    risk = Math.max(0, Math.min(100, risk));

    // =========================
    // 🚨 DECYZJA AI
    // =========================

    let alert = "🟢 stabilnie";

    if (risk >= 70) {
      alert = "🚨 WYSOKIE RYZYKO ROJENIA";
    } else if (risk >= 45) {
      alert = "⚠️ podwyższone ryzyko";
    } else if (risk < 25) {
      alert = "🟢 spokojna rodzina";
    }

    // =========================
    // 📦 OUTPUT
    // =========================

    return {
      date: day.name || "",
      risk,
      alert,
      signals
    };
  });
}