const STORAGE_KEY = "habit-tracker-state";

export function createLocalStorageProvider() {
  return {
    read() {
      return localStorage.getItem(STORAGE_KEY);
    },
    write(value) {
      localStorage.setItem(STORAGE_KEY, value);
    },
  };
}
