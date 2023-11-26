import { cn } from "@/utils";
import { Link, NavLink } from "@remix-run/react";
import { LucideBarChart, LucideFileText, LucideHelpCircle, LucideHome, LucideSettings } from "lucide-react";

export function Menu() {
  return (
    <>
      <div style={{ left: 0, opacity: 1, width: "256px" }} className="bg-background"></div>
      <div
        className="pointer-events-auto fixed inset-y-0 left-0 r "
        style={{
          width: "256px",
        }}
      >
        <div className="bg-slate-900 flex flex-col bg-opacity-30 backdrop-blur pb-2 w-full h-full overflow-y-auto">
          <div className="px-6 py-2 text-lg">App</div>

          <nav className="p-3 w-full flex-1">
            <ul className="space-y-1.5">
              <MenuLink to="/" icon={<LucideBarChart />} title="Dashboard" />
              <MenuLink to="/invoices" icon={<LucideFileText />} title="Invoices" />
              <MenuLink to="/settings" icon={<LucideSettings />} title="Settings" />
            </ul>
          </nav>

          <div>
            <div className="flex flex-col px-2 space-y-1.5">
              <Link
                to="/home"
                className="w-full flex items-center gap-x-3.5 py-2 px-2.5  rounded-lg hover:bg-blue-600-300"
              >
                <LucideHome className="w-4 h-4" />
                Website
              </Link>

              <a className="w-full flex items-center gap-x-3.5 py-2 px-2.5  rounded-lg hover:bg-blue-600-300" href="#">
                <LucideHelpCircle className="w-4 h-4" />
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuLink({ to, icon, title }: { to: string; icon: React.ReactNode; title: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={(_) => cn("flex items-center gap-x-3 py-2 px-2.5 rounded-lg", _.isActive ? "bg-blue-600" : "")}
      >
        {icon}
        {title}
      </NavLink>
    </li>
  );
}
