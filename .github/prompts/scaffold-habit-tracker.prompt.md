---
name: scaffold-habit-tracker
description: Scaffold the full V1 static habit tracker app (HTML/CSS/JS) with local storage + import/export.
---

You are in a VS Code workspace for a new project.

Goal: Create a working V1 of a local-only habit tracker web app as a static site.

Requirements:
1) Create files:
- index.html
- css/styles.css
- js/app.js (entry)
- js/storage/storageAdapter.js
- js/storage/localStorageProvider.js
- js/models.js (Habit + Log types)
- js/dateUtils.js (YYYY-MM-DD helpers)
- js/ui/router.js (simple tab navigation)
- js/ui/todayView.js
- js/ui/habitsView.js
- js/ui/historyView.js
- js/ui/statsView.js
- js/ui/settingsView.js
- README.md
- .gitignore

2) Implement features:
- Habits: CRUD, groupLabel, type boolean/number, optional unit, schedule (daily or weekdays).
- Today: display grouped; toggles for boolean; numeric inputs for number habits; save immediately.
- History: last 30 days display per habit.
- Stats: streak + completion% for boolean; last value + simple trend for numeric.
- Settings: Export JSON download; Import JSON upload; Reset all.

3) Storage:
- Use a storage adapter interface with methods like: getState(), saveState(state), exportState(), importState(state).
- Include schemaVersion and safe migrations stub.

4) UX:
- Simple, clean, responsive layout.
- Accessible labels for inputs and buttons.
- No external libraries.

Deliverables:
- Working app runnable by opening index.html or using Live Server.
- README explains how to run locally and how data is stored/exported.

Before finishing:
- Ensure there are no console errors.
- Ensure data persists after refresh.
- Add minimal manual test checklist to README.
