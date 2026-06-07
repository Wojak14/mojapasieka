/**
 * ⚡ QUICK PANEL v3 CLEAN
 */

export function initQuickPanel() {

  const buttons = document.querySelectorAll("#quick-panel button");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      const text = btn.dataset.text || btn.textContent;

      addToNotes(text);
    });

  });
}

// =========================
// 📝 ADD TO NOTES
// =========================

function addToNotes(text) {

  const ta = document.getElementById("notes");
  if (!ta) return;

  ta.value += (ta.value ? "\n" : "") + "• " + text;
  ta.focus();
}