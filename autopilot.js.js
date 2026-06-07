/**
 * 🐝 AUTOPILOT AI v1
 * CLEAN ARCH v3
 *
 * Odpowiada za:
 * - generowanie sugestii pracy pszczelarskiej
 * - automatyczne notatki AI
 * - reakcję na pogodę + ryzyko rojki
 */

export function runAutopilot(weather, swarmAI) {

  const forecast = weather?.forecast || [];

  if (!forecast.length) return [];

  return forecast.map((day, index) => {

    const swarm = swarmAI?.[index] || {};
    const risk = swarm.risk || 0;

    const temp = day.tempMax ?? 0;
    const wind = day.wind ?? 0;
    const rain = day.rain ?? 0;

    let action = "📒 brak akcji";
    let note = "";
    let priority = "LOW";

    // =========================
    // 🚨 BLOKADA PRACY
    // =========================

    if (wind > 30 || rain > 70) {
      action = "⛔ brak prac pasiecznych";
      note = "Złe warunki pogodowe – nie otwierać uli";
      priority = "BLOCK";
    }

    // =========================
    // 🐝 ROJKA (NAJWAŻNIEJSZE)
    // =========================

    else if (risk >= 70) {
      action = "🚨 kontrola nastroju rodziny";
      note = "Wysokie ryzyko rojki – sprawdź matkę i przestrzeń w ulu";
      priority = "HIGH";
    }

    // =========================
    // 🍯 MIÓD / POŻYTKI
    // =========================

    else if (temp >= 22 && wind < 15 && rain < 30) {
      action = "🍯 prace miodowe możliwe";
      note = "Dobre warunki do przeglądu i miodobrania";
      priority = "MEDIUM";
    }

    // =========================
    // 🔧 STANDARD PRACE
    // =========================

    else if (temp >= 16) {
      action = "🔍 przegląd uli";
      note = "Standardowy dzień pracy pasiecznej";
      priority = "MEDIUM";
    }

    // =========================
    // ❄️ SŁABE WARUNKI
    // =========================

    else {
      action = "❄️ minimalna aktywność";
      note = "Niska temperatura – ograniczyć ingerencję";
      priority = "LOW";
    }

    // =========================
    // 📦 OUTPUT
    // =========================

    return {
      date: day.name || "",
      action,
      note,
      priority,
      swarmRisk: risk
    };
  });
}