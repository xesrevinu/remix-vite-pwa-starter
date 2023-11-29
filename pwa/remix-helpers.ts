import type { Params } from "react-router-dom";
import { matchRoutes } from "./react-router";

export type RouteData = Record<string, any> | null;

export interface AssetsRoute {
  id: string;
  parentId: string;
  path: string;
  module: string;
  hasAction: boolean;
  hasLoader: boolean;
  hasErrorBoundary: boolean;
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
  pathname,
  remixBuild,
  routes,
}: {
  routes: Array<AssetsRoute>;
  pathname: string;
  html: string;
  remixBuild: any;
  loaderData: RouteData;
}): string {
  const assets = remixBuild.assets;
  const matches = matchServerRoutes(routes, pathname)!;

  // TODO: i think this is not needed, client side will handle this
  const generateMeta = () => {
    return "";
  };

  // TODO: i think this is not needed
  const generateLinks = () => {
    return "";
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
      url: pathname,
      state: {
        loaderData,
        actionData: null,
        errors: null,
      },
      future: remixBuild.future,
    };
    const content = `window.__remixContext = ${JSON.stringify(context)};`;

    return `<script id='remix-scripts'>${content}</script>`;
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
  const generateModuleScript = () => {
    const content = `
    import ${JSON.stringify(assets.url)}
    ${matches
      .map(
        (match, index) => `import * as route${index} from ${JSON.stringify(remixBuild.routes[match.route.id].module)};`
      )
      .join("\n  ")}
    window.__remixRouteModules = {${matches
      .map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`)
      .join(",")}};
    
    import(${JSON.stringify(assets.entry.module)});`;

    return `<script id='remix-scripts' type="module" async>${content}</script>`;
  };

  return html.replace(
    /<script\b[^>]*id\s?=\s?["']remix-scripts["'][^>]*>[\s\S]*?<\/script>/gi,
    // replace match index
    (match) => {
      if (match.indexOf("__remixContext") > -1) {
        return generateContextScript();
      }

      return generateModuleScript();
    }
  );
}
