import "@/pwa/install";

import { RemixBrowser } from "@remix-run/react";
import { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

const root = document.getElementById("root-layout");
const filterCommentNode = (nodes: NodeListOf<ChildNode>) => {
  return Array.from(nodes).filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      return false;
    }
    return true;
  });
};
const hasChildren = root ? filterCommentNode(root.childNodes).length > 0 : false;

if (hasChildren) {
  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />);
  });
} else {
  const root = createRoot(document as unknown as HTMLElement);

  root.render(<RemixBrowser />);
}
