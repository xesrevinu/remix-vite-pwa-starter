import { type Strategy } from "workbox-strategies";
import type { RemixBuild, RouteData } from "./remix-helpers";

import { createRoutes } from "./react-router";
import { htmlReplace, isPathMatching, matchServerRoutes } from "./remix-helpers";

export interface HandleOptions {
  cacheStrategy: Strategy;
  remixBuild: RemixBuild;
  dynamicPaths: Array<RegExp>;
  fallbackLoaderData?: () => RouteData;
  serverLoaderData?: () => RouteData;
}

export async function makeHandle(options: HandleOptions) {
  const cacheStrategy = options.cacheStrategy;
  const remixBuild = options.remixBuild;

  const fallbackLoaderData = options.fallbackLoaderData?.() || {};
  const serverLoaderData = options.serverLoaderData?.() || {};

  const routes = createRoutes(remixBuild.assets.routes);

  const key1 = Object.keys(fallbackLoaderData);
  const key2 = Object.keys(serverLoaderData);
  const uniqueKeys = [...new Set([...key1, ...key2])];

  const mergedData = uniqueKeys.reduce(
    (acc, key) => {
      acc[key] = {
        ...fallbackLoaderData[key],
        ...serverLoaderData[key],
      };

      return acc;
    },
    {} as Record<string, RouteData>,
  );

  await precacheLoaderData();

  function handleStrategyError(routeId: string, error: unknown): Promise<RouteData> {
    if (error instanceof Error) {
      const messages = ["could not generate a response", "no-response"];

      if (error.message && messages.some((message) => error.message.indexOf(message) > -1)) {
        const fallback = mergedData[routeId];

        if (fallback) {
          return Promise.resolve(fallback);
        }
      }
    }

    return Promise.reject(error);
  }

  async function getLoaderData(event: ExtendableEvent, url: URL): Promise<RouteData> {
    const matches = matchServerRoutes(routes, url.pathname);

    const routeIds = matches.map((_) => {
      const routeId = _.route.id;
      const path_ = _.route.path || "/";
      const path = path_ === "root" ? "/" : path_;

      const routeDataUrl = `${path}?_data=${encodeURIComponent(routeId)}`;

      let getLoaderData: () => Promise<RouteData> = () => Promise.resolve({});

      if (_.route.hasLoader) {
        getLoaderData = () => {
          const request = new Request(routeDataUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          });
          const serverRequest = fetch(request).then((res) =>
            self.caches
              .open(cacheStrategy.cacheName)
              .then((cache) => cache.put(request, res.clone()))
              .then(() => res.json()),
          );

          const cacheRequest = self.caches
            .open(cacheStrategy.cacheName)
            .then((cache) => cache.match(request))
            .then((res) => (res ? res.json() : Promise.reject(new Error("no-response"))))
            .catch((error) => handleStrategyError(routeId, error));

          return serverRequest.catch((_) => cacheRequest);
        };
      }

      return {
        routeId,
        routeData: getLoaderData,
      };
    });

    const routeDataList = await Promise.all(
      routeIds.map(({ routeData, routeId }) => {
        return routeData().then((loaderData) => [routeId, loaderData] as const);
      }),
    );

    const data = routeDataList.reduce(
      (acc, [routeId, loaderData]) => {
        acc[routeId] = loaderData;

        return acc;
      },
      {} as Record<string, RouteData>,
    );

    return data;
  }

  async function precacheLoaderData(): Promise<void> {
    const cache = await self.caches.open(cacheStrategy.cacheName);

    const requests = uniqueKeys.map((key) => {
      const routeId = remixBuild.assets.routes[key].id;
      const path_ = remixBuild.assets.routes[key].path || "/";
      const path = path_ === "root" ? "/" : path_;

      const routeDataUrl = `${path}?_data=${encodeURIComponent(routeId)}`;

      const request = new Request(routeDataUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      const fallbackLoaderData = mergedData[key];
      const response = new Response(JSON.stringify(fallbackLoaderData), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Remix-Response": "yes",
        },
      });

      return cache.put(request, response.clone());
    });

    await Promise.all(requests);
  }

  function isNavigateRequest(url: URL): boolean {
    return isPathMatching(options.dynamicPaths, url.pathname);
  }

  function isDataRequest(url: URL): boolean {
    return url.searchParams.has("_data");
  }

  async function handleNavigateRequest(event: ExtendableEvent, url: URL, response: Response): Promise<Response> {
    const html = await response.text();

    const replaceHtml = htmlReplace({
      url,
      routes,
      loaderData: await getLoaderData(event, url),
      remixBuild,
      html,
    });

    return new Response(replaceHtml, {
      headers: {
        "Content-Type": "text/html",
        // we need this for OPFS, if you don't need it, remove it
        // "Cross-Origin-Opener-Policy": "same-origin",
        // "Cross-Origin-Embedder-Policy": "require-corp",
      },
    });
  }

  function handleDataRequest(url: URL, handleOptions: { event: ExtendableEvent; request: Request }): Promise<Response> {
    const routeId = url.searchParams.get("_data");

    if (!routeId) {
      return Promise.reject(new Error("no-response"));
    }

    return cacheStrategy.handle(handleOptions).catch((error) =>
      handleStrategyError(routeId, error).then((_) => {
        return new Response(JSON.stringify(_), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Remix-Response": "yes",
          },
        });
      }),
    );
  }

  return {
    isNavigateRequest,
    isDataRequest,
    handleDataRequest,
    handleNavigateRequest,
  };
}
