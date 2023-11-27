import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { VitePWAOptions, VitePWA as vitePWA } from "vite-plugin-pwa";

const appDir = __dirname;

const manifest: VitePWAOptions["manifest"] = {
  name: "vite-remix-pwa",
  short_name: "vite-remix-pwa",
  description: "vite-remix-pwa description",
  start_url: "/",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#DCF521",
  scope: ".",
  icons: [
    {
      src: "favicons/pwa-64x64.png",
      sizes: "64x64",
      type: "image/png",
    },
    {
      src: "favicons/pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "favicons/pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "favicons/maskable-icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  includeAssets: ["favicons", "locales", "fonts", "images"],
  manifest,
  mode: "production",
  scope: "/",
  // minify later by build script
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
      "safari-pinned-tab.svg",
      "favicons/**/*",
      "fonts/**/*",
      "locales/**/*",
      "images/**/*",
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
