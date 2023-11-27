import { AboutScreen } from "@/marketing/about";
import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "About",
    },
  ];
};

export default AboutScreen;
