export type TrendSource = "reddit" | "youtube" | "producthunt";
export type TrendCategory = "gadget" | "gaming" | "tech" | "entertainment";

export interface Trend {
  id: string;
  source: TrendSource;
  source_id: string;
  category: TrendCategory;
  title_en: string;
  title_ja: string | null;
  summary_en: string | null;
  summary_ja: string | null;
  url: string;
  thumbnail: string | null;
  score: number;
  published_at: string;
  fetched_at: string;
}
