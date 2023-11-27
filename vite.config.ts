import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { VitePWAOptions, VitePWA as vitePWA } from "vite-plugin-pwa";

const appDir = __dirname;

const manifest: VitePWAOptions["manifest"] = {
  name: "vite-remix-pwa",
  short_name: "vite-remix-pwa",
  description: "vite-remix-pwa description",
  scope: ".",
  display: "standalone",
  start_url: "/",
  theme_color: "#DCF521",
  background_color: "#000000",
  icons: [
    {
      purpose: "maskable",
      sizes: "192x192",
      src: "/favicons/android-chrome-192x192.png",
      type: "image/png",
    },
    {
      purpose: "any",
      sizes: "512x512",
      src: "/favicons/android-chrome-512x512.png",
      type: "image/png",
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  includeAssets: ["favicons", "locales", "fonts"],
  manifest,
  mode: "production",
  scope: "/",
  minify: false,
  injectRegister: null,
  registerType: "prompt",
  srcDir: appDir,
  strategies: "injectManifest",
  filename: "sw.ts",
  buildBase: "/",
  injectManifest: {
    globPatterns: [
      "assets/**/*.{js,css,wasm}",
      "robots.txt",
      "safari-pinned-tab.svg",
      "favicons/**/*",
      "fonts/**/*",
      "locales/**/*",
    ],
  },
  workbox: {
    mode: "production",
    disableDevLogs: true,
  },
};

export default defineConfig({
  resolve: {
    alias: {
      "@": appDir,
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  plugins: [
    remix({
      appDirectory: appDir,
      ignoredRouteFiles: ["**/.*"],
    }),
    vitePWA(pwaOptions),
  ],
});
