import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* =========================
   🔥 FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "WSTAW_API_KEY",
  authDomain: "final-boss-pasieka.firebaseapp.com",
  projectId: "final-boss-pasieka",
  storageBucket: "final-boss-pasieka.appspot.com",
  messagingSenderId: "WSTAW_ID",
  appId: "WSTAW_APP_ID"
};

/* =========================
   🚀 INIT
========================= */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   📝 SAVE NOTE (SYNC)
========================= */

export async function saveNote(dateKey, text) {
  try {
    await setDoc(doc(db, "notes", dateKey), {
      text,
      updated: Date.now()
    });

    console.log("💾 Firebase zapisano:", dateKey);
  } catch (e) {
    console.error("❌ SAVE ERROR:", e);
  }
}

/* =========================
   📥 LOAD NOTE (SYNC)
========================= */

export async function loadNote(dateKey) {
  try {
    const snap = await getDoc(doc(db, "notes", dateKey));

    if (snap.exists()) {
      return snap.data().text;
    }

    return "";
  } catch (e) {
    console.error("❌ LOAD ERROR:", e);
    return "";
  }
}

/* =========================
   🌍 GLOBAL ACCESS (OPTIONAL)
========================= */

window.firebaseNotes = {
  saveNote,
  loadNote
};