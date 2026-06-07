export function generateWeeklyPlan({ notes = {}, weatherWeek = [] }) {

  const days = [];

  for (let i = 0; i < weatherWeek.length; i++) {

    const w = weatherWeek[i];

    let score = 50;
    let tasks = [];
    let warning = null;

    // 🌤 pogoda
    if (w.temp >= 18 && w.wind < 15 && w.rain < 20) {
      score += 30;
    }

    if (w.wind > 30) {
      score -= 40;
      warning = "💨 silny wiatr";
    }

    if (w.temp < 12) {
      score -= 30;
      warning = "🥶 za zimno";
    }

    if (w.rain > 40) {
      score -= 30;
      warning = "🌧 deszcz";
    }

    // 🐝 logika pszczelarska
    const note = notes[w.date] || "";

    const t = note.toLowerCase();

    if (t.includes("miód")) tasks.push("🍯 miodobranie");
    if (t.includes("inspekcja")) tasks.push("🔍 przegląd");
    if (t.includes("leczenie")) tasks.push("💊 leczenie");
    if (t.includes("rój")) {
      tasks.push("🐝 kontrola rojowa");
      score += 20;
    }

    // 🧠 klasyfikacja dnia
    let level = "neutral";

    if (score >= 75) level = "best";
    else if (score >= 50) level = "good";
    else if (score >= 30) level = "risky";
    else level = "bad";

    days.push({
      date: w.date,
      score,
      level,
      tasks,
      warning
    });
  }

  return days;
}