import { useSigned } from "@/hooks/use-auth";
// Why @remix-run/react don't export Navigate component
import { Outlet, useLocation } from "@remix-run/react";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import * as AppLayoutClient from "@/app/layouts/main.client";
import * as MarketingLayout from "@/marketing/layout";
import { protectedRoutes } from "@/config";
import { matchPaths } from "@/pwa/remix-helpers";

export default function MainLayout() {
  const hasSigned = useSigned();
  const { pathname } = useLocation();
  const isIndexPath = pathname === "/";

  let content = null;

  // Server side
  // Reduce server bundle size, don't import client side files
  if (import.meta.env.SSR) {
    if (isIndexPath) {
      content = hasSigned ? null : <MarketingLayout.MarketingLayout />;
    } else if (matchPaths(protectedRoutes, pathname)) {
      content = null;
    } else {
      content = <Outlet />;
    }
  } else {
    // Client side
    const appLayout = <AppLayoutClient.MainLayout />;

    if (isIndexPath) {
      content = hasSigned ? appLayout : <MarketingLayout.MarketingLayout />;
    } else if (matchPaths(protectedRoutes, pathname)) {
      content = hasSigned ? appLayout : <Navigate to="/" replace />;
    } else {
      content = <Outlet />;
    }
  }

  // blocking suspense, we don't want to show anything until we know what to show
  // if we show something, page will jump when we show the real content
  return <Suspense fallback={content}>{content}</Suspense>;
}
