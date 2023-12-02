/// <reference lib="webworker" />

import { dynamicPaths } from "@/config";
import { cleanupOutdatedCaches, precacheAndRoute, PrecacheEntry } from "workbox-precaching";
import { getOrCreatePrecacheController } from "workbox-precaching/utils/getOrCreatePrecacheController";
import { NavigationRoute, registerRoute, setDefaultHandler } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { makeHandle } from "@/pwa/handle";
import { type RouteData } from "@/pwa/remix-helpers";
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
const remixBuild = self.__REMIX_BUILD;
const manifestVersion = self.__MANIFEST_VERSION;
const manifestCustom = self.__MANIFEST_CUSTOM;

const manifest = MANIFEST.concat(manifestCustom || []);

init({
  dynamicPaths,
  manifest,
  manifestVersion,
  remixBuild,
  fallbackLoaderData: () => {
    return {
      root: {
        hasShell: false,
        hasSigned: false,
      },
    };
  },
  serverLoaderData: () => {
    // TODO: maybe we can use this to get the user data from the server
    return {};
  },
});

// --------------------------------------------------------------------

interface InitOptions {
  manifest: Array<PrecacheEntry | string>;
  manifestVersion: string;
  dynamicPaths: Array<RegExp>;
  remixBuild: any;
  fallbackLoaderData?: () => RouteData;
  serverLoaderData?: () => RouteData;
}

async function init({
  dynamicPaths,
  fallbackLoaderData,
  manifest,
  manifestVersion,
  remixBuild,
  serverLoaderData,
}: InitOptions) {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });

  precacheAndRoute(manifest);

  cleanupOutdatedCaches();

  // Define your own routing rules here.
  //
  // registerRoute(
  //   /^https:\/\/fonts\.googleapis\.com/,
  //   new StaleWhileRevalidate({
  //     cacheName: "google-fonts-stylesheets",
  //   })
  // );

  const precacheController = getOrCreatePrecacheController();

  // Shell
  // Root.ts -> /?shell=true
  const shellRequest = new Request("/?shell=true&__WB_REVISION__=" + manifestVersion);
  const getShellHtmlResponse = () =>
    self.caches.open(precacheController.strategy.cacheName).then((cache) => cache.match(shellRequest));

  const { handleDataRequest, handleNavigateRequest, isDataRequest, isNavigateRequest } = await makeHandle({
    cacheStrategy: new StaleWhileRevalidate(),
    remixBuild,
    dynamicPaths,
    fallbackLoaderData: () => fallbackLoaderData?.() || {},
    serverLoaderData: () => serverLoaderData?.() || {},
  });

  registerRoute(
    new NavigationRoute(({ event, request }) => {
      const url = new URL(request.url);

      if (isNavigateRequest(url)) {
        return getShellHtmlResponse()
          .then((cache) => cache || fetch(shellRequest))
          .then((response) => handleNavigateRequest(event, url, response));
      }

      return fetch(request);
    })
  );

  setDefaultHandler({
    handle: ({ event, request }) => {
      const url = new URL(request.url);

      if (isDataRequest(url)) {
        return handleDataRequest(url, { event, request });
      }

      return fetch(request);
    },
  });
}
