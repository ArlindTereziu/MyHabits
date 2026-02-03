import { lastNDates } from "../dateUtils.js";
import { HabitType } from "../models.js";

export function createHistoryView({ getState }) {
  let range = 30;

  function render(container) {
    const { habits, logs } = getState();
    const dates = lastNDates(range);

    container.innerHTML = `
      <h2 class="section-title">History</h2>
      <div class="inline-actions" style="margin-bottom: 1rem;">
        <label>
          Range
          <select class="select" id="history-range">
            <option value="30" ${range === 30 ? "selected" : ""}>Last 30 days</option>
            <option value="90" ${range === 90 ? "selected" : ""}>Last 90 days</option>
          </select>
        </label>
      </div>
      ${
        habits.length === 0
          ? `<div class="empty">Add habits to see history.</div>`
          : habits
              .map((habit) => {
                const rows = dates
                  .map((date) => {
                    const value = logs[date]?.[habit.id];
                    const display =
                      habit.type === HabitType.BOOLEAN
                        ? value === true
                          ? "✅"
                          : value === false
                          ? "—"
                          : ""
                        : value ?? "";
                    return `
                      <tr>
                        <td>${date}</td>
                        <td>${display}</td>
                      </tr>
                    `;
                  })
                  .join("");

                return `
                  <div class="card">
                    <h3 class="group-title">${habit.name}</h3>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rows}
                      </tbody>
                    </table>
                  </div>
                `;
              })
              .join("")
      }
    `;

    const rangeSelect = container.querySelector("#history-range");
    if (rangeSelect) {
      rangeSelect.addEventListener("change", (event) => {
        range = Number(event.target.value);
        render(container);
      });
    }
  }

  return { render };
}
