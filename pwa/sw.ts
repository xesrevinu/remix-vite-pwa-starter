/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { type PrecacheEntry } from "workbox-precaching";
import { getOrCreatePrecacheController } from "workbox-precaching/utils/getOrCreatePrecacheController";

import { matchPaths, replaceFromResponse } from "@/pwa/remix-helpers";
import { NavigationRoute, registerRoute, setDefaultHandler } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

interface InitOptions {
  manifest: Array<PrecacheEntry | string>;
  manifestVersion: string;
  dynamicPaths: Array<RegExp>;
  remixBuild: any;
  makeLoaderData: () => any;
}

export function init({ remixBuild, dynamicPaths, manifest, manifestVersion, makeLoaderData }: InitOptions) {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      // @ts-expect-error
      // TODO: fix type error
      self.skipWaiting();
    }
  });

  precacheAndRoute(manifest);

  cleanupOutdatedCaches();

  const precacheController = getOrCreatePrecacheController();

  // Shell
  // Root.ts -> /?shell=true
  const shellRequest = new Request("/?shell=true&__WB_REVISION__=" + manifestVersion);
  const getShellCache = () =>
    self.caches.open(precacheController.strategy.cacheName).then((cache) => cache.match(shellRequest));

  const loaderData = makeLoaderData();

  // Define your own routing rules here.
  //
  // registerRoute(
  //   /^https:\/\/fonts\.googleapis\.com/,
  //   new StaleWhileRevalidate({
  //     cacheName: "google-fonts-stylesheets",
  //   })
  // );

  // Handle navigation requests
  registerRoute(
    new NavigationRoute(async (options) => {
      const { request } = options;

      const url = new URL(request.url);

      if (matchPaths(dynamicPaths, url.pathname)) {
        /**
         * Rewrite the request to go to the app shell HTML page instead.
         */
        const response = await getShellCache().then((cache) => cache || fetch(shellRequest));

        const rewriteResponse = replaceFromResponse({
          loaderData,
          remixBuild,
        });

        return await rewriteResponse(url.pathname, response);
      }

      return fetch(request);
    })
  );

  // Handle data request
  // see https://github.com/remix-run/remix/blob/e5d24b4848d7df41e71a260abb868ee94ca6480b/packages/remix-server-runtime/server.ts#L114
  // example: /url?_data=
  const dataRequestCache = new StaleWhileRevalidate({});

  setDefaultHandler({
    handle: (options) => {
      const { request } = options;

      const url = new URL(request.url);

      if (url.searchParams.has("_data")) {
        const rootId = url.searchParams.get("_data")!;

        return dataRequestCache.handle(options).catch((error) => {
          // offline and workbox-runtime cache miss
          const messages = ["could not generate a response", "no-response"];
          if (error.message && messages.some((message) => error.message.indexOf(message) > -1)) {
            const fallback = loaderData[rootId];

            if (fallback) {
              return new Response(JSON.stringify(fallback), {
                headers: {
                  "Content-Type": "application/json",
                  "X-Remix-Response": "yes",
                },
              });
            }
          }

          return Promise.reject(error);
        });
      }

      return fetch(request);
    },
  });
}
