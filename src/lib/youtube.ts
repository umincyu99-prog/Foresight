import type { Trend } from "@/types/trend";

const REGIONS = ["US", "GB"];

export async function fetchYouTubeTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const seen = new Set<string>();
  const results: Omit<
    Trend,
    "id" | "title_ja" | "summary_ja" | "fetched_at"
  >[] = [];

  for (const region of REGIONS) {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,statistics");
    url.searchParams.set("chart", "mostPopular");
    url.searchParams.set("regionCode", region);
    url.searchParams.set("videoCategoryId", "28"); // Science & Technology
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    const data = await res.json();

    for (const item of data.items ?? []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);

      const snippet = item.snippet;
      results.push({
        source: "youtube",
        source_id: item.id,
        category: "tech",
        title_en: snippet.title,
        summary_en: snippet.description?.slice(0, 500) || null,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: snippet.thumbnails?.medium?.url ?? null,
        score: parseInt(item.statistics?.viewCount ?? "0", 10),
        published_at: snippet.publishedAt,
      });
    }
  }

  return results;
}
