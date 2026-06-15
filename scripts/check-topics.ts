import { config } from "dotenv";
config({ path: ".env.local" });

const QUERY = `
  query {
    posts(first: 20, order: VOTES) {
      edges {
        node {
          name
          topics { edges { node { name } } }
        }
      }
    }
  }
`;

async function main() {
  const tokenRes = await fetch("https://api.producthunt.com/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PRODUCTHUNT_CLIENT_ID,
      client_secret: process.env.PRODUCTHUNT_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  const { access_token } = await tokenRes.json();

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY }),
  });

  const { data } = await res.json();
  for (const { node } of data.posts.edges) {
    const topics = node.topics.edges.map((e: { node: { name: string } }) => e.node.name);
    console.log(`[${topics.join(", ")}] ${node.name}`);
  }
}

main().catch(console.error);
