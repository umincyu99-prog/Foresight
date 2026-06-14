"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";

type NavKeys = "all" | "gadget" | "gaming" | "tech";

function CategoryNavInner({
  locale,
  t,
}: {
  locale: string;
  t: Record<NavKeys, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  const categories: NavKeys[] = ["all", "gadget", "gaming", "tech"];

  function navigate(cat: NavKeys) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => navigate(cat)}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t[cat]}
        </button>
      ))}
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
      <CategoryNavInner locale={locale} t={t} />
    </Suspense>
  );
}
