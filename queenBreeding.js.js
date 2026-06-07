/**
 * 👑 QUEEN BREEDING AI v1
 * CLEAN ARCH v3
 *
 * Analizuje:
 * - obecność matki
 * - fazy rodziny
 * - ryzyko wymiany matki
 * - okna wychowu
 */

export function runQueenBreedingAI(weather, swarmAI, notes = []) {

  const forecast = weather?.forecast || [];

  if (!forecast.length) return [];

  return forecast.map((day, index) => {

    const swarm = swarmAI?.[index] || {};

    const temp = day.tempMax ?? 0;
    const wind = day.wind ?? 0;
    const rain = day.rain ?? 0;

    const noteText = (notes[index] || "").toLowerCase();

    let score = 10;
    let stage = "STABLE";
    let label = "👑 stabilna rodzina";
    let risk = "LOW";

    // =========================
    // 👑 MATKA / WYMIANA
    // =========================

    if (noteText.includes("brak matki") || noteText.includes("bez matki")) {
      score += 60;
      stage = "CRITICAL";
      label = "🚨 brak matki!";
      risk = "CRITICAL";
    }

    if (noteText.includes("wymiana matki")) {
      score += 40;
      stage = "REPLACEMENT";
      label = "⚠️ wymiana matki w toku";
      risk = "HIGH";
    }

    // =========================
    // 🌡️ WARUNKI BIOLOGICZNE
    // =========================

    if (temp >= 20 && temp <= 30) {
      score += 20; // idealne warunki rozwoju czerwia
    }

    if (wind < 15) {
      score += 10;
    }

    if (rain < 30) {
      score += 10;
    }

    // =========================
    // 🐝 SYNERGIA Z ROJKA
    // =========================

    if (swarm?.risk >= 60) {
      score += 20;
      stage = "SWARM_PRESSURE";
      label = "⚠️ presja rojowa wpływa na matkę";
    }

    // =========================
    // 🧬 FAZY ROZWOJU
    // =========================

    if (score >= 75) {
      stage = "EXPLOSIVE_BROOD";
      label = "🔥 intensywny rozwój rodziny";
      risk = "HIGH";
    } else if (score >= 45) {
      stage = "GROWTH";
      label = "🐣 rozwój czerwia";
      risk = "MEDIUM";
    } else if (score < 25) {
      stage = "WEAK";
      label = "⚠️ osłabiona rodzina";
      risk = "LOW";
    }

    // =========================
    // 📦 OUTPUT
    // =========================

    return {
      date: day.name || "",
      score,
      stage,
      label,
      risk,
      details: {
        temp,
        wind,
        rain,
        swarmRisk: swarm?.risk || 0
      }
    };
  });
}