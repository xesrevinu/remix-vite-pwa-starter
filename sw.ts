/// <reference lib="webworker" />

import { type PrecacheEntry } from "workbox-precaching";
import { dynamicPaths } from "./config";
import { init } from "./pwa/sw";

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
const custom_manifest = self.__MANIFEST_CUSTOM;

const manifest = MANIFEST.concat(custom_manifest || []);

init({
  dynamicPaths,
  manifest,
  manifestVersion,
  remixBuild,
  makeLoaderData: () => {
    return {
      root: {
        hasShell: false,
        hasSigned: false,
      },
    };
  },
});
