import { config } from "dotenv";
import { fetchAndStoreTrends } from "../src/lib/fetch-and-store";

config({ path: ".env.local" });

async function main() {
  console.log("=== トレンドデータ取得開始 ===\n");
  const result = await fetchAndStoreTrends();
  console.log("\n=== 完了 ===");
  console.log(`保存件数: ${result.inserted}`);
  if (result.skipped.length > 0) {
    console.log(`スキップ: ${result.skipped.join(", ")} (APIキー未設定)`);
  }
  if (result.errors.length > 0) {
    console.log(`エラー: ${result.errors.join(", ")}`);
  }
}

main().catch(console.error);
