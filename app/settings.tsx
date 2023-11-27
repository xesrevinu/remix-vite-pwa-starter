import { InstallAppPrompt } from "@/components/app-life-cycle/install-prompt";
import { OfflineReady } from "@/components/app-life-cycle/offline-ready";
import { UpdateAvailable } from "@/components/app-life-cycle/update-available";

export function SettingsScreen() {
  return (
    <div className="px-3 pt-4">
      <p className="text-lg pb-3">Settings</p>
      <div className="py-3 space-y-1 flex flex-col">
        <UpdateAvailable />
        <InstallAppPrompt />
        <OfflineReady />
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />
      <p className="py-1 text-center">More coming soon...</p>
    </div>
  );
}
