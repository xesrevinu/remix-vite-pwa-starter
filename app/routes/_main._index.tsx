import { useSigned } from "@/hooks/use-auth";
import { MetaFunction } from "@remix-run/react";
import { Suspense } from "react";
import { MarketingHomeScreen } from "@/marketing/home";
import * as MainHomeScreenClient from "@/screens/home.client";

export const meta: MetaFunction = () => {
  return [{ title: "Home" }];
};

export default function Main() {
  const hasSigned = useSigned();

  let content = null;

  if (import.meta.env.SSR) {
    content = hasSigned ? null : <MarketingHomeScreen />;
  } else {
    content = hasSigned ? <MainHomeScreenClient.MainIndex /> : <MarketingHomeScreen />;
  }

  return <Suspense fallback={hasSigned ? null : content}>{content}</Suspense>;
}
