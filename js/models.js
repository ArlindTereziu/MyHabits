export const SCHEMA_VERSION = 1;

export const HabitType = {
  BOOLEAN: "boolean",
  NUMBER: "number",
};

export const ScheduleType = {
  DAILY: "daily",
  WEEKDAYS: "weekdays",
};

export function createDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    habits: [],
    logs: {},
  };
}

export function createHabit({
  name,
  groupLabel,
  type,
  unit = "",
  schedule = ScheduleType.DAILY,
}) {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    groupLabel: groupLabel.trim() || "General",
    type,
    unit: unit.trim(),
    schedule,
    createdAt: new Date().toISOString(),
  };
}

export function validateHabit({ name, type, schedule }) {
  if (!name || !name.trim()) {
    return "Habit name is required.";
  }
  if (![HabitType.BOOLEAN, HabitType.NUMBER].includes(type)) {
    return "Habit type is invalid.";
  }
  if (![ScheduleType.DAILY, ScheduleType.WEEKDAYS].includes(schedule)) {
    return "Schedule is invalid.";
  }
  return "";
}

export function isValidNumber(value) {
  if (value === "") return true;
  const num = Number(value);
  return Number.isFinite(num);
}
