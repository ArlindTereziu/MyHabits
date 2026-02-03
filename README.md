# Habit Tracker (Local-First)

A local-first habit tracking web app built with vanilla HTML, CSS, and JavaScript.

## Features (V1)

- Boolean and numeric habits
- Custom group labels
- Daily tracking with streaks
- History + stats screens
- Local storage with import/export backup

## Development

- Static site (no backend)
- Run locally with VS Code Live Server
- Hosted on GitHub Pages (later)

## Run locally

1. Open this folder in VS Code.
2. Install the Live Server extension if you don't have it.
3. Right-click index.html and choose **Open with Live Server**.

## Data storage

- Data is stored in your browser's localStorage.
- Use **Settings → Export JSON** to back up.
- Use **Settings → Import JSON** to restore.

## Manual test checklist

- Add a boolean habit and toggle it in Today.
- Add a numeric habit and enter a value.
- Switch tabs and ensure data persists after refresh.
- Export JSON and re-import it.
- Delete a habit and confirm its history is removed.
