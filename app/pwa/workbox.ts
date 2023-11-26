import type { Workbox } from "workbox-window";
import { getAppLifecycleHook } from "@/components/app-life-cycle/life-cycle";

let wb: Workbox | undefined;
const filename = "/sw.js";
const scope = "/";
const type = "classic";
const immediate = true;

let registerPromise: Promise<void> = Promise.resolve();
let sendSkipWaitingMessage: () => Promise<void> | undefined;

// check for updates every hour
const intervalMS = 60 * 60 * 1000;

const appLifecycleHook = getAppLifecycleHook();

const updateServiceWorker = async () => {
  await registerPromise;

  await sendSkipWaitingMessage?.();
};

const onRegisteredSW = (_filename: string, r: ServiceWorkerRegistration) => {
  if (!r) {
    return;
  }

  appLifecycleHook.reload = () => {
    appLifecycleHook.state.updateAvailable = false;
    appLifecycleHook.onUpdateAvailable(false);
    return updateServiceWorker();
  };

  setInterval(async () => {
    if (!(!r.installing && navigator)) {
      return;
    }

    if ("connection" in navigator && !navigator.onLine) {
      return;
    }

    const resp = await fetch(filename, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) {
      await r.update();
    }
  }, intervalMS);
};

const onOfflineReady = () => {
  appLifecycleHook.state.offlineReady = true;
  appLifecycleHook.onOfflineReady(true);
};

const onNeedRefresh = () => {
  appLifecycleHook.state.updateAvailable = true;
  appLifecycleHook.onUpdateAvailable(true);
};

const onRegisterError = (e: Error) => {
  console.log("SW registration failed: ", e);
};

async function register() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const { Workbox } = await import("workbox-window");
  wb = new Workbox(filename, { scope, type });
  sendSkipWaitingMessage = async () => {
    // Send a message to the waiting service worker,
    // instructing it to activate.
    // Note: for this to work, you have to add a message
    // listener in your service worker. See below.
    await wb?.messageSkipWaiting();
  };

  let onNeedRefreshCalled = false;
  const showSkipWaitingPrompt = () => {
    onNeedRefreshCalled = true;
    // \`event.wasWaitingBeforeRegister\` will be false if this is
    // the first time the updated service worker is waiting.
    // When \`event.wasWaitingBeforeRegister\` is true, a previously
    // updated service worker is still waiting.
    // You may want to customize the UI prompt accordingly.

    // Assumes your app has some sort of prompt UI element
    // that a user can either accept or reject.
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb?.addEventListener("controlling", (event) => {
      if (event.isUpdate) {
        window.location.reload();
      }
    });

    onNeedRefresh?.();
  };
  wb.addEventListener("installed", (event) => {
    if (typeof event.isUpdate === "undefined") {
      if (typeof event.isExternal !== "undefined") {
        if (event.isExternal) {
          showSkipWaitingPrompt();
        } else {
          !onNeedRefreshCalled && onOfflineReady?.();
        }
      } else {
        if (event.isExternal) {
          window.location.reload();
        } else {
          !onNeedRefreshCalled && onOfflineReady?.();
        }
      }
    } else if (!event.isUpdate) {
      onOfflineReady?.();
    }
  });
  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener("waiting", () => showSkipWaitingPrompt());
  // @ts-expect-error event listener provided by workbox-window
  wb.addEventListener("externalwaiting", () => showSkipWaitingPrompt());

  // register the service worker
  wb.register({ immediate })
    .then((r) => {
      if (!r) {
        throw new Error("Service worker registration failed");
      }

      onRegisteredSW(filename, r);
    })
    .catch((e) => {
      onRegisterError?.(e);
    });
}

export function install() {
  registerPromise = register();
}
