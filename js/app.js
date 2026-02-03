import { createStorageAdapter } from "./storage/storageAdapter.js";
import { createLocalStorageProvider } from "./storage/localStorageProvider.js";
import { createRouter } from "./ui/router.js";
import { createTodayView } from "./ui/todayView.js";
import { createHabitsView } from "./ui/habitsView.js";
import { createHistoryView } from "./ui/historyView.js";
import { createStatsView } from "./ui/statsView.js";
import { createSettingsView } from "./ui/settingsView.js";

const storage = createStorageAdapter(createLocalStorageProvider());
let state = storage.getState();

function setState(updater) {
  const nextState = typeof updater === "function" ? updater(state) : updater;
  state = nextState;
  storage.saveState(state);
  renderAll();
}

function getState() {
  return state;
}

const views = {
  today: createTodayView({ getState, setState }),
  habits: createHabitsView({ getState, setState }),
  history: createHistoryView({ getState }),
  stats: createStatsView({ getState }),
  settings: createSettingsView({ getState, setState, storage }),
};

function renderAll() {
  views.today.render(document.querySelector("#view-today"));
  views.habits.render(document.querySelector("#view-habits"));
  views.history.render(document.querySelector("#view-history"));
  views.stats.render(document.querySelector("#view-stats"));
  views.settings.render(document.querySelector("#view-settings"));
}

function init() {
  const router = createRouter({
    tabs: document.querySelectorAll(".tab"),
    views: document.querySelectorAll(".view"),
  });
  router.init();
  renderAll();
}

init();
