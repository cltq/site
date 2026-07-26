"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];
const STORAGE_KEY = "utm_params";

function readUtmFromUrl(): URLSearchParams {
  const params = new URLSearchParams(window.location.search);
  const utm = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utm.set(key, val);
  }
  return utm;
}

function injectUtm(utm: URLSearchParams) {
  if (utm.toString() === "") return;
  const url = new URL(window.location.href);
  for (const [key, val] of utm) {
    url.searchParams.set(key, val);
  }
  history.replaceState(history.state, "", url.toString());
}

export default function UtmTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const urlUtm = readUtmFromUrl();

    if (urlUtm.toString() !== "") {
      sessionStorage.setItem(STORAGE_KEY, urlUtm.toString());
      return;
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      injectUtm(new URLSearchParams(stored));
    }
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) injectUtm(new URLSearchParams(stored));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
