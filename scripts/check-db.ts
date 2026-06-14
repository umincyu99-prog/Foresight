import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from("trends")
    .select("source, category, title_ja, score")
    .order("score", { ascending: false })
    .limit(10);

  if (error) { console.error(error); process.exit(1); }

  console.log(`\n保存済みトレンド（スコア上位10件）\n`);
  for (const row of data ?? []) {
    console.log(`[${row.source}/${row.category}] ${row.title_ja}  (▲${row.score.toLocaleString()})`);
  }
}

main().catch(console.error);
