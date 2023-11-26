import * as fs from "node:fs";
import * as path from "node:path";

import * as esbuild from "esbuild";

function stripRoutes(routes: any) {
  // remove module prop
  return Object.fromEntries(
    Object.entries(routes).map(([key, value]) => {
      return [
        key,
        {
          // @ts-expect-error
          ...value,
          module: undefined,
        },
      ];
    })
  );
}

function stripAssets(assets: any) {
  const pick = (obj: any) => {
    return {
      module: obj.module,
      id: obj.id,
    };
  };

  const routes = Object.fromEntries(
    Object.entries(assets.routes).map(([key, value]) => {
      return [key, pick(value)];
    })
  );
  return {
    url: assets.url,
    version: assets.version,
    entry: pick(assets.entry),
    routes,
  };
}

function transform(content: string, remixBuild: any) {
  // replace remix build
  let swContent = content.replace(
    "self.__REMIX_BUILD",
    JSON.stringify({
      assets: stripAssets(remixBuild.assets),
      routes: stripRoutes(remixBuild.routes),
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
