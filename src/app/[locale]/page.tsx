import { getTrends } from "@/lib/supabase";
import { isValidLocale, getMessages } from "@/lib/i18n";
import TrendCard from "@/components/TrendCard";
import type { Trend } from "@/types/trend";

export const revalidate = 3600; // 1時間キャッシュ

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const l = isValidLocale(locale) ? locale : "ja";
  const t = getMessages(l);

  const validCategory =
    category === "gadget" || category === "gaming" || category === "tech"
      ? (category as Trend["category"])
      : undefined;

  const trends = await getTrends(validCategory, 24);

  return (
    <>
      {trends.length === 0 ? (
        <p className="text-center text-gray-400 py-20">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} locale={l} />
          ))}
        </div>
      )}
    </>
  );
}
