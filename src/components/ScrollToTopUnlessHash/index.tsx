"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the top on load and on route changes when the URL has no hash,
 * so refreshes do not restore a mid-page position. Skips when a fragment is
 * present so anchored links keep their target.
 */
export function ScrollToTopUnlessHash() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
