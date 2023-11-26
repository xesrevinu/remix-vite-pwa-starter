import { PricingScreen } from "@/marketing/pricing";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Pricing",
    },
  ];
};

export default PricingScreen;
