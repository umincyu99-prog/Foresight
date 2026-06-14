import type { Trend } from "@/types/trend";
import type { Locale } from "@/lib/i18n";

const SOURCE_LABELS: Record<Trend["source"], string> = {
  reddit: "Reddit",
  youtube: "YouTube",
  producthunt: "Product Hunt",
};

const CATEGORY_COLORS: Record<Trend["category"], string> = {
  gadget: "bg-blue-100 text-blue-700",
  gaming: "bg-purple-100 text-purple-700",
  tech: "bg-green-100 text-green-700",
};

const CATEGORY_LABELS: Record<Trend["category"], Record<Locale, string>> = {
  gadget: { ja: "ガジェット", en: "Gadget" },
  gaming: { ja: "ゲーム", en: "Gaming" },
  tech: { ja: "テクノロジー", en: "Tech" },
};

export default function TrendCard({
  trend,
  locale,
}: {
  trend: Trend;
  locale: Locale;
}) {
  const title = locale === "ja" && trend.title_ja ? trend.title_ja : trend.title_en;
  const summary =
    locale === "ja" && trend.summary_ja
      ? trend.summary_ja
      : trend.summary_en;

  return (
    <a
      href={trend.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {trend.thumbnail && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={trend.thumbnail}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[trend.category]
            }`}
          >
            {CATEGORY_LABELS[trend.category][locale]}
          </span>
          <span className="text-xs text-gray-400">
            {SOURCE_LABELS[trend.source]}
          </span>
        </div>
        <h2 className="font-semibold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        {summary && (
          <p className="text-sm text-gray-500 line-clamp-2">{summary}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>
            {new Date(trend.published_at).toLocaleDateString(
              locale === "ja" ? "ja-JP" : "en-US"
            )}
          </span>
          <span>▲ {trend.score.toLocaleString()}</span>
        </div>
      </div>
    </a>
  );
}
