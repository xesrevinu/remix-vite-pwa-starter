import "@/styles/global.css";

import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import * as RootProvider from "@/components/root-provider.client";
// For server side this import will be empty, console.log(RootProviderClient) -> {}

import { RootHTML, RootShellHTML } from "@/components/document";

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

const useHasShell = () => {
  if (import.meta.env.SSR) {
    return useLoaderData<{ hasShell: boolean }>().hasShell;
  }

  // client side will never be shell
  return false;
};

// reduce server bundle size
const Provider = import.meta.env.SSR
  ? ({ children }: { children: React.ReactNode }) => children
  : RootProvider.RootProvider;

export default function App() {
  const lang = "en";
  const htmlClassName = "";
  const bodyClassName = "";
  const hasShell = import.meta.env.SSR ? useHasShell() : false;

  if (hasShell) {
    return <RootShellHTML htmlClassName={htmlClassName} bodyClassName={bodyClassName} lang={lang} />;
  }

  return (
    <RootHTML htmlClassName={htmlClassName} bodyClassName={bodyClassName} lang={lang}>
      <Provider>
        <Outlet />
      </Provider>
    </RootHTML>
  );
}
