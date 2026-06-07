/**
 * 🐝 ROJAK PREDICTOR AI v1
 * CLEAN ARCH v3
 *
 * Odpowiada za:
 * - prognozę dni rojowych
 * - wykrywanie „okien rojowych”
 * - analiza 7 dni
 */

export function runRojakPredictor(weather, swarmAI) {

  const forecast = weather?.forecast || [];

  if (!forecast.length) return [];

  return forecast.map((day, index) => {

    const swarm = swarmAI?.[index] || {};
    const swarmRisk = swarm.risk || 0;

    const temp = day.tempMax ?? 0;
    const wind = day.wind ?? 0;
    const rain = day.rain ?? 0;

    let rojakScore = 10;
    let level = "LOW";
    let label = "🟢 spokojnie";

    // =========================
    // 🔥 WARUNKI ROJOWE
    // =========================

    // wysoka temperatura
    if (temp >= 25) {
      rojakScore += 35;
    }

    // idealny lot (mało wiatru)
    if (wind < 10) {
      rojakScore += 25;
    }

    // brak deszczu = aktywność
    if (rain < 20) {
      rojakScore += 15;
    }

    // bardzo stabilna pogoda = ryzyko rojki
    if (temp >= 22 && temp <= 30 && wind < 12 && rain < 25) {
      rojakScore += 20;
    }

    // synergia z swarm AI
    if (swarmRisk >= 60) {
      rojakScore += 25;
    }

    // =========================
    // 📊 NORMALIZACJA
    // =========================

    rojakScore = Math.max(0, Math.min(100, rojakScore));

    // =========================
    // 🚨 KLASYFIKACJA
    // =========================

    if (rojakScore >= 75) {
      level = "CRITICAL";
      label = "🚨 DZIEŃ ROJOWY!";
    } else if (rojakScore >= 50) {
      level = "HIGH";
      label = "⚠️ podwyższone ryzyko rojki";
    } else if (rojakScore >= 25) {
      level = "MEDIUM";
      label = "🟡 umiarkowane ryzyko";
    } else {
      level = "LOW";
      label = "🟢 spokojny dzień";
    }

    // =========================
    // 📦 OUTPUT
    // =========================

    return {
      date: day.name || "",
      score: rojakScore,
      level,
      label,
      details: {
        temp,
        wind,
        rain,
        swarmRisk
      }
    };
  });
}