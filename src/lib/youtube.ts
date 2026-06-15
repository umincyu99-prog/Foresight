import type { Trend } from "@/types/trend";

// YouTube カテゴリ ID → サイトカテゴリのマッピング
const YT_CATEGORIES: Array<{ id: string; category: Trend["category"] }> = [
  { id: "20", category: "gaming" }, // Gaming
  { id: "28", category: "tech" },   // Science & Technology
];

// タイトル・説明文からガジェット系か判定するキーワード
const GADGET_KEYWORDS = [
  "unboxing", "review", "gadget", "drone", "camera", "smartphone", "iphone",
  "android", "laptop", "tablet", "headphone", "earphone", "earbuds", "airpods",
  "keyboard", "mouse", "smartwatch", "wearable", "raspberry", "arduino",
  "3d print", "robot", "vr headset", "ar headset", "monitor", "gpu", "cpu",
  "ssd", "nvme", "graphics card", "setup", "pc build",
];

function detectGadget(title: string, description: string): boolean {
  const text = (title + " " + description).toLowerCase();
  return GADGET_KEYWORDS.some((kw) => text.includes(kw));
}

export async function fetchYouTubeTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const seen = new Set<string>();
  const results: Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[] = [];
  const REGIONS = ["US", "GB"];

  for (const { id: categoryId, category: baseCategory } of YT_CATEGORIES) {
    for (const region of REGIONS) {
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("part", "snippet,statistics");
      url.searchParams.set("chart", "mostPopular");
      url.searchParams.set("regionCode", region);
      url.searchParams.set("videoCategoryId", categoryId);
      url.searchParams.set("maxResults", "10");
      url.searchParams.set("key", key);

      const res = await fetch(url.toString());
      const data = await res.json();

      for (const item of data.items ?? []) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);

        const snippet = item.snippet;
        const title = snippet.title as string;
        const description = (snippet.description ?? "") as string;

        // tech カテゴリ内でもガジェット系キーワードがあれば gadget に昇格
        const category: Trend["category"] =
          baseCategory === "tech" && detectGadget(title, description)
            ? "gadget"
            : baseCategory;

        results.push({
          source: "youtube",
          source_id: item.id,
          category,
          title_en: title,
          summary_en: description.slice(0, 500) || null,
          url: `https://www.youtube.com/watch?v=${item.id}`,
          thumbnail: snippet.thumbnails?.medium?.url ?? null,
          score: parseInt(item.statistics?.viewCount ?? "0", 10),
          published_at: snippet.publishedAt,
        });
      }
    }
  }

  return results;
}
