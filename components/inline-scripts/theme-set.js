const localStorageTheme = localStorage.getItem("ui-theme") || "system";
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const prefersDarkMode = mediaQuery.matches;
const root = document.documentElement;
if (localStorageTheme === "system") {
  root.classList.add(prefersDarkMode ? "dark" : "light");
} else {
  root.classList.add(localStorageTheme);
}
