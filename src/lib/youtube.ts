import type { Trend } from "@/types/trend";

// YouTube カテゴリ ID → サイトカテゴリのマッピング
const YT_CATEGORIES: Array<{ id: string; category: Trend["category"] }> = [
  { id: "20", category: "gaming" },       // Gaming
  { id: "23", category: "entertainment" }, // Comedy
  { id: "24", category: "entertainment" }, // Entertainment
  { id: "28", category: "tech" },          // Science & Technology
];

// tech カテゴリ内でもエンタメ系と判定するキーワード
const ENTERTAINMENT_SIGNALS = [
  "reaction", "react", "moments", "funny", "meme", "viral", "challenge",
  "prank", "compilation", "fails", "hilarious", "wtf", "best of", "😂", "🤣",
  "try not to laugh", "shocking", "unexpected", "you won't believe",
];

const GADGET_KEYWORDS = [
  "unboxing", "review", "gadget", "drone", "camera", "smartphone", "iphone",
  "android", "laptop", "tablet", "headphone", "earphone", "earbuds", "airpods",
  "keyboard", "mouse", "smartwatch", "wearable", "raspberry", "arduino",
  "3d print", "robot", "vr headset", "ar headset", "monitor", "gpu", "cpu",
  "ssd", "nvme", "graphics card", "setup", "pc build",
];

// entertainment 内でもゲーム実況・テック系は本来カテゴリへ戻す
const GAMING_KEYWORDS = [
  "gameplay", "let's play", "lets play", "gaming", "playthrough",
  "speedrun", "minecraft", "fortnite", "roblox", "among us",
];
const TECH_KEYWORDS = [
  "tutorial", "programming", "coding", "software", "app", "ai ", "machine learning",
  "data science", "cybersecurity", "hack", "linux", "python", "javascript",
];

// tech カテゴリ内で AI 関連と判定するキーワード
const AI_KEYWORDS = [
  "ai ", " ai", "artificial intelligence", "chatgpt", "openai", "gpt-",
  "machine learning", "llm", "claude", "gemini", "midjourney", "stable diffusion",
  "neural network", "deep learning", "anthropic", "copilot", "generative ai",
];

function classify(
  title: string,
  description: string,
  base: Trend["category"]
): Trend["category"] {
  const text = (title + " " + description).toLowerCase();

  if (base === "tech") {
    if (AI_KEYWORDS.some((kw) => text.includes(kw))) return "ai";
    if (GADGET_KEYWORDS.some((kw) => text.includes(kw))) return "gadget";
    if (ENTERTAINMENT_SIGNALS.some((kw) => text.includes(kw))) return "entertainment";
  }
  if (base === "entertainment") {
    if (GAMING_KEYWORDS.some((kw) => text.includes(kw))) return "gaming";
    if (AI_KEYWORDS.some((kw) => text.includes(kw))) return "ai";
    if (TECH_KEYWORDS.some((kw) => text.includes(kw))) return "tech";
  }
  return base;
}

export async function fetchYouTubeTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const seen = new Set<string>();
  const results: Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[] = [];
  const REGIONS = ["US", "GB", "JP"];

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
        const category = classify(title, description, baseCategory);

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
