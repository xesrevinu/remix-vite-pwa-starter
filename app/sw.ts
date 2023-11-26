/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { getOrCreatePrecacheController } from "workbox-precaching/utils/getOrCreatePrecacheController";

import { NavigationRoute, registerRoute } from "workbox-routing";
import { matchPaths, replaceFromResponse } from "@/pwa/remix-helpers";
import { type PrecacheEntry } from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

declare global {
  interface ServiceWorkerGlobalScope {
    __MANIFEST_VERSION: string;
    __MANIFEST_CUSTOM: Array<PrecacheEntry | string>;
    __REMIX_BUILD: any; // TODO: improve type
  }
}

// Will be replaced by vite-plugin-vite
const MANIFEST = self.__WB_MANIFEST;

// Will be replaced by build script
const MANIFEST_VERSION = self.__MANIFEST_VERSION;
const CUSTOM_MANIFEST = self.__MANIFEST_CUSTOM;
const REMIX_BUILD = self.__REMIX_BUILD;

const ALL_MANIFEST = MANIFEST.concat(CUSTOM_MANIFEST || []);

// prettier-ignore
// Add the route paths that you need to work offline
// (For me, all of them are needed)
const paths: Array<RegExp> = [
  /^\/home/,
  /^\/about/,
  /^\/pricing/,

  /^\/terms/,
  /^\/privacy/,

  /^\/sign-in/,

  /^\/invoices/,
  /^\/settings/,
  /^\/$/,
];

init({
  dynamicPaths: paths,
  manifest: ALL_MANIFEST,
  manifestVersion: MANIFEST_VERSION,
  build: REMIX_BUILD,
});

// --------------------------------------------------------------------

interface InitOptions {
  manifest: Array<PrecacheEntry | string>;
  manifestVersion: string;
  dynamicPaths: Array<RegExp>;
  build: any;
}

function init({ build, dynamicPaths, manifest, manifestVersion }: InitOptions) {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });

  precacheAndRoute(manifest);

  // Clean old assets
  cleanupOutdatedCaches();

  const precacheController = getOrCreatePrecacheController();

  // Shell
  const shellRequest = new Request("/?shell=true&__WB_REVISION__=" + manifestVersion);
  const getShellCache = () =>
    self.caches
      .open(precacheController.strategy.cacheName)
      .then((cache) => cache.match(shellRequest, { ignoreVary: true }));

  // Handle navigation requests for HTML pages.
  // Rewrite the request to go to the app shell HTML page instead.
  registerRoute(
    new NavigationRoute({
      handle: async (options) => {
        const { request } = options;

        const pathname = new URL(request.url).pathname;

        if (matchPaths(dynamicPaths, pathname)) {
          const response = await getShellCache().then((cache) => cache || fetch(shellRequest));

          const replace = replaceFromResponse(build);

          return await replace(pathname, response);
        }

        return fetch(request);
      },
    })
  );
}
