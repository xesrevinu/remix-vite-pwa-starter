import { InvoicesScreen } from "@/screens/invoices";
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Invoices",
    },
  ];
};

export default InvoicesScreen;
