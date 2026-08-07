"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.getElementById("main-scroll-container");
    if (main) {
      main.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
