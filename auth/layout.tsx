import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Footer } from "@/marketing/components/footer";
import { Link } from "@remix-run/react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="container py-10 flex w-full items-center justify-between px-10">
        <Link to="/">
          <Button size="sm" variant={"ghost"}>
            Back
          </Button>
        </Link>
        <ThemeSwitcher />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
