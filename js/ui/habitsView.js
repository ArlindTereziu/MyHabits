import { HabitType, ScheduleType, createHabit, validateHabit } from "../models.js";

export function createHabitsView({ getState, setState }) {
  let editingId = null;

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get("name");
    const groupLabel = formData.get("groupLabel");
    const type = formData.get("type");
    const unit = formData.get("unit");
    const schedule = formData.get("schedule");

    const error = validateHabit({ name, type, schedule });
    if (error) {
      renderMessage(error, "error");
      return;
    }

    const { habits } = getState();
    const duplicate = habits.find(
      (habit) =>
        habit.name.toLowerCase() === name.trim().toLowerCase() && habit.id !== editingId
    );

    if (duplicate) {
      renderMessage("Habit name must be unique.", "error");
      return;
    }

    setState((prev) => {
      if (editingId) {
        return {
          ...prev,
          habits: prev.habits.map((habit) =>
            habit.id === editingId
              ? {
                  ...habit,
                  name: name.trim(),
                  groupLabel: groupLabel.trim() || "General",
                  type,
                  unit: unit.trim(),
                  schedule,
                }
              : habit
          ),
        };
      }
      return {
        ...prev,
        habits: [...prev.habits, createHabit({ name, groupLabel, type, unit, schedule })],
      };
    });

    editingId = null;
    form.reset();
    form.querySelector("button[type='submit']").textContent = "Add Habit";
    renderMessage("Habit saved.", "notice");
  }

  function renderMessage(message, type) {
    const container = document.querySelector("#habits-message");
    if (!container) return;
    container.className = type;
    container.textContent = message;
  }

  function render(container) {
    const { habits } = getState();
    container.innerHTML = `
      <h2 class="section-title">Habits</h2>
      <div id="habits-message"></div>
      <form id="habit-form" class="card">
        <div class="form-grid">
          <label>
            Habit name
            <input class="input" name="name" required />
          </label>
          <label>
            Group label
            <input class="input" name="groupLabel" placeholder="General" />
          </label>
          <label>
            Type
            <select class="select" name="type">
              <option value="${HabitType.BOOLEAN}">Boolean</option>
              <option value="${HabitType.NUMBER}">Number</option>
            </select>
          </label>
          <label>
            Unit (optional)
            <input class="input" name="unit" placeholder="e.g. pages" />
          </label>
          <label>
            Schedule
            <select class="select" name="schedule">
              <option value="${ScheduleType.DAILY}">Daily</option>
              <option value="${ScheduleType.WEEKDAYS}">Weekdays</option>
            </select>
          </label>
        </div>
        <div class="inline-actions" style="margin-top: 0.75rem;">
          <button class="button" type="submit">Add Habit</button>
          <button class="button secondary" type="button" id="cancel-edit" style="display:none;">Cancel</button>
        </div>
      </form>

      <div class="card">
        <h3 class="group-title">Existing habits</h3>
        ${
          habits.length === 0
            ? `<div class="empty">No habits yet.</div>`
            : habits
                .map(
                  (habit) => `
                  <div class="habit-row">
                    <div class="habit-name">${habit.name}</div>
                    <span class="badge">${habit.groupLabel || "General"}</span>
                    <span class="badge">${habit.type}</span>
                    <span class="badge">${habit.schedule}</span>
                    <div class="inline-actions">
                      <button class="button secondary" data-action="edit" data-id="${habit.id}">Edit</button>
                      <button class="button danger" data-action="delete" data-id="${habit.id}">Delete</button>
                    </div>
                  </div>
                `
                )
                .join("")
        }
      </div>
    `;

    const form = container.querySelector("#habit-form");
    form.addEventListener("submit", handleSubmit);

    container.querySelectorAll("button[data-action='edit']").forEach((button) => {
      button.addEventListener("click", () => {
        const { habits } = getState();
        const habit = habits.find((item) => item.id === button.dataset.id);
        if (!habit) return;
        editingId = habit.id;
        form.name.value = habit.name;
        form.groupLabel.value = habit.groupLabel;
        form.type.value = habit.type;
        form.unit.value = habit.unit;
        form.schedule.value = habit.schedule;
        form.querySelector("button[type='submit']").textContent = "Update Habit";
        const cancelBtn = form.querySelector("#cancel-edit");
        cancelBtn.style.display = "inline-flex";
      });
    });

    container.querySelectorAll("button[data-action='delete']").forEach((button) => {
      button.addEventListener("click", () => {
        const habitId = button.dataset.id;
        if (!confirm("Delete this habit and its history?")) return;
        setState((prev) => {
          const updatedLogs = { ...prev.logs };
          Object.keys(updatedLogs).forEach((dateKey) => {
            if (updatedLogs[dateKey]?.[habitId] !== undefined) {
              const copy = { ...updatedLogs[dateKey] };
              delete copy[habitId];
              updatedLogs[dateKey] = copy;
            }
          });
          return {
            ...prev,
            habits: prev.habits.filter((habit) => habit.id !== habitId),
            logs: updatedLogs,
          };
        });
      });
    });

    const cancelBtn = container.querySelector("#cancel-edit");
    cancelBtn.addEventListener("click", () => {
      editingId = null;
      form.reset();
      form.querySelector("button[type='submit']").textContent = "Add Habit";
      cancelBtn.style.display = "none";
      renderMessage("", "");
    });
  }

  return { render };
}
