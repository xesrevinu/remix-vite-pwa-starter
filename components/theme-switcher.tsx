import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { LucideLaptop, LucideMoon, LucideSunMedium } from "lucide-react";

type InputColorScheme = "light" | "dark" | "system";

interface ThemeToggleProps {
  setTheme?: (theme: InputColorScheme) => void;
  className?: string;
}

export const mode = [
  {
    icon: <LucideSunMedium className="mr-2 h-4 w-4" />,
    name: "light",
  },
  {
    icon: <LucideMoon className="mr-2 h-4 w-4" />,
    name: "dark",
  },
  {
    icon: <LucideLaptop className="mr-2 h-4 w-4" />,
    name: "system",
  },
] as const;

export function ThemeSwitcher({ setTheme, className }: ThemeToggleProps) {
  const theme = useTheme();

  const change = setTheme || theme.setTheme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className={className}>
          <LucideSunMedium className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <LucideMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {mode.map((item) => {
          return (
            <DropdownMenuItem
              className={theme.theme.toLowerCase() === item.name ? "bg-accent text-accent-foreground" : ""}
              key={item.name}
              onClick={() => change(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
