import { lastNDates, isWeekday } from "../dateUtils.js";
import { HabitType, ScheduleType } from "../models.js";

export function createStatsView({ getState }) {
  function isDue(habit, dateYmd) {
    if (habit.schedule === ScheduleType.DAILY) return true;
    if (habit.schedule === ScheduleType.WEEKDAYS) return isWeekday(dateYmd);
    return true;
  }

  function getCompletionStats(habit, logs) {
    const dates = lastNDates(30);
    let dueDays = 0;
    let doneDays = 0;
    dates.forEach((date) => {
      if (!isDue(habit, date)) return;
      dueDays += 1;
      if (logs[date]?.[habit.id] === true) {
        doneDays += 1;
      }
    });
    const percent = dueDays === 0 ? 0 : Math.round((doneDays / dueDays) * 100);
    return { dueDays, doneDays, percent };
  }

  function getStreak(habit, logs) {
    const dates = lastNDates(90);
    let streak = 0;
    for (const date of dates) {
      if (!isDue(habit, date)) continue;
      if (logs[date]?.[habit.id] === true) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }

  function getNumericTrend(habit, logs) {
    const dates = lastNDates(90);
    const values = [];
    dates.forEach((date) => {
      const value = logs[date]?.[habit.id];
      if (typeof value === "number") {
        values.push({ date, value });
      }
    });

    if (values.length === 0) {
      return { lastValue: "—", trend: "No data" };
    }

    const last = values[0];
    const prev = values[1];
    let trend = "Flat";
    if (prev) {
      if (last.value > prev.value) trend = "Up";
      if (last.value < prev.value) trend = "Down";
    }
    return { lastValue: last.value, trend };
  }

  function render(container) {
    const { habits, logs } = getState();

    container.innerHTML = `
      <h2 class="section-title">Stats</h2>
      ${
        habits.length === 0
          ? `<div class="empty">Add habits to see stats.</div>`
          : `<div class="grid grid-2">
              ${habits
                .map((habit) => {
                  if (habit.type === HabitType.BOOLEAN) {
                    const stats = getCompletionStats(habit, logs);
                    const streak = getStreak(habit, logs);
                    return `
                      <div class="card">
                        <h3>${habit.name}</h3>
                        <p class="muted">${habit.groupLabel}</p>
                        <p><strong>Streak:</strong> ${streak} days</p>
                        <p><strong>Completion:</strong> ${stats.percent}% (${stats.doneDays}/${stats.dueDays})</p>
                      </div>
                    `;
                  }
                  const numeric = getNumericTrend(habit, logs);
                  return `
                    <div class="card">
                      <h3>${habit.name}</h3>
                      <p class="muted">${habit.groupLabel}</p>
                      <p><strong>Last value:</strong> ${numeric.lastValue} ${habit.unit || ""}</p>
                      <p><strong>Trend:</strong> ${numeric.trend}</p>
                    </div>
                  `;
                })
                .join("")}
            </div>`
      }
    `;
  }

  return { render };
}
