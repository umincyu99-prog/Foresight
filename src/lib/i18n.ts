import ja from "@/i18n/ja.json";
import en from "@/i18n/en.json";

export type Locale = "ja" | "en";

const messages = { ja, en } as const;

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.ja;
}

export function isValidLocale(value: string): value is Locale {
  return value === "ja" || value === "en";
}
