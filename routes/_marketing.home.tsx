import { MarketingHomeScreen } from "@/marketing/home";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Remix Starter",
    },
  ];
};

export default MarketingHomeScreen;
