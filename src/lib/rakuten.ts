export interface RakutenItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string;
  imageUrl: string | null;
  shopName: string;
}

const ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601";

/**
 * キーワードで楽天市場の商品を検索し、アフィリエイトリンク付きの商品情報を返す。
 * APIキー未設定時やエラー時は空配列を返す（サイト表示には影響させない）。
 */
export async function searchRakutenItems(
  keyword: string,
  hits = 4
): Promise<RakutenItem[]> {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  console.log("[Rakuten] called", {
    keyword,
    hasAppId: !!appId,
    hasAccessKey: !!accessKey,
    hasAffiliateId: !!affiliateId,
  });

  if (!appId || !accessKey || !keyword.trim()) {
    console.log("[Rakuten] early return - missing config or keyword");
    return [];
  }

  const params = new URLSearchParams({
    applicationId: appId,
    accessKey,
    keyword,
    hits: String(hits),
    sort: "standard",
    imageFlag: "1",
    availability: "1",
    formatVersion: "2",
  });

  if (affiliateId) params.set("affiliateId", affiliateId);
  params.set("referer", "https://foresight-lake-psi.vercel.app");

  try {
    const refererValue = "https://foresight-lake-psi.vercel.app/";
    console.log("[Rakuten] sending Referer+Origin headers");
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: {
        "Referer": refererValue,
        "Origin": "https://foresight-lake-psi.vercel.app",
      },
      next: { revalidate: 0 },
    });
    console.log("[Rakuten] response status:", res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log("[Rakuten] error body:", text.slice(0, 500));
      return [];
    }

    const data = await res.json();
    const items = data?.Items as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const mediumImageUrls = item.mediumImageUrls as
        | Array<{ imageUrl: string } | string>
        | undefined;
      const firstImage = mediumImageUrls?.[0];
      const imageUrl =
        typeof firstImage === "string"
          ? firstImage
          : firstImage?.imageUrl ?? null;

      return {
        itemName: String(item.itemName ?? ""),
        itemPrice: Number(item.itemPrice ?? 0),
        itemUrl: String(item.itemUrl ?? ""),
        affiliateUrl: String(item.affiliateUrl ?? item.itemUrl ?? ""),
        imageUrl,
        shopName: String(item.shopName ?? ""),
      };
    });
  } catch {
    return [];
  }
}

/**
 * トレンドのタイトルから楽天検索向けのキーワードを抽出する簡易ロジック。
 * 英語タイトルから主要な名詞っぽい単語を拾い、日本語タイトルがあれば優先利用。
 */
export function extractKeyword(titleJa: string | null, titleEn: string): string {
  const source = titleJa || titleEn;

  // よくあるストップワード・記号を除去
  const cleaned = source
    .replace(/[!?！？「」『』【】()（）\[\]"'.,、。:：;；\-_/\\]/g, " ")
    .trim();

  const words = cleaned.split(/\s+/).filter((w) => w.length >= 2);
  // 最初の2語程度を検索キーワードとして利用
  return words.slice(0, 2).join(" ").slice(0, 40);
}
