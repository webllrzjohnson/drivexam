"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/practice", label: "Practice" },
  { href: "/road-signs", label: "Road signs" },
  { href: "/road-test", label: "Road test" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
const practiceRelatedPaths = ["/g1-mock-exam", "/mistake-review", "/offline-practice"];

export function SiteNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Primary navigation"}
      className={mobile ? "grid border-t px-4 py-2 text-sm text-slate-700" : "hidden items-center gap-6 text-sm text-slate-600 md:flex"}
    >
      {navigationItems.map((item) => {
        const isCurrent = pathname === item.href
          || pathname.startsWith(`${item.href}/`)
          || (item.href === "/practice" && practiceRelatedPaths.some((relatedPath) => pathname === relatedPath || pathname.startsWith(`${relatedPath}/`)));
        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={mobile ? "rounded-md px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700" : undefined}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
