import type { Params } from "react-router-dom";
import { dedupe, getKeyedLinksForMatches, matchRoutes } from "./react-router";

export type RouteData = Record<string, any>;

export interface AssetsRoute {
  id: string;
  path: string;
  hasLoader: boolean;
}

export interface RouteMatch<Route> {
  params: Params;
  pathname: string;
  route: Route;
}

// See https://github.com/remix-run/remix/blob/ae65995a175cbe383d86687a3efe87625bf10a82/packages/remix-server-runtime/routeMatching.ts#L12
export function matchServerRoutes(
  routes: Array<AssetsRoute>,
  pathname: string,
  basename: string = "/"
): Array<RouteMatch<AssetsRoute>> {
  const matches = matchRoutes(routes, pathname, basename);

  if (!matches) return [];

  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route,
  }));
}

export function isPathMatching(paths: Array<RegExp>, pathname: string): boolean {
  return paths.some((regexp) => regexp.test(pathname));
}

export function htmlReplace({
  html,
  loaderData,
  remixBuild,
  routes,
  url,
}: {
  routes: Array<AssetsRoute>;
  url: URL;
  html: string;
  remixBuild: any;
  loaderData: RouteData;
}): string {
  const entry = remixBuild.entry;
  const assets = remixBuild.assets;
  const matches = matchServerRoutes(routes, url.pathname)!;

  const generateMeta = () => {
    return {
      script: "",
      data: [],
    };
  };

  const generateLinks = () => {
    const keyedLinks = getKeyedLinksForMatches(matches, remixBuild.routes, remixBuild).map((_) => _.link);

    const script = keyedLinks.map((item) => `<link rel="${item.rel}" href="${item.href}" />`).join("\n");

    return {
      script,
      data: keyedLinks,
    };
  };

  const generatePreloadModule = () => {
    const routePreloads = matches
      .map((match) => {
        const route = remixBuild.routes[match.route.id];

        return (route.imports || []).concat([route.module]);
      })
      .flat(1);

    const preloads = entry.imports.concat(routePreloads);

    const data = dedupe([remixBuild.url, entry.module].concat(preloads)).map((_) => {
      return {
        type: "modulepreload",
        href: _,
      };
    });

    const script = data
      .map((preload) => {
        if (preload.type === "script") {
          return `<link rel="preload" href="${preload.href}" as="script" crossorigin="" />`;
        }
        return `<link rel="modulepreload" href="${preload.href}" />`;
      })
      .join("\n");

    return {
      script,
      data,
    };
  };

  /**
   * window.__remixContext = {"url":"/"," state":{"loaderData":{"root":null,"routes/_index":null},"actionData":null,"errors":null},"future":{"v3_fetcherPersist":false}};
   *
   * See https://github.com/remix-run/remix/blob/ae65995a175cbe383d86687a3efe87625bf10a82/packages/remix-react/components.tsx#L671
   *
   * We need to generate a context object in the Service Worker, which contains information about the current route, as well as some other information
   * This is not complete. I fixed the value of root because I didn't use Remix loader. This can be improved.
   */
  const generateContextScript = () => {
    const context = {
      url: url.pathname,
      state: {
        loaderData,
        actionData: null,
        errors: null,
      },
      future: remixBuild.future,
    };
    const content = `window.__remixContext = ${JSON.stringify(context)};`;

    return {
      script: `<script>${content}</script>`,
      data: context,
    };
  };

  /**
   * import "/manifest-e371d393.js";
   * import * as route0 from "/assets/root-thfnRiDU.js";
   * import * as route1 from "/assets/_main-HVeUxBge.js";
   * import * as route2 from "/assets/_main._index-6H7L9yYC.js";
   * window.__remixRouteModules = {"root":route0,"routes/_main":route1,"routes/_main._index":route2};
   * import("/assets/entry.client-qGrNPbmg.js");
   *
   * See https://github.com/remix-run/remix/blob/ae65995a175cbe383d86687a3efe87625bf10a82/packages/remix-react/components.tsx#L772
   *
   * We need to generate a script import in she Service Worker.
   */
  const generateRouteModuleScript = () => {
    const content = `
import ${JSON.stringify(assets.url)}\n${matches
      .map(
        (match, index) => `import * as route${index} from ${JSON.stringify(remixBuild.routes[match.route.id].module)};`
      )
      .join("\n")}
window.__remixRouteModules = {${matches
      .map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`)
      .join(",")}};
    
import(${JSON.stringify(assets.entry.module)});`;

    return {
      script: `<script type="module" async>${content}</script>`,
      data: content,
    };
  };

  const result = {
    // meta: generateMeta(),
    modulepreload: generatePreloadModule(),
    links: generateLinks(),
    context: generateContextScript(),
    routeModule: generateRouteModuleScript(),
  };

  const pwaHydrateResult = JSON.stringify({
    // meta: result.meta.data,
    links: result.links.data,
    modulepreload: result.modulepreload.data,
    context: result.context.data,
    routeModule: result.routeModule.data,
  });

  return (
    html
      .replace(/<meta id="__remix_pwa_modulepreload"\/>/, result.modulepreload.script)
      // .replace(/<meta id="__remix_pwa_meta"\/>/, result.meta.script)
      .replace(/<meta id="__remix_pwa_links"\/>/, result.links.script)
      .replace(/<script\s+id="__remix_pwa_context">([^]*?)<\/script>/, result.context.script)
      .replace(/<script\s+id="__remix_pwa_route_modules">([^]*?)<\/script>/, result.routeModule.script)
      .replace(
        /<div\s+id="__remix_pwa_hydrate_data">([^]*?)<\/div>/,
        `<div id='__remix_pwa_hydrate_data' style='display: none;'>${pwaHydrateResult}</div>`
      )
  );
}
