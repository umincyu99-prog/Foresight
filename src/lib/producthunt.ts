import type { Trend } from "@/types/trend";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://api.producthunt.com/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PRODUCTHUNT_CLIENT_ID,
      client_secret: process.env.PRODUCTHUNT_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

const QUERY = `
  query {
    posts(first: 20, order: VOTES) {
      edges {
        node {
          id
          name
          tagline
          description
          url
          votesCount
          createdAt
          thumbnail { url }
          topics { edges { node { name } } }
        }
      }
    }
  }
`;

export async function fetchProductHuntTrends(): Promise<
  Omit<Trend, "id" | "title_ja" | "summary_ja" | "fetched_at">[]
> {
  const clientId = process.env.PRODUCTHUNT_CLIENT_ID;
  const clientSecret = process.env.PRODUCTHUNT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const token = await getAccessToken();
  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
  });

  const { data } = await res.json();
  const posts = data?.posts?.edges ?? [];

  return posts.map(({ node }: { node: Record<string, unknown> }) => {
    const topics = (
      (node.topics as { edges: { node: { name: string } }[] })?.edges ?? []
    ).map((e) => e.node.name.toLowerCase());

    const category: Trend["category"] = topics.includes("gaming")
      ? "gaming"
      : topics.some((t) => ["gadgets", "hardware"].includes(t))
      ? "gadget"
      : "tech";

    return {
      source: "producthunt" as const,
      source_id: String(node.id),
      category,
      title_en: String(node.name),
      summary_en:
        String(node.description || node.tagline || "").slice(0, 500) || null,
      url: String(node.url),
      thumbnail: (node.thumbnail as { url: string } | null)?.url ?? null,
      score: Number(node.votesCount),
      published_at: String(node.createdAt),
    };
  });
}
