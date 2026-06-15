import type { Trend } from "@/types/trend";
import type { Locale } from "@/lib/i18n";
import { searchRakutenItems, extractKeyword } from "@/lib/rakuten";

/* ===== ソース設定 ===== */
const SOURCE_CONFIG: Record<Trend["source"], { label: string; color: string; icon: string }> = {
  youtube: {
    label: "YouTube",
    color: "#ef4444",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  producthunt: {
    label: "Product Hunt",
    color: "#f97316",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13.604 8.4h-3.405V12h3.405c.991 0 1.795-.806 1.795-1.8 0-.994-.804-1.8-1.795-1.8zM12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12zm1.604 14.4h-3.405V18H7.8V6h5.804c2.319 0 4.195 1.878 4.195 4.2 0 2.321-1.876 4.2-4.195 4.2z"/></svg>`,
  },
  reddit: {
    label: "Reddit",
    color: "#f97316",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
  },
  hackernews: {
    label: "Hacker News",
    color: "#ff6600",
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm12.5 6.5h2.3l-3.1 6.1V18h-2v-5.4L6.6 6.5h2.3l2.05 4.1 2.05-4.1z"/></svg>`,
  },
};

/* ===== カテゴリ設定 ===== */
const CATEGORY_CONFIG: Record<Trend["category"], { ja: string; en: string; color: string; bg: string }> = {
  gadget: {
    ja: "ガジェット", en: "Gadget",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.12)",
  },
  gaming: {
    ja: "ゲーム", en: "Gaming",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
  },
  tech: {
    ja: "テクノロジー", en: "Tech",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
  },
  entertainment: {
    ja: "エンタメ", en: "Entertainment",
    color: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.12)",
  },
  ai: {
    ja: "AI", en: "AI",
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.12)",
  },
};

function formatScore(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default async function TrendCard({ trend, locale }: { trend: Trend; locale: Locale }) {
  const title   = locale === "ja" && trend.title_ja   ? trend.title_ja   : trend.title_en;
  const summary = locale === "ja" && trend.summary_ja ? trend.summary_ja : trend.summary_en;
  const source  = SOURCE_CONFIG[trend.source];
  const cat     = CATEGORY_CONFIG[trend.category];
  const date    = new Date(trend.published_at).toLocaleDateString(
    locale === "ja" ? "ja-JP" : "en-US",
    { month: "short", day: "numeric" }
  );

  const keyword = extractKeyword(trend.title_ja, trend.title_en);
  const items   = locale === "ja" ? await searchRakutenItems(keyword, 1) : [];
  const product = items[0];

  return (
    <div className="card-base rounded-2xl overflow-hidden flex flex-col group animate-fade-in">
      
        href={trend.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* サムネイル */}
        {trend.thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={trend.thumbnail}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* ソースバッジ（画像上） */}
            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold backdrop-blur-sm"
              style={{ background: source.color + "cc" }}
            >
              <span dangerouslySetInnerHTML={{ __html: source.icon }} />
              {source.label}
            </div>
          </div>
        ) : (
          /* サムネなし: グラデーションプレースホルダー */
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}08)` }}
          >
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ background: source.color + "cc" }}
            >
              <span dangerouslySetInnerHTML={{ __html: source.icon }} />
              {source.label}
            </span>
          </div>
        )}
      </a>

      {/* コンテンツ */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* カテゴリバッジ */}
        <span
          className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
          style={{ color: cat.color, background: cat.bg }}
        >
          {cat[locale]}
        </span>

        {/* タイトル */}
        
          href={trend.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2
            className="font-semibold text-sm leading-snug line-clamp-2 transition-colors"
            style={{ color: "var(--text)" }}
          >
            <span className="group-hover:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors">
              {title}
            </span>
          </h2>
        </a>

        {/* 概要 */}
        {summary && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {summary}
          </p>
        )}

        {/* フッター */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t" style={{ borderColor: "var(--border)" }}>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{date}</span>
          <span
            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: source.color, background: source.color + "18" }}
          >
            ▲ {formatScore(trend.score)}
          </span>
        </div>

        {/* 関連商品（楽天アフィリエイト） */}
        {product && (
          
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 mt-1 p-2 rounded-xl border transition-colors hover:border-indigo-400/50"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] leading-tight line-clamp-2" style={{ color: "var(--text)" }}>
                {product.itemName}
              </p>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: "#bf0000" }}>
                ¥{product.itemPrice.toLocaleString()}
              </p>
            </div>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ color: "#bf0000", background: "#bf000018" }}
            >
              楽天
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
