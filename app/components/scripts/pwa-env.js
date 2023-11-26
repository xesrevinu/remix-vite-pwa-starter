const isInWebAppiOS = window.navigator.standalone == true;
const isInWebAppChrome = window.matchMedia("(display-mode: standalone)").matches;
const isApp = isInWebAppiOS || isInWebAppChrome;

if (isApp) {
  document.body.classList.add("in-app");
}
