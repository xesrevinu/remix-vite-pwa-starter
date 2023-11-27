import { lazy } from "react";

export const MainLayout = lazy(() => import("./main").then((_) => ({ default: _.MainLayout })));
