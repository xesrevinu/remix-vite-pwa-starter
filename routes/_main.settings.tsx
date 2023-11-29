import * as Screen from "@/app/settings/screen.client";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Settings",
    },
  ];
};

export default import.meta.env.SSR ? () => null : Screen.SettingsScreen;
