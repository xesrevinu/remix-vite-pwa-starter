import { PrivacyScreen } from "@/marketing/privacy";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Privacy Policy",
    },
  ];
};

export default PrivacyScreen;
