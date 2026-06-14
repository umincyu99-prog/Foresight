import type { Trend } from "@/types/trend";

const SUBREDDITS: Array<{ name: string; category: Trend["category"] }> = [
  { name: "gadgets", category: "gadget" },
  { name: "gaming", category: "gaming" },
  { name: "technology", category: "tech" },
];

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": process.env.REDDIT_USER_AGENT!,
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function fetchRedditTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const token = await getAccessToken();
  const results: Omit<
    Trend,
    "id" | "title_ja" | "summary_ja" | "fetched_at"
  >[] = [];

  for (const { name, category } of SUBREDDITS) {
    const res = await fetch(
      `https://oauth.reddit.com/r/${name}/hot?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": process.env.REDDIT_USER_AGENT!,
        },
      }
    );

    const data = await res.json();
    const posts = data?.data?.children ?? [];

    for (const { data: post } of posts) {
      if (post.is_self && !post.selftext) continue;

      results.push({
        source: "reddit",
        source_id: post.id,
        category,
        title_en: post.title,
        summary_en: post.selftext?.slice(0, 500) || null,
        url: `https://www.reddit.com${post.permalink}`,
        thumbnail:
          post.thumbnail && post.thumbnail.startsWith("http")
            ? post.thumbnail
            : null,
        score: post.score,
        published_at: new Date(post.created_utc * 1000).toISOString(),
      });
    }
  }

  return results;
}
