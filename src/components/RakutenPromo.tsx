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
    <section className="mb-6">
      <h2
        className="text-xs font-bold mb-2 flex items-center gap-2"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="card-base rounded-xl overflow-hidden flex flex-col group"
          >
            {item.imageUrl && (
              <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-2 flex flex-col gap-1">
              <p className="text-[10px] leading-tight line-clamp-2" style={{ color: "var(--text)" }}>
                {item.itemName}
              </p>
              <p className="text-[11px] font-bold" style={{ color: "#bf0000" }}>
                ¥{item.itemPrice.toLocaleString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
