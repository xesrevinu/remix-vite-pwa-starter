import { getAppLifecycleHook, type UserChoice } from "@/components/app-life-cycle/life-cycle";
import { useAppInstallPrompt, useAppInstallPromptType } from "@/components/app-life-cycle/provider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils";
import * as BrowserDetect from "@/utils/browser";
import { LucideArrowDownCircle, LucidePlusSquare, LucideShare } from "lucide-react";
import { type ReactNode } from "react";

type Instructions = Record<"macOS" | "iOS" | "android" | "linux" | "windows", Array<InstructionStep>>;

type InstructionStep = {
  index: string;
  step: ReactNode;
};

function Code({ className, children }: { className?: string; children?: ReactNode }) {
  return <code className={cn("bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5", className)}>{children}</code>;
}

const instructions = {
  android: [{ index: "1️⃣", step: "Open this page in Chrome" }],
  windows: [{ index: "1️⃣", step: "Open this page in Edge" }],
  linux: [{ index: "1️⃣", step: "Open this page in Chromium or Chrome" }],
  iOS: [
    { index: "1️⃣", step: "Open this page in Safari" },
    {
      index: "2️⃣",
      step: (
        <>
          Click the Share button
          <LucideShare className="h-5 w-5" />
          in the Safari toolbar, then choose
          <Code className="inline-flex items-center">
            <LucidePlusSquare className="mr-2 h-5 w-5" />
            Add to home screen
          </Code>
        </>
      ),
    },
    {
      index: "3️⃣",
      step: "Type the name that you want to use for the web app, then click Add.",
    },
  ],
  macOS: [
    { index: "1️⃣", step: "Open this page in Safari" },
    {
      index: "2️⃣",
      step: (
        <>
          From the menu bar, choose
          <Code>File &gt; Add to Dock</Code>
          . Or click the Share button
          <LucideShare className="h-5 w-5" />
          in the Safari toolbar, then choose
          <Code>Add to Dock</Code>
        </>
      ),
    },
    {
      index: "3️⃣",
      step: (
        <>
          Type the name that you want to use for the web app, then click <Code>Add</Code>.
        </>
      ),
    },
  ],
} satisfies Instructions;

function getInstructions() {
  if (BrowserDetect.isMacOS()) {
    return instructions.macOS;
  }

  if (BrowserDetect.isiOS()) {
    return instructions.iOS;
  }

  if (BrowserDetect.isAndroid()) {
    return instructions.android;
  }

  if (BrowserDetect.isLinux()) {
    return instructions.linux;
  }

  if (BrowserDetect.isWindows()) {
    return instructions.windows;
  }

  return [];
}

function InstallAppButtonPopover({ animate = false }: { animate?: boolean }) {
  const osInstructions = getInstructions() || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="truncate" size="sm">
          <LucideArrowDownCircle className={cn("mr-2 h-4 w-4", animate && "animate-bounce")} />
          Install App
        </Button>
      </PopoverTrigger>
      <PopoverContent className="" side="bottom">
        <div className="flex flex-col gap-2">
          <span>To install this app on your device, follow the instructions below.</span>
          <div className="flex flex-col gap-2">
            {osInstructions.map(({ index, step }) => (
              <span key={index} className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                {index} {step}
              </span>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function InstallAppButton({ animate = false }: { animate?: boolean }) {
  const installPromptType = useAppInstallPromptType();
  const promptHandle = useAppInstallPrompt();

  if (installPromptType === "popover" || BrowserDetect.isArcBrowser()) {
    return <InstallAppButtonPopover animate={animate} />;
  }

  if (installPromptType === "native") {
    return (
      <Button variant="outline" className="truncate" size="sm" onClick={() => promptHandle()}>
        <LucideArrowDownCircle className={cn("mr-2 h-4 w-4", animate && "animate-bounce")} />
        Install App
      </Button>
    );
  }

  if (process.env.NODE_ENV === "development") {
    throw new Error("Invalid install prompt type");
  }

  return null;
}

export function InstallAppPrompt({ animate = false }: { animate?: boolean }) {
  return (
    <div className="pwa-hidden border border-border rounded p-2 flex items-center justify-between">
      <div className="space-y-1 mr-6">
        <p>You can install this app!</p>
        <p className="text-primary">Bene fit from a better experience!</p>
      </div>
      <InstallAppButton animate={animate} />
    </div>
  );
}

/**
 * This interface is experimental.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/BeforeInstallPromptEvent
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<UserChoice>;
}

export function install() {
  const appLifecycleHook = getAppLifecycleHook();

  function saveInstallPrompt(event: Event) {
    event.preventDefault();

    appLifecycleHook.state.installPromptType = "native";
    appLifecycleHook.state.installPrompt = (event as BeforeInstallPromptEvent).prompt.bind(event);

    appLifecycleHook.onInstallPromptAvailable("native", appLifecycleHook.state.installPrompt);
  }

  window.addEventListener("beforeinstallprompt", saveInstallPrompt);
}
