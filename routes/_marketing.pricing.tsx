import { LoaderData, PricingScreen } from "@/marketing/pricing";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Pricing",
    },
  ];
};

export const loader = () => {
  return {
    plans: [
      {
        id: 1,
        name: "Free",
        description: "Forever free",
        price: 0,
        features: ["1 user", "Plan features", "Product support"],
      },
      {
        id: 2,
        name: "Startup",
        recommended: true,
        description: "All the basics for starting a new business",
        price: 39,
        features: ["2 users", "Plan features", "Product support"],
      },
      {
        id: 3,
        name: "Team",
        description: "Everything you need for a growing business",
        price: 89,
        features: ["5 users", "Plan features", "Product support"],
      },
    ],
  } satisfies LoaderData;
};

export default PricingScreen;
