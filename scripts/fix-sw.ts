import * as fs from "node:fs";
import * as path from "node:path";

import * as esbuild from "esbuild";
import { type RemixBuild } from "@/pwa/remix-helpers";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function stripAssets(assets: any) {
  return {
    url: assets.url,
    version: assets.version,
    entry: assets.entry,
    routes: stripRoutes(assets),
  } satisfies RemixBuild["assets"];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function stripRoutes(assets: any) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const pick = (obj: any) => {
    return {
      id: obj.id,
      parentId: obj.parentId,
      path: obj.path || "",
      index: obj.index || false,
      caseSensitive: obj.caseSensitive || false,
      hasAction: obj.hasAction,
      hasLoader: obj.hasLoader,
      hasClientAction: obj.hasClientAction,
      hasClientLoader: obj.hasClientLoader,
      hasErrorBoundary: obj.hasErrorBoundary,
      css: obj.css,
      module: obj.module,
      imports: obj.imports,
    };
  };

  const routes = Object.fromEntries(
    Object.entries(assets.routes).map(([key, value]) => {
      return [key, pick(value)];
    }),
  );

  return routes satisfies RemixBuild["assets"]["routes"];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function transform(content: string, remixBuild: Record<string, any>) {
  // replace remix build
  let swContent = content.replace(
    "self.__REMIX_BUILD",
    JSON.stringify({
      entry: { module: remixBuild.assets.entry.module },
      assets: stripAssets(remixBuild.assets),
      future: remixBuild.future,
    } satisfies RemixBuild),
  );

  // fix manifest-[version].js

  const version = remixBuild.assets.version;
  const manifestScriptUrl = remixBuild.assets.url;

  const MANIFEST_CUSTOM = JSON.stringify([
    {
      url: "/?shell=true",
      revision: version,
    },
    {
      url: manifestScriptUrl,
      revision: version,
    },
  ]);

  swContent = swContent
    .replace("self.__MANIFEST_VERSION", JSON.stringify(version))
    .replace("self.__MANIFEST_CUSTOM", MANIFEST_CUSTOM);

  return esbuild
    .transform(swContent, {
      legalComments: "none",
      loader: "js",
      minify: true,
    })
    .then((_) => _.code);
}

const dist = path.resolve(process.cwd(), "build");

const swPath = path.join(dist, "client/sw.js");
const remixBuildPath = path.join(dist, "server/index.js");

const swContent = fs.readFileSync(swPath, "utf8");

import(remixBuildPath)
  .then((_) => transform(swContent, _))
  .then((_) => {
    fs.writeFileSync(swPath, _);
  });
