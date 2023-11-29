import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useSigned } from "@/hooks/use-auth";
import { Link, useNavigate } from "@remix-run/react";

export function Header() {
  const signed = useSigned();

  const navigate = useNavigate();

  return (
    <header className="z-10">
      <div className="container mx-auto flex flex-wrap px-5 py-2 flex-col md:flex-row">
        <Link to="/" className="flex font-medium items-center mb-1 md:mb-0">
          <img src="/favicons/favicon.png" className="w-7 h-7" />
          <span className="ml-3 text-lg">Remix Vite PWA Best thing</span>
        </Link>
        <div className="flex items-center ml-auto justify-center">
          <nav className="flex items-center justify-center space-x-10 px-4 mr-4">
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="flex space-x-3">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                if (signed) {
                  navigate("/");
                  return;
                } else {
                  navigate("/sign-in");
                }
              }}
            >
              {signed ? "Launch" : "Sign In"}
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
