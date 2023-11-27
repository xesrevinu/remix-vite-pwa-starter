import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useClearSigned } from "@/hooks/use-auth";

export function Header() {
  const clearSigned = useClearSigned();

  return (
    <header className="p-1 flex space-x-1.5 items-center justify-end border-b border-border">
      <Button
        size="sm"
        variant={"outline"}
        onClick={() => {
          clearSigned();
        }}
      >
        Logout
      </Button>
      <ThemeSwitcher />
    </header>
  );
}
