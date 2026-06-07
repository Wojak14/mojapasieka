/// core/apiary.js
// 🐝 APIARY MODULE v2
// FINAL BOSS ARCHITECTURE

// =========================
// 📍 STATIC APIARIES DB
// =========================

const APIARIES = [
  {
    id: "pasieka_1",
    name: "Pasieka Werpol",
    lat: 52.407231,
    lon: 23.152673
  },
  {
    id: "pasieka_2",
    name: "Pasieka Borysowszczyzna",
    lat: 52.419870,
    lon: 23.091900
  }
];

let currentApiary = null;

// =========================
// 📏 DISTANCE (HAVERSINE)
// =========================

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// =========================
// 📍 DETECT NEAREST APIARY
// =========================

export function detectNearestApiary(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") return null;

  let nearest = null;
  let minDist = Infinity;

  for (const apiary of APIARIES) {
    const dist = getDistance(lat, lon, apiary.lat, apiary.lon);

    if (dist < minDist) {
      minDist = dist;
      nearest = apiary;
    }
  }

  currentApiary = (minDist <= 10) ? nearest : null;

  return {
    apiary: currentApiary,
    distance: minDist
  };
}

// =========================
// 📍 GET CURRENT APIARY
// =========================

export function getCurrentApiary() {
  return currentApiary;
}

// =========================
// 🗂️ NOTE KEY SYSTEM
// =========================

export function getApiaryKey(dateKey) {
  if (!currentApiary) return dateKey;
  return `${currentApiary.id}_${dateKey}`;
}

// =========================
// 💾 NOTES API
// =========================

export function saveNote(dateKey, text) {
  const key = getApiaryKey(dateKey);
  localStorage.setItem(key, text);
}

export function loadNote(dateKey) {
  const key = getApiaryKey(dateKey);
  return localStorage.getItem(key) || "";
}

// =========================
// 📍 GPS HELPERS
// =========================

export function saveGPS(lat, lon) {
  localStorage.setItem("lastLat", lat);
  localStorage.setItem("lastLon", lon);
}

export function loadGPS() {
  return {
    lat: Number(localStorage.getItem("lastLat")),
    lon: Number(localStorage.getItem("lastLon"))
  };
}

// =========================
// 📡 GPS ONE SHOT
// =========================

export function getGPSOnce(callback) {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      saveGPS(lat, lon);

      const result = detectNearestApiary(lat, lon);

      if (callback) callback(result);
    },
    err => console.log("GPS ERROR:", err),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

// =========================
// 📡 GPS LIVE WATCH
// =========================

let watchId = null;

export function startGPSWatch(callback) {
  if (!navigator.geolocation) return;

  watchId = navigator.geolocation.watchPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      saveGPS(lat, lon);

      const result = detectNearestApiary(lat, lon);

      if (callback) callback(result);
    },
    err => console.log("GPS WATCH ERROR:", err),
    {
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 15000
    }
  );
}

export function stopGPSWatch() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}