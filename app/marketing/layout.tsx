import { Footer } from "@/marketing/components/footer";
import { Header } from "@/marketing/components/header";
import { Outlet } from "@remix-run/react";

export function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
