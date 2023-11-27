import { MetaFunction } from "@remix-run/react";
import { TermsScreen } from "@/marketing/terms";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Terms of Service",
    },
  ];
};

export default TermsScreen;
