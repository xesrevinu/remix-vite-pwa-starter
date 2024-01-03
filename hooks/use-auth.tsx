import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useRouteLoaderData } from "@remix-run/react";

// just for demo purpose
// The real verification should be when the interface returns the 401 status code, and then jump to the login page
// But here we simply judge whether signed=true is in the cookie

export function useSigned() {
  const { pathname, key } = useLocation();
  const loaderData = useRouteLoaderData("root") as {
    hasSigned: boolean;
  };

  const localState = useMemo(
    () => typeof document !== "undefined" && pathname && key && document.cookie.includes("signed=true"),
    [pathname, key],
  );

  return localState || loaderData.hasSigned || false;
}

export function useSetSigned() {
  const navigate = useNavigate();

  return useCallback(() => {
    document.cookie = "signed=true; path=/";
    navigate("/", { replace: true, state: { key: Math.random() } });
  }, [navigate]);
}

export function useClearSigned() {
  return useCallback(() => {
    document.cookie = "signed=false; path=/";
    // refresh the page
    // pwa refresh fast so it's ok
    window.location.href = "/";
  }, []);
}
