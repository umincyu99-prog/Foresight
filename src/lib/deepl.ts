import * as deepl from "deepl-node";

let _translator: deepl.Translator | null = null;

function getTranslator(): deepl.Translator {
  if (!_translator) {
    _translator = new deepl.Translator(process.env.DEEPL_API_KEY!);
  }
  return _translator;
}

export async function translateToJapanese(text: string): Promise<string> {
  if (!text.trim()) return "";
  const result = await getTranslator().translateText(text, "en", "ja");
  return result.text;
}

export async function translateBatch(
  texts: string[]
): Promise<string[]> {
  const nonEmpty = texts.filter((t) => t.trim());
  if (nonEmpty.length === 0) return texts.map(() => "");

  const results = await getTranslator().translateText(nonEmpty, "en", "ja");
  const translated = (Array.isArray(results) ? results : [results]).map(
    (r: deepl.TextResult) => r.text
  );

  let idx = 0;
  return texts.map((t) => (t.trim() ? translated[idx++] : ""));
}
