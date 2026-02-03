import { todayYmd, isWeekday } from "../dateUtils.js";
import { HabitType, ScheduleType } from "../models.js";

export function createTodayView({ getState, setState }) {
  function isHabitDueToday(habit, dateYmd) {
    if (habit.schedule === ScheduleType.DAILY) return true;
    if (habit.schedule === ScheduleType.WEEKDAYS) return isWeekday(dateYmd);
    return true;
  }

  function updateLog(habitId, value) {
    const dateKey = todayYmd();
    setState((prev) => {
      const logsForDate = { ...(prev.logs[dateKey] || {}) };
      if (value === "" || value === null) {
        delete logsForDate[habitId];
      } else {
        logsForDate[habitId] = value;
      }
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateKey]: logsForDate,
        },
      };
    });
  }

  function render(container) {
    const { habits, logs } = getState();
    const dateKey = todayYmd();
    const logsForDate = logs[dateKey] || {};

    const dueHabits = habits.filter((habit) => isHabitDueToday(habit, dateKey));
    const grouped = dueHabits.reduce((acc, habit) => {
      const label = habit.groupLabel || "General";
      acc[label] = acc[label] || [];
      acc[label].push(habit);
      return acc;
    }, {});

    container.innerHTML = `
      <h2 class="section-title">Today</h2>
      <p class="muted">${dateKey}</p>
      ${
        dueHabits.length === 0
          ? `<div class="empty">No habits scheduled for today yet.</div>`
          : Object.entries(grouped)
              .map(
                ([groupLabel, groupHabits]) => `
                <div class="card">
                  <h3 class="group-title">${groupLabel}</h3>
                  ${groupHabits
                    .map((habit) => {
                      const value = logsForDate[habit.id] ?? "";
                      if (habit.type === HabitType.BOOLEAN) {
                        const checked = value === true;
                        return `
                          <div class="habit-row">
                            <div class="habit-name">${habit.name}</div>
                            <label>
                              <input
                                type="checkbox"
                                data-action="toggle"
                                data-id="${habit.id}"
                                ${checked ? "checked" : ""}
                              />
                              Done
                            </label>
                          </div>
                        `;
                      }
                      return `
                        <div class="habit-row">
                          <div class="habit-name">${habit.name}</div>
                          <label>
                            <span class="muted">Value ${habit.unit ? `(${habit.unit})` : ""}</span>
                            <input
                              class="input"
                              type="number"
                              step="0.1"
                              data-action="number"
                              data-id="${habit.id}"
                              value="${value ?? ""}"
                            />
                          </label>
                        </div>
                      `;
                    })
                    .join("")}
                </div>
              `
              )
              .join("")
      }
    `;

    container.querySelectorAll("input[data-action='toggle']").forEach((input) => {
      input.addEventListener("change", (event) => {
        const habitId = event.target.dataset.id;
        updateLog(habitId, event.target.checked);
      });
    });

    container.querySelectorAll("input[data-action='number']").forEach((input) => {
      input.addEventListener("input", (event) => {
        const habitId = event.target.dataset.id;
        const raw = event.target.value;
        updateLog(habitId, raw === "" ? "" : Number(raw));
      });
    });
  }

  return { render };
}
