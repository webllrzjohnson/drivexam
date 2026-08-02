"use client";

import { useEffect } from "react";

export function SkipLink() {
  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
  }, []);

  function focusMain(event: React.MouseEvent<HTMLAnchorElement>) {
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;
    event.preventDefault();
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
    history.replaceState(null, "", `#${main.id}`);
    main.focus();
  }

  return (
    <a
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-3 font-semibold text-green-900 shadow-lg ring-2 ring-green-800 transition-transform focus:translate-y-0"
      href="#main-content"
      onClick={focusMain}
    >
      Skip to main content
    </a>
  );
}
