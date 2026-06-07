// =========================
// 🌤️ WEATHER MODULE v2
// FINAL BOSS ARCHITECTURE
// =========================

export async function loadWeather({ lat = 52.24, lon = 23.10 } = {}) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&current_weather=true&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    const cw = data.current_weather || {};
    const daily = data.daily || {};

    const today = {
      temp: cw.temperature ?? 0,
      wind: cw.windspeed ?? 0,
      weathercode: cw.weathercode ?? 0,
      max: daily.temperature_2m_max?.[0] ?? 0,
      min: daily.temperature_2m_min?.[0] ?? 0,
      rain: daily.precipitation_probability_max?.[0] ?? 0,
      windMax: daily.wind_speed_10m_max?.[0] ?? 0
    };

    return {
      today,
      forecast: buildForecast(daily),
      raw: data
    };

  } catch (e) {
    console.log("WEATHER ERROR:", e);
    return null;
  }
}

// =========================
// 📊 FORECAST BUILDER
// =========================

function buildForecast(daily) {
  const days = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];
  let result = [];

  for (let i = 1; i <= 6; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    result.push({
      name: `${days[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`,
      tempMax: daily.temperature_2m_max?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i] ?? 0,
      rain: daily.precipitation_probability_max?.[i] ?? 0,
      wind: daily.wind_speed_10m_max?.[i] ?? 0
    });
  }

  return result;
}

// =========================
// 🐝 BEE LOGIC ENGINE
// =========================

export function getBeeStatus(today) {
  if (!today) return "❓ BRAK DANYCH";

  if (today.temp >= 15 && today.wind < 20) return "🐝 IDEALNE";
  if (today.temp >= 12) return "🐝 ŚREDNIE";
  return "❄️ SŁABE";
}

// =========================
// ⚠️ SAFE ULA LOGIC
// =========================

export function isBeeDanger(today) {
  if (!today) return false;

  return (
    today.wind > 35 ||
    today.temp < 12 ||
    today.rain > 30 ||
    today.weathercode >= 95
  );
}

// =========================
// 🐝 AI FORECAST ADVISOR
// =========================

export function getBeeWorkAdvice(tempMin, tempMax, wind, rain) {

  if (tempMax < 12) return "❄️ Za zimno – nie otwieraj uli";
  if (rain >= 40) return "🌧 Duże ryzyko deszczu – odpuść prace";
  if (wind >= 18) return "💨 Silny wiatr – tylko szybkie działania";

  if (tempMax >= 18 && rain < 20 && wind < 15)
    return "🐝 Idealny dzień na przegląd";

  if (rain >= 20)
    return "🌦 Możliwy deszcz – ostrożnie";

  return "⚠️ Warunki średnie";
}

// =========================
// 🐝 FORECAST RENDER DATA
// =========================

export function buildBeeForecast(forecast) {
  if (!forecast) return [];

  return forecast.map(d => ({
    ...d,
    advice: getBeeWorkAdvice(d.tempMin, d.tempMax, d.wind, d.rain)
  }));
}

// =========================
// 🌍 LOCATION HELP (OPTIONAL)
// =========================

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    return data.address || {};
  } catch (e) {
    console.log("GEOCODE ERROR:", e);
    return {};
  }
}
