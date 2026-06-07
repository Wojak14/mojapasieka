let position = null;
let GPS_ENABLED = true;

const APIARY_LOCATIONS = {
  werpol: {
    name: "Werpol",
    lat: 52.407231,
    lon: 23.152673
  },
  borysowszczyzna: {
    name: "Borysowszczyzna",
    lat: 52.419870,
    lon: 23.091900
  }
};

let activeLocation = "werpol";

// =========================
// INIT
// =========================

export function initGPS() {
  startGPS();

  // auto refresh co 60s
  setInterval(() => {
    startGPS();
  }, 60000);
}

// =========================
// PUBLIC API
// =========================

export function getPosition() {
  return position;
}

export function toggleGPS(state) {
  GPS_ENABLED = state;
  startGPS();
}

export function setLocation(name) {
  if (APIARY_LOCATIONS[name]) {
    activeLocation = name;
    startGPS();
  }
}

export function getActiveLocation() {
  return APIARY_LOCATIONS[activeLocation];
}

// =========================
// CORE GPS LOGIC
// =========================

function startGPS() {

  // ❌ GPS OFF → fallback na pasiekę
  if (!GPS_ENABLED || !navigator.geolocation) {
    position = APIARY_LOCATIONS[activeLocation];
    updateUI(position, false);
    return;
  }

  // ✅ GPS ON
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      position = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      };

      updateUI(position, true);
    },
    (err) => {
      console.warn("GPS error:", err);

      // fallback jeśli GPS fail
      position = APIARY_LOCATIONS[activeLocation];
      updateUI(position, false);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000
    }
  );
}

// =========================
// UI
// =========================

function updateUI(pos, isGPS) {

  const box = document.getElementById("location-box");
  if (!box) return;

  const label = isGPS ? "📍 GPS" : "🏠 PASIEKA";

  box.innerHTML = `
    ${label}<br>
    ${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)}<br>
    <small>${isGPS ? "tryb live" : "offline fallback"}</small>
  `;
}