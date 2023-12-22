import * as fs from "node:fs";
import * as path from "node:path";

import * as esbuild from "esbuild";

function stripAssets(assets: any) {
  return {
    url: assets.url,
    version: assets.version,
    entry: { module: assets.entry.module },
  };
}

function stripRoutes(assets: any) {
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
    })
  );

  return routes;
}

function transform(content: string, remixBuild: any) {
  // replace remix build
  let swContent = content.replace(
    "self.__REMIX_BUILD",
    JSON.stringify({
      url: remixBuild.assets.url,
      entry: remixBuild.assets.entry,
      assets: stripAssets(remixBuild.assets),
      routes: stripRoutes(remixBuild.assets),
      future: remixBuild.future,
    })
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
