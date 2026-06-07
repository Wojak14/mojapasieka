let weatherCache = null;

// =========================
// 📡 DATA INJECTION
// =========================
export function setWeatherData(data) {
  weatherCache = data;
}

// =========================
// 🧠 INIT
// =========================
export function initAssistant() {
  renderAssistant();
}

// =========================
// 🔄 UPDATE UI
// =========================
export function renderAssistant() {
  const box = document.getElementById("assistant");
  if (!box) return;

  const risk = calculateSwarmRisk();

  let html = `
    <h3>🧠 Asystent pszczelarski</h3>
    🐝 Ryzyko rojki: ${risk}%
  `;

  if (risk > 60) {
    html += `
      <div style="margin-top:10px;padding:10px;background:#ffdddd;border-radius:8px">
        ⚠️ Wysokie ryzyko rójki – sprawdź ule!
      </div>
    `;
  }

  box.innerHTML = html;
}

// =========================
// 🐝 RISK ENGINE
// =========================
function calculateSwarmRisk() {
  if (!weatherCache?.today) return 25;

  const t = weatherCache.today.temp;
  const wind = weatherCache.today.wind;

  let risk = 20;

  if (t > 28) risk += 40;
  else if (t > 22) risk += 25;
  else if (t > 18) risk += 10;

  if (wind < 10) risk += 20;
  if (wind < 5) risk += 15;

  return Math.min(100, risk);
}

// =========================
// 📤 EXTERNAL UPDATE HOOK
// =========================
export function updateAssistant() {
  renderAssistant();
}