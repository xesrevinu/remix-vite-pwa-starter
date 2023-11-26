export const appLifecycleHookSymbol = Symbol.for("app-lifecycle-hook");

export type InstallPromptType = "popover" | "native";

export type UserChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

export type AppLifecycleHook = {
  state: {
    offlineReady: boolean;
    updateAvailable: boolean;
    installPromptType: InstallPromptType;
    installPrompt: () => Promise<UserChoice>;
  };
  reload: () => void;
  onOfflineReady: (status: boolean) => void;
  onUpdateAvailable: (status: boolean) => void;
  onInstallPromptAvailable: (type: InstallPromptType, fn: () => Promise<UserChoice>) => void;
};

export const loop = () => {};

export const defaultValue: AppLifecycleHook = {
  state: {
    offlineReady: true,
    updateAvailable: false,
    installPromptType: "popover",
    installPrompt: () => Promise.reject(new Error("No install prompt available")),
  },
  reload: () => window.location.reload(),
  onOfflineReady: loop,
  onUpdateAvailable: loop,
  onInstallPromptAvailable: loop,
};

// @ts-ignore
export const install = () => (globalThis[appLifecycleHookSymbol] = defaultValue);

// @ts-ignore
export const getAppLifecycleHook = () => globalThis[appLifecycleHookSymbol] as AppLifecycleHook;
