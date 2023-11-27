import { SettingsScreen } from "@/app/settings";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Settings",
    },
  ];
};

export default SettingsScreen;
