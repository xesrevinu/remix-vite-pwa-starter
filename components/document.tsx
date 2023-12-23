import { Links, LiveReload, Meta, Scripts } from "@remix-run/react";
import type { ReactNode } from "react";
import pwaEnvScript from "@/components/inline-scripts/pwa-env.js?raw";
import themeSetScript from "@/components/inline-scripts/theme-set.js?raw";

import { cn } from "@/utils";

const commonMeta = (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="theme-color" content="white" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="black" media="(prefers-color-scheme: dark)" />
    <meta name="description" content="A starter for Remix with TypeScript, React, Tailwind CSS, and more." />
    <meta name="apple-mobile-web-app-title" content="vite-remix-pwa" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon-180x180.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
  </>
);

function ShellDocument({
  bodyClassName,
  children,
  htmlClassName,
  lang,
  scripts,
}: {
  lang?: string | undefined;
  htmlClassName?: string | undefined;
  bodyClassName?: string | undefined;
  scripts?: ReactNode | undefined;
  children?: ReactNode;
}) {
  return (
    <html className={htmlClassName} lang={lang}>
      <head>
        {commonMeta}
        {/* <meta id="__remix_pwa_meta" /> */}
        <meta id="__remix_pwa_modulepreload" />
        <meta id="__remix_pwa_links" />
        {scripts}
      </head>
      <body className={bodyClassName}>
        {children}
        <div id="__remix_pwa_hydrate_data"></div>
        <script id="__remix_pwa_context" />
        <script id="__remix_pwa_route_modules" />
      </body>
    </html>
  );
}

export function RootShellHTML({
  bodyClassName,
  htmlClassName,
  lang,
  scripts,
}: {
  htmlClassName?: string | undefined;
  bodyClassName?: string | undefined;
  lang?: string | undefined;
  scripts?: ReactNode | undefined;
  hasShell?: boolean | undefined;
}) {
  return (
    <ShellDocument
      htmlClassName={htmlClassName}
      lang={lang}
      bodyClassName={bodyClassName}
      scripts={
        <>
          <script dangerouslySetInnerHTML={{ __html: themeSetScript }}></script>
          <script
            defer
            data-domain="remix-vite-pwa-starter.up.railway.app"
            src="https://plausible.io/js/script.js"
          ></script>
          {scripts}
        </>
      }
    >
      <script dangerouslySetInnerHTML={{ __html: pwaEnvScript }}></script>
      <div className="root-layout" id="root-layout" />
      {import.meta.env.DEV && <LiveReload />}
    </ShellDocument>
  );
}

function HydrateDocument({
  bodyClassName,
  children,
  htmlClassName,
  lang,
  scripts,
}: {
  lang?: string | undefined;
  htmlClassName?: string | undefined;
  bodyClassName?: string | undefined;
  scripts?: ReactNode | undefined;
  children?: ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={htmlClassName} lang={lang}>
      <head>
        {commonMeta}
        <Meta />
        <Links />
        {scripts}
      </head>
      <body suppressHydrationWarning className={bodyClassName}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ClientRenderDocument({
  bodyClassName,
  children,
  htmlClassName,
  lang,
}: {
  lang?: string | undefined;
  bodyClassName?: string | undefined;
  htmlClassName?: string | undefined;
  children?: ReactNode;
}) {
  const documentExist = typeof document !== "undefined";
  const originHtmlClass = documentExist ? document.documentElement.className : "";
  const originBodyClass = documentExist ? document.body.className : "";
  const originLang = documentExist ? document.documentElement.lang : "";

  const hydrateData = window.__remix_pwa_hydrate_data;

  if (!import.meta.env.DEV && !hydrateData) {
    throw new Error("remix pwa hydrate data not found");
  }

  const modulepreload =
    hydrateData &&
    hydrateData.modulepreload &&
    hydrateData.modulepreload.map((item) => {
      if (item.type === "script") {
        return <link key={item.href} rel="modulepreload" href={item.href} as="script" crossOrigin="" />;
      }

      return <link key={item.href} rel="modulepreload" href={item.href} />;
    });

  return (
    <html className={cn(htmlClassName, originHtmlClass)} lang={originLang || lang}>
      <head>
        {commonMeta}
        <Meta />
        {modulepreload}
      </head>
      <body className={cn(bodyClassName, originBodyClass)}>{children}</body>
    </html>
  );
}

export function RootHTML({
  bodyClassName,
  children,
  htmlClassName,
  lang,
  scripts,
}: {
  htmlClassName?: string | undefined;
  bodyClassName?: string | undefined;
  children: ReactNode;
  lang?: string | undefined;
  scripts?: ReactNode | undefined;
}) {
  const hasHydrateMode = import.meta.env.SSR
    ? true
    : typeof window !== "undefined" && window.__remix_pwa_render_mode === "hydrate";

  const html = hasHydrateMode ? (
    <HydrateDocument
      htmlClassName={htmlClassName}
      bodyClassName={bodyClassName}
      lang={lang}
      scripts={
        <>
          <script dangerouslySetInnerHTML={{ __html: themeSetScript }}></script>
          <script
            defer
            data-domain="remix-vite-pwa-starter.up.railway.app"
            src="https://plausible.io/js/script.js"
          ></script>
          {scripts}
        </>
      }
    >
      <script dangerouslySetInnerHTML={{ __html: pwaEnvScript }}></script>
      <div className="root-layout" id="root-layout">
        {children}
      </div>
      {import.meta.env.DEV && <LiveReload />}
    </HydrateDocument>
  ) : (
    <ClientRenderDocument htmlClassName={htmlClassName} bodyClassName={bodyClassName} lang={lang}>
      <div className="root-layout" id="root-layout">
        {children}
      </div>
      {import.meta.env.DEV && <LiveReload />}
    </ClientRenderDocument>
  );

  return html;
}
