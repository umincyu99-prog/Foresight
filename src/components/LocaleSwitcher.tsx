"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    const newPath = pathname.replace(/^\/(ja|en)/, `/${next}`);
    router.push(newPath);
  }

  return (
    <div className="flex gap-1 text-sm">
      {(["ja", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 rounded font-medium transition-colors ${
            l === currentLocale
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {l === "ja" ? "日本語" : "EN"}
        </button>
      ))}
    </div>
  );
}
