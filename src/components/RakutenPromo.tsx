import type { RakutenItem } from "@/lib/rakuten";
import type { Locale } from "@/lib/i18n";

export default function RakutenPromo({
  items,
  locale,
  heading,
  badge,
}: {
  items: RakutenItem[];
  locale: Locale;
  heading: string;
  badge: string;
}) {
  if (locale !== "ja" || items.length === 0) return null;

  return (
    <section className="mb-3">
      <h2
        className="text-[10px] font-bold mb-1.5 flex items-center gap-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        {heading}
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: "#bf0000", background: "#bf000018" }}
        >
          {badge}
        </span>
      </h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 flex-shrink-0 w-44 p-2 rounded-xl border transition-colors hover:border-indigo-400/50"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex-shrink-0"
                style={{ background: "var(--bg)" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px] leading-snug line-clamp-2"
                style={{ color: "var(--text)" }}
              >
                {item.itemName}
              </p>
              <p className="text-[11px] font-bold mt-1" style={{ color: "#bf0000" }}>
                ¥{item.itemPrice.toLocaleString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
