import type { Trend } from "@/types/trend";

// AI 関連トレンドを拾うための検索クエリ群
const AI_QUERIES = ["AI", "LLM", "ChatGPT", "OpenAI", "Anthropic", "machine learning"];

interface AlgoliaHit {
  objectID: string;
  title: string;
  url: string | null;
  points: number;
  created_at: string;
  story_text?: string | null;
}

/**
 * Hacker News (Algolia Search API) から直近24時間の人気記事を取得し、
 * AI カテゴリのトレンドとして返す。
 * タイトル・リンク・スコアのみを利用し、本文の転載は行わない。
 */
export async function fetchHackerNewsTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const seen = new Set<string>();
  const results: Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[] = [];

  const since = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  for (const query of AI_QUERIES) {
    const url = new URL("https://hn.algolia.com/api/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("tags", "story");
    url.searchParams.set("numericFilters", `created_at_i>${since},points>20`);
    url.searchParams.set("hitsPerPage", "10");

    let data: { hits?: AlgoliaHit[] };
    try {
      const res = await fetch(url.toString());
      data = await res.json();
    } catch {
      continue;
    }

    for (const hit of data.hits ?? []) {
      if (seen.has(hit.objectID)) continue;
      if (!hit.url) continue; // Ask HN / 自己投稿テキストのみの記事は除外
      seen.add(hit.objectID);

      results.push({
        source: "hackernews",
        source_id: hit.objectID,
        category: "ai",
        title_en: hit.title,
        summary_en: null,
        url: hit.url,
        thumbnail: null,
        score: hit.points,
        published_at: hit.created_at,
      });
    }
  }

  return results;
}
