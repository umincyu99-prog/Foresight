import { createServiceClient } from "./supabase";
import { fetchRedditTrends } from "./reddit";
import { fetchYouTubeTrends } from "./youtube";
import { fetchProductHuntTrends } from "./producthunt";
import { translateBatch } from "./deepl";
import type { Trend } from "@/types/trend";

type TrendInput = Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">;

// 環境変数が揃っているソースだけ有効化。Reddit は後から追加可能。
function getEnabledSources() {
  const sources: Array<{
    name: string;
    fetch: () => Promise<TrendInput[]>;
  }> = [];

  if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
    sources.push({ name: "Reddit", fetch: fetchRedditTrends });
  }

  if (process.env.YOUTUBE_API_KEY) {
    sources.push({ name: "YouTube", fetch: fetchYouTubeTrends });
  }

  if (
    process.env.PRODUCTHUNT_CLIENT_ID &&
    process.env.PRODUCTHUNT_CLIENT_SECRET
  ) {
    sources.push({ name: "ProductHunt", fetch: fetchProductHuntTrends });
  }

  return sources;
}

async function withTranslation(
  items: TrendInput[]
): Promise<Omit<Trend, "id" | "fetched_at">[]> {
  const titles = items.map((i) => i.title_en);
  const summaries = items.map((i) => i.summary_en ?? "");

  const [titlesJa, summariesJa] = await Promise.all([
    translateBatch(titles),
    translateBatch(summaries),
  ]);

  return items.map((item, i) => ({
    ...item,
    title_ja: titlesJa[i] || null,
    summary_ja: summariesJa[i] || null,
  }));
}

export async function fetchAndStoreTrends(): Promise<{
  inserted: number;
  skipped: string[];
  errors: string[];
}> {
  const supabase = createServiceClient();
  const errors: string[] = [];
  const skipped: string[] = [];
  let inserted = 0;

  const allSources = ["Reddit", "YouTube", "ProductHunt"];
  const enabled = getEnabledSources();
  const enabledNames = enabled.map((s) => s.name);

  for (const name of allSources) {
    if (!enabledNames.includes(name)) {
      skipped.push(name);
      console.log(`[${name}] Skipped (API key not configured)`);
    }
  }

  for (const { name, fetch } of enabled) {
    try {
      console.log(`[${name}] Fetching...`);
      const raw = await fetch();

      if (raw.length === 0) {
        console.log(`[${name}] No items returned`);
        continue;
      }

      console.log(`[${name}] Translating ${raw.length} items...`);
      const translated = await withTranslation(raw);

      const { error } = await supabase
        .from("trends")
        .upsert(translated, { onConflict: "source,source_id" });

      if (error) {
        errors.push(`${name}: ${error.message}`);
        console.error(`[${name}] DB error:`, error.message);
      } else {
        inserted += translated.length;
        console.log(`[${name}] Saved ${translated.length} items`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${name}: ${msg}`);
      console.error(`[${name}] Error:`, msg);
    }
  }

  return { inserted, skipped, errors };
}
