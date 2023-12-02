import "@/pwa/install";

import { RemixBrowser } from "@remix-run/react";
import { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

// declare global this
declare global {
  interface Window {
    // eslint-disable-next-line no-var
    __remix_pwa_render_mode: "createRoot" | "hydrate";

    // eslint-disable-next-line no-var
    __remix_pwa_hydrate_data:
      | {
          meta: [];
          modulepreload: Array<{
            type: "script" | "modulepreload";
            href: string;
          }>;
          links: Array<{
            rel: string;
            href: string;
          }>;
          scripts: [];
          context: [];
          routeModules: [];
        }
      | undefined;
  }
}

const filterCommentNode = (nodes: NodeListOf<ChildNode>) => {
  return Array.from(nodes).filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      return false;
    }
    return true;
  });
};

const root = document.getElementById("root-layout");
const hasChildren = root ? filterCommentNode(root.childNodes).length > 0 : false;

if (hasChildren) {
  window.__remix_pwa_render_mode = "hydrate";

  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />);
  });
} else {
  let data = undefined;
  const textContent = document.getElementById("__remix_pwa_hydrate_data")?.textContent || "";

  try {
    data = JSON.parse(textContent || "{}");
    window.__remix_pwa_hydrate_data = data;
  } catch (e) {
    console.error(e);
  }

  window.__remix_pwa_render_mode = "createRoot";

  const root = createRoot(document as unknown as HTMLElement);
  root.render(<RemixBrowser />);
}
