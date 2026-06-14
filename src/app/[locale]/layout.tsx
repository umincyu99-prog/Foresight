import type { Metadata } from "next";
import { isValidLocale, getMessages } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import CategoryNav from "@/components/CategoryNav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isValidLocale(locale) ? locale : "ja";
  const t = getMessages(l);
  return {
    title: t.site.title,
    description: t.site.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isValidLocale(locale) ? locale : "ja";
  const t = getMessages(l);

  return (
    <html lang={l}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href={`/${l}`} className="text-xl font-bold tracking-tight">
              {t.site.title}
            </a>
            <LocaleSwitcher currentLocale={l} />
          </div>
          <div className="max-w-5xl mx-auto px-4 pb-2">
            <CategoryNav locale={l} t={t.nav} />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-gray-200 mt-12 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {t.site.title}
        </footer>
      </body>
    </html>
  );
}
