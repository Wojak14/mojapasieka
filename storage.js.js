export function saveNote(key, value, prefix="pasieka") {
  localStorage.setItem(`${prefix}_${key}`, value);
}

export function getNote(key, prefix="pasieka") {
  return localStorage.getItem(`${prefix}_${key}`);
}

export function getAllNotes() {
  const notes = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const val = localStorage.getItem(key);

    if (key.includes(".2026")) {
      notes.push({ key, val });
    }
  }

  return notes;
}

export function isNoteKey(key) {
  return /^\d{2}\.\d{2}\.2026$/.test(key);
}