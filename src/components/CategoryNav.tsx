"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";

type NavKeys = "all" | "gadget" | "gaming" | "tech" | "entertainment";

const CATEGORY_COLORS: Record<NavKeys, string> = {
  all:           "#6366f1",
  gadget:        "#3b82f6",
  gaming:        "#a855f7",
  tech:          "#10b981",
  entertainment: "#f43f5e",
};

function CategoryNavInner({ t }: { t: Record<NavKeys, string> }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const active      = (searchParams.get("category") ?? "all") as NavKeys;

  function navigate(cat: NavKeys) {
    const params = new URLSearchParams(searchParams.toString());
    cat === "all" ? params.delete("category") : params.set("category", cat);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
      {(["all", "gadget", "gaming", "tech", "entertainment"] as NavKeys[]).map((cat) => {
        const isActive = active === cat;
        const color    = CATEGORY_COLORS[cat];
        return (
          <button
            key={cat}
            onClick={() => navigate(cat)}
            className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
            style={
              isActive
                ? { background: color + "22", color, border: `1px solid ${color}55` }
                : { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }
            }
          >
            {t[cat]}
          </button>
        );
      })}
    </nav>
  );
}

export default function CategoryNav({
  locale,
  t,
}: {
  locale: string;
  t: Record<NavKeys, string>;
}) {
  return (
    <Suspense>
      <CategoryNavInner t={t} />
    </Suspense>
  );
}
