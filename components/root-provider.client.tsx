import { AppLifecycleProvider } from "@/components/app-life-cycle/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { UpdateAvailableTips } from "@/components/app-life-cycle/update-available";
import { Toaster } from "sonner";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AppLifecycleProvider>
        <Toaster />
        <UpdateAvailableTips />
        {children}
      </AppLifecycleProvider>
    </ThemeProvider>
  );
};
