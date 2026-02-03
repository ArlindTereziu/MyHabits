export function createRouter({ tabs, views }) {
  const tabButtons = Array.from(tabs);
  const viewSections = Array.from(views);

  function setActive(viewName) {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.view === viewName;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    viewSections.forEach((section) => {
      section.classList.toggle("active", section.dataset.view === viewName);
    });
  }

  function init() {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => setActive(button.dataset.view));
    });
    setActive("today");
  }

  return { init, setActive };
}
