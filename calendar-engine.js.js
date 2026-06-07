import { beeCalendarData } from "./calendar-data.js";

export function renderAllMonths(year, months, containerPrefix = "month") {

  months.forEach(month => {

    const container = document.getElementById(`${containerPrefix}-${String(month).padStart(2,"0")}`);
    if (!container) return;

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    let html = `
      <table>
        <tr>
          <th>PON</th><th>WT</th><th>ŚR</th><th>CZW</th>
          <th>PT</th><th>SOB</th><th>ND</th>
        </tr>
        <tr>
    `;

    let startDay = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startDay; i++) {
      html += "<td></td>";
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {

      const key = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const event = beeCalendarData[key];

      let cls = "green";
      if (event?.type === "miodobranie") cls = "yellow";
      if (event?.type === "alert") cls = "red";
      if (event?.type === "leczenie") cls = "red";
      if (event?.type === "zimowla") cls = "black";

      html += `
        <td class="${cls}">
          <span class="day-number"
            data-day="${String(d).padStart(2,"0")}"
            data-month="${String(month).padStart(2,"0")}">${d}</span>
          ${event?.text ? `<br>${event.text}` : ""}
        </td>
      `;

      if ((startDay + d) % 7 === 0) {
        html += "</tr><tr>";
      }
    }

    html += "</tr></table>";

    container.innerHTML = html;
  });
}