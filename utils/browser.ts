import uaParser from "ua-parser-js";

let parser: uaParser.UAParserInstance;

function getParser() {
  if (!parser) {
    parser = new uaParser();
  }

  return parser;
}

export function isMacOS() {
  return getParser().getOS().name === "Mac OS";
}

export function isWindows() {
  return getParser().getOS().name === "Windows";
}

export function isLinux() {
  return getParser().getOS().name === "Linux";
}

export function isiOS() {
  return getParser().getOS().name === "iOS";
}

export function isAndroid() {
  return getParser().getOS().name === "Android";
}

export function isArcBrowser() {
  // https://webmasters.stackexchange.com/a/142231/138612
  return typeof window !== "undefined" &&
    window.getComputedStyle(document.documentElement).getPropertyValue("--arc-palette-title")
    ? true
    : false;
}
