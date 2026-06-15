import { createClient } from "@supabase/supabase-js";
import type { Trend } from "@/types/trend";

// 遅延初期化 — モジュール読み込み時ではなく初回呼び出し時に生成
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getTrends(
  category?: Trend["category"]
): Promise<Trend[]> {
  const supabase = getSupabaseClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("trends")
    .select("*")
    .gte("fetched_at", since);

  if (category) {
    query = query.eq("category", category).order("fetched_at", { ascending: false });
  } else {
    query = query.order("score", { ascending: false }).order("fetched_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
