import * as Screen from "@/app/invoices/screen.client";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Invoices",
    },
  ];
};

// Reduce server bundle size, don't import client side files
export default import.meta.env.SSR ? () => null : Screen.InvoicesScreen;
