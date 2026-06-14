// .env.local を読み込んで fetch-and-store を直接実行するテストスクリプト
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

// TypeScript をそのまま実行するため tsx 経由で呼ぶ
// → このスクリプトはラッパーとして tsx に渡すだけ
