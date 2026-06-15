import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data } = await supabase
    .from("trends")
    .select("source, category, title_en")
    .order("fetched_at", { ascending: false })
    .limit(50);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const key = `${row.source}/${row.category}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  console.log("\nカテゴリ別集計:");
  for (const [key, n] of Object.entries(counts).sort()) {
    console.log(`  ${key}: ${n}件`);
  }

  console.log("\n各カテゴリのサンプル:");
  for (const cat of ["gadget", "gaming", "tech", "entertainment"]) {
    const samples = (data ?? []).filter((r) => r.category === cat).slice(0, 2);
    if (samples.length) {
      console.log(`\n[${cat}]`);
      samples.forEach((r) => console.log(`  - [${r.source}] ${r.title_en}`));
    }
  }
}

main().catch(console.error);
