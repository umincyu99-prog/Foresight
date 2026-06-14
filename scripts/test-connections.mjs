import { createClient } from "@supabase/supabase-js";
import * as deepl from "deepl-node";

// Load .env.local manually
import { readFileSync } from "fs";
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim();
  if (val) process.env[key] = val;
}

async function testSupabase() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { error } = await client.from("trends").select("id").limit(1);
  if (error) {
    // テーブル未作成の場合はエラーになるが接続自体は成功
    if (error.code === "42P01") {
      console.log("✓ Supabase 接続成功（trendsテーブルはまだ未作成）");
    } else {
      throw new Error(`Supabase エラー: ${error.message}`);
    }
  } else {
    console.log("✓ Supabase 接続成功（trendsテーブルあり）");
  }
}

async function testDeepL() {
  const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
  const usage = await translator.getUsage();
  const result = await translator.translateText("Hello, world!", "en", "ja");
  console.log(`✓ DeepL 接続成功`);
  console.log(`  翻訳テスト: "Hello, world!" → "${result.text}"`);
  console.log(
    `  使用量: ${usage.character.count} / ${usage.character.limit} 文字`
  );
}

async function main() {
  console.log("=== 接続テスト ===\n");
  try {
    await testSupabase();
  } catch (e) {
    console.error("✗ Supabase:", e.message);
  }
  try {
    await testDeepL();
  } catch (e) {
    console.error("✗ DeepL:", e.message);
  }
}

main();
