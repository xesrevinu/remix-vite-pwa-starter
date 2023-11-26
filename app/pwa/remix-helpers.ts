import { createRoutes, matchRoutes } from "@/pwa/react-router";

// See https://github.com/remix-run/remix/blob/ae65995a175cbe383d86687a3efe87625bf10a82/packages/remix-server-runtime/routeMatching.ts#L12
function matchServerRoutes(routes: Array<any>, pathname: string, basename: string = "/") {
  const matches = matchRoutes(routes, pathname, basename);

  if (!matches) return [];

  return matches.map((match) => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route as unknown,
  }));
}

function generate(remixBuild: any) {
  const manifest = remixBuild.assets;
  const routes = createRoutes(remixBuild.routes);

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
  const generateContextScript = (pathname: string, loaderData: any) => {
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
  const generateModuleScript = (pathname: string) => {
    const matches = matchServerRoutes(routes, pathname)!;

    const content = `
    import ${JSON.stringify(manifest.url)}
    ${matches
      .map(
        (match, index) =>
          `import * as route${index} from ${JSON.stringify(
            // @ts-expect-error
            manifest.routes[match.route.id].module
          )};`
      )
      .join("\n  ")}
    window.__remixRouteModules = {${matches
      // @ts-expect-error
      .map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`)
      .join(",")}};
    
    import(${JSON.stringify(manifest.entry.module)});`;

    return `<script id='remix-scripts' type="module" async>${content}</script>`;
  };

  return {
    generateMeta,
    generateLinks,
    generateContextScript,
    generateModuleScript,
  };
}

export function matchPaths(paths: Array<RegExp>, pathname: string) {
  return paths.some((path) => {
    const regex = new RegExp(path);

    return regex.test(pathname);
  });
}

export function replaceFromResponse(remixBuild: any) {
  return async function (pathname: string, response: Response) {
    const { generateContextScript, generateLinks, generateMeta, generateModuleScript } = generate(remixBuild);

    const text = await response.text();

    const replaceText = text.replace(
      /<script\b[^>]*id\s?=\s?["']remix-scripts["'][^>]*>[\s\S]*?<\/script>/gi,
      // replace match index
      (match) => {
        if (match.indexOf("__remixContext") > -1) {
          const loadData = {
            root: {
              hasShell: false,
            },
          };

          return generateContextScript(pathname, loadData);
        }

        return generateModuleScript(pathname);
      }
    );

    return new Response(replaceText, {
      headers: {
        "Content-Type": "text/html",
        // we need this for OPFS, if you don't need it, remove it
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
    });
  };
}
