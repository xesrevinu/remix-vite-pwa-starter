import "@/styles/global.css";

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import * as RootProvider from "@/components/root-provider.client";
// For server side this import will be empty, console.log(RootProviderClient) -> {}

import pwaEnvScript from "@/components/inline-scripts/pwa-env.js?raw";
import themeSetScript from "@/components/inline-scripts/theme-set.js?raw";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const headers = request.headers;
  const url = request.url;
  const hasShell = url.indexOf("?shell") > -1;
  const cookie = headers.get("Cookie");
  const hasSigned = cookie && cookie.includes("signed=true");

  return {
    hasSigned,
    hasShell,
  };
};

function Document({
  children,
  htmlClassName,
  bodyClassName,
  lang,
}: {
  htmlClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <html suppressHydrationWarning className={htmlClassName} lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon-180x180.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-title" content="0x" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta content="hsl(240, 0%, 98%)" media="(prefers-color-scheme: light)" name="theme-color" />
        <meta content="hsl(225, 5%, 15%)" media="(prefers-color-scheme: dark)" name="theme-color" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeSetScript }}></script>
      </head>
      <body suppressHydrationWarning className={bodyClassName}>
        <script dangerouslySetInnerHTML={{ __html: pwaEnvScript }}></script>
        <div className="root-layout" id="root-layout">
          {children}
        </div>
        <Scripts id="remix-scripts" />
        {import.meta.env.DEV && <LiveReload />}
      </body>
    </html>
  );
}

const RootOutlet = () => {
  const { hasShell } = useLoaderData<{ hasShell: boolean }>();

  return hasShell ? null : <Outlet />;
};

const Identity = ({ children }: { children: React.ReactNode }) => children;

// reduce server bundle size
const Provider = import.meta.env.SSR ? Identity : RootProvider.RootProvider;

export default function App() {
  const originClass = typeof document !== "undefined" ? document.documentElement.className : "";
  const originBodyClass = typeof document !== "undefined" ? document.body.className : "";
  const lang = "en";

  return (
    <Document htmlClassName={originClass} bodyClassName={originBodyClass} lang={lang}>
      <Provider>
        <RootOutlet />
      </Provider>
    </Document>
  );
}
