import { initCalendar } from "./core/calendar.js";
import { initWeather } from "./modules/weather.js";
import { initGPS } from "./modules/gps.js";
import { initAssistant } from "./modules/assistant.js";
import { initUI } from "./core/ui.js";
import { ApiaryModule } from "./core/apiary.js";

document.addEventListener("DOMContentLoaded", async () => {

  console.log("🐝 FINAL BOSS START");

  try {

    /* =========================
       UI CORE
    ========================= */

    initUI();

    /* =========================
       GPS + WEATHER + ASSISTANT
    ========================= */

    initGPS();
    initWeather();
    initAssistant();

    /* =========================
       CALENDAR
    ========================= */

    await initCalendar();

    /* =========================
       APIARY MODULE (SAFE RUN)
    ========================= */

    if (ApiaryModule) {

      ApiaryModule.loadApiaryData?.();
      ApiaryModule.analyzeHives?.();
      ApiaryModule.generateRanking?.();
      ApiaryModule.generateAlerts?.();
      ApiaryModule.generateHoneyForecast?.();

    }

    console.log("🐝 FINAL BOSS v2 READY");

  } catch (error) {

    console.error("❌ FATAL ERROR IN APP:", error);

  }

});

