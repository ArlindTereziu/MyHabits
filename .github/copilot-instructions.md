# Copilot Instructions

You are helping build a beginner-friendly, static habit tracker web app.

General guidance:
- Follow existing code style, structure, and naming conventions.
- Keep changes minimal and focused on the requested task.
- Do not introduce new dependencies unless explicitly requested.
- Prefer clear, simple solutions over complex abstractions.
- Update or add documentation/comments only when it helps clarity.

Hard constraints:
- Use vanilla HTML/CSS/JavaScript only (no frameworks).
- No backend. No login. No external APIs.
- Use ES modules (multiple JS files) and keep code readable.
- Data storage must be local-first using localStorage, but behind a "storage adapter" interface so it can be swapped later (IndexedDB or cloud).
- Store dates as YYYY-MM-DD in local time.
- Support habits grouped by a user-defined "groupLabel" string.
- Support habit types: boolean (done/not done) and number (numeric value, optional unit).
- Include Import/Export JSON for backup.

UX requirements:
- Today screen: grouped list, quick toggle/input, clear feedback, keyboard-friendly.
- Habits screen: create/edit/delete, choose type, group label, schedule (daily or weekdays).
- History screen: simple grid/list for last 30/90 days per habit.
- Stats screen: streaks and completion % for boolean; last value and simple trend for number.
- Settings screen: export/import + reset.

Engineering practices:
- Prefer small pure functions.
- Validate inputs and handle edge cases (empty names, duplicate names, invalid numbers).
- Keep UI state and storage state consistent.
- Add a README with run instructions (Live Server) and a short feature list.
