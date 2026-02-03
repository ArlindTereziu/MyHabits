export function createSettingsView({ getState, setState, storage }) {
  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function render(container) {
    container.innerHTML = `
      <h2 class="section-title">Settings</h2>
      <div class="card">
        <h3>Backup</h3>
        <p class="muted">Export or import your data as JSON.</p>
        <div class="inline-actions">
          <button class="button" id="export-btn">Export JSON</button>
          <label class="button secondary">
            Import JSON
            <input type="file" id="import-input" accept="application/json" hidden />
          </label>
        </div>
        <div id="settings-message" style="margin-top: 0.75rem;"></div>
      </div>

      <div class="card">
        <h3>Reset</h3>
        <p class="muted">Delete all habits and history. This cannot be undone.</p>
        <button class="button danger" id="reset-btn">Reset all data</button>
      </div>
    `;

    const message = container.querySelector("#settings-message");

    container.querySelector("#export-btn").addEventListener("click", () => {
      const content = storage.exportState();
      downloadFile("habit-tracker-backup.json", content);
      message.className = "notice";
      message.textContent = "Export ready.";
    });

    container.querySelector("#import-input").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const imported = storage.importState(parsed);
          setState(imported);
          message.className = "notice";
          message.textContent = "Import successful.";
        } catch {
          message.className = "error";
          message.textContent = "Import failed. Invalid JSON.";
        }
      };
      reader.readAsText(file);
    });

    container.querySelector("#reset-btn").addEventListener("click", () => {
      if (!confirm("Reset all data?")) return;
      setState({ schemaVersion: getState().schemaVersion, habits: [], logs: {} });
      message.className = "notice";
      message.textContent = "All data cleared.";
    });
  }

  return { render };
}
