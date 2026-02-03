import { createDefaultState, SCHEMA_VERSION } from "../models.js";

export function createStorageAdapter(provider) {
  function migrateState(state) {
    if (!state || typeof state !== "object") {
      return createDefaultState();
    }

    if (!state.schemaVersion) {
      return {
        ...createDefaultState(),
        ...state,
        schemaVersion: SCHEMA_VERSION,
      };
    }

    if (state.schemaVersion === SCHEMA_VERSION) {
      return state;
    }

    // Safe migration stub for future versions.
    return {
      ...createDefaultState(),
      ...state,
      schemaVersion: SCHEMA_VERSION,
    };
  }

  function getState() {
    const raw = provider.read();
    if (!raw) {
      return createDefaultState();
    }
    try {
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    } catch {
      return createDefaultState();
    }
  }

  function saveState(state) {
    provider.write(JSON.stringify(state));
  }

  function exportState() {
    const state = getState();
    return JSON.stringify(state, null, 2);
  }

  function importState(state) {
    const migrated = migrateState(state);
    saveState(migrated);
    return migrated;
  }

  return {
    getState,
    saveState,
    exportState,
    importState,
  };
}
