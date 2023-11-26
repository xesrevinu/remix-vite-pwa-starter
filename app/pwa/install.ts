import * as prompt from "@/components/app-life-cycle/install-prompt";
import * as lifeCycle from "@/components/app-life-cycle/life-cycle";

lifeCycle.install();

prompt.install();

if (!import.meta.env.SSR && import.meta.env.PROD) {
  import("./workbox").then((_) => _.install());
}
