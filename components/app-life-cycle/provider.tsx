import React, { useLayoutEffect, createContext, useContext, useState, useCallback } from "react";
import {
  AppLifecycleHook,
  InstallPromptType,
  UserChoice,
  defaultValue,
  getAppLifecycleHook,
  loop,
} from "@/components/app-life-cycle/life-cycle";

interface AppLifecycleContextValue {
  offlineReady: boolean;
  updateAvailable: boolean;
  installPromptType: InstallPromptType;
  installPrompt: () => Promise<UserChoice>;
}
const AppLifecycleContext = createContext<AppLifecycleContextValue | null>(null);

export function useAppLifecycleContext() {
  const ctx = useContext(AppLifecycleContext);

  return (
    ctx || {
      installPrompt: defaultValue.state.installPrompt,
      installPromptType: defaultValue.state.installPromptType,
      offlineReady: defaultValue.state.offlineReady,
      updateAvailable: defaultValue.state.updateAvailable,
    }
  );
}

export function useAppReload() {
  const lifecycleHook = getAppLifecycleHook();

  return lifecycleHook.reload;
}

export function useAppInstallPrompt() {
  return useAppLifecycleContext().installPrompt;
}

export function useAppOfflineReady() {
  return useAppLifecycleContext().offlineReady;
}

export function useAppUpdateAvailable() {
  return useAppLifecycleContext().updateAvailable;
}

export function useAppInstallPromptType() {
  return useAppLifecycleContext().installPromptType;
}

export function useAppLifecycleState() {
  const { offlineReady, updateAvailable, installPromptType } = useAppLifecycleContext();

  return {
    offlineReady,
    updateAvailable,
    installPromptType,
  };
}

export function useAppRunningType() {
  return document.body.classList.contains("in-app");
}

export function AppLifecycleProvider({ children }: { children?: React.ReactNode }) {
  const lifecycleHook = getAppLifecycleHook();

  if (!lifecycleHook) {
    throw new Error("App lifecycle hook not installed");
  }

  const [state, setState_] = useState(() => {
    return {
      offlineReady: lifecycleHook.state.offlineReady,
      updateAvailable: lifecycleHook.state.updateAvailable,
      installPromptType: lifecycleHook.state.installPromptType,
      installPrompt: lifecycleHook.state.installPrompt,
    } satisfies AppLifecycleContextValue;
  });

  const setState = useCallback(
    (_: Partial<AppLifecycleContextValue>) =>
      setState_((state) => ({
        ...state,
        ..._,
      })),
    [],
  );

  const onOfflineReady = useCallback((status: boolean) => setState({ offlineReady: status }), [setState]);

  const onUpdateAvailable = useCallback((status: boolean) => setState({ updateAvailable: status }), [setState]);

  const onInstallPromptAvailable: AppLifecycleHook["onInstallPromptAvailable"] = useCallback(
    (type, fn) =>
      setState({
        installPromptType: type,
        installPrompt: fn,
      }),
    [setState],
  );

  useLayoutEffect(() => {
    lifecycleHook.onOfflineReady = onOfflineReady;
    lifecycleHook.onUpdateAvailable = onUpdateAvailable;
    lifecycleHook.onInstallPromptAvailable = onInstallPromptAvailable;

    return () => {
      lifecycleHook.onOfflineReady = loop;
      lifecycleHook.onUpdateAvailable = loop;
      lifecycleHook.onInstallPromptAvailable = loop;
    };
  }, [onOfflineReady, onUpdateAvailable, onInstallPromptAvailable, lifecycleHook]);

  return <AppLifecycleContext.Provider value={state}>{children}</AppLifecycleContext.Provider>;
}
