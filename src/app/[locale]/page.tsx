import { getTrends } from "@/lib/supabase";
import { isValidLocale, getMessages } from "@/lib/i18n";
import { searchRakutenItems } from "@/lib/rakuten";
import TrendCard from "@/components/TrendCard";
import RakutenPromo from "@/components/RakutenPromo";
import type { Trend } from "@/types/trend";

export const revalidate = 0;

const PROMO_KEYWORDS: Record<string, string> = {
  gadget: "ガジェット 便利グッズ",
  gaming: "ゲーミング グッズ",
  tech: "PC 周辺機器",
  entertainment: "ホビー グッズ",
  ai: "AI ガジェット",
};

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale }   = await params;
  const { category } = await searchParams;
  const l = isValidLocale(locale) ? locale : "ja";
  const t = getMessages(l);

  const validCategory =
    category === "gadget" || category === "gaming" || category === "tech" || category === "entertainment" || category === "ai"
      ? (category as Trend["category"])
      : undefined;

  const trends = await getTrends(validCategory);
  const promoKeyword = PROMO_KEYWORDS[validCategory ?? "gadget"];

  // 1回のAPI呼び出しで最大12件取得し、先頭4件をプロモ・残り8件をカードに配分
  const rakutenItems = l === "ja" ? await searchRakutenItems(promoKeyword, 12) : [];
  const promoItems = rakutenItems.slice(0, 4);
  const cardProducts = rakutenItems.slice(4);

  if (trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-3xl">
          📡
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {t.empty}
        </p>
      </div>
    );
  }

  return (
    <>
      <RakutenPromo
        items={promoItems}
        locale={l}
        heading={t.rakuten.heading}
        badge={t.rakuten.badge}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {trends.map((trend, i) => (
          <div key={trend.id} style={{ animationDelay: `${i * 30}ms` }}>
            <TrendCard trend={trend} locale={l} product={cardProducts[i]} />
          </div>
        ))}
      </div>
    </>
  );
}
