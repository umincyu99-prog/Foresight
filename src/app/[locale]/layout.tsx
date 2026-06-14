import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { isValidLocale, getMessages } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import CategoryNav from "@/components/CategoryNav";
import ThemeToggle from "@/components/ThemeToggle";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isValidLocale(locale) ? locale : "ja";
  const t = getMessages(l);
  return {
    title: { default: t.site.title, template: `%s | ${t.site.title}` },
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
    <html lang={l} className={inter.variable} suppressHydrationWarning>
      {/* ダークモード初期化スクリプト — ちらつき防止 */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme');
            const dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (dark) document.documentElement.classList.add('dark');
          } catch(e) {}
        `}} />
      </head>
      <body className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {/* ヘッダー */}
        <header className="glass border-b sticky top-0 z-20" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* ロゴ */}
              <a href={`/${l}`} className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/25">
                  F
                </div>
                <span className="font-bold text-base tracking-tight gradient-text">
                  {t.site.title}
                </span>
              </a>

              {/* 右側コントロール */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LocaleSwitcher currentLocale={l} />
              </div>
            </div>

            {/* カテゴリナビ */}
            <div className="pb-2">
              <CategoryNav locale={l} t={t.nav} />
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t mt-16 py-8" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
              <span className="text-sm font-semibold gradient-text">{t.site.title}</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} {t.site.title}. Powered by YouTube & Product Hunt.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
