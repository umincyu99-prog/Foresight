"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    const newPath = pathname.replace(/^\/(ja|en)/, `/${next}`);
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-0.5 bg-black/10 dark:bg-white/10 rounded-lg p-0.5">
      {(["ja", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            l === currentLocale
              ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          }`}
        >
          {l === "ja" ? "日本語" : "EN"}
        </button>
      ))}
    </div>
  );
}
