import { NextResponse } from 'next/server';

const HTML = String.raw`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プライバシーポリシー - うちのポンコツAIちゃん</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Noto Sans JP", sans-serif; background: #f8f9fa; color: #212529; line-height: 1.8; padding: 24px 16px 64px; }
    .container { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px 32px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
    h1 { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    .updated { font-size: .85rem; color: #6c757d; margin-bottom: 32px; }
    p { margin-bottom: 1em; }
    h2 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin: 32px 0 12px; padding-left: 10px; border-left: 4px solid #4a90d9; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: .9rem; }
    th { background: #4a90d9; color: #fff; padding: 10px 12px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #dee2e6; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: #f8f9fa; }
    a { color: #4a90d9; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul { margin: 8px 0 12px 20px; }
    li { margin-bottom: 6px; }
    .contact { background: #f0f7ff; border-radius: 8px; padding: 16px 20px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>プライバシーポリシー</h1>
    <p class="updated">最終更新日：2026年7月2日</p>
    <p>ポンコツスタジオ（以下「当方」）は、アプリケーション「うちのポンコツAIちゃん」（以下「本アプリ」）における、ユーザーの個人情報及び利用データの取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。</p>
    <h2>1. 収集する情報</h2>
    <p>本アプリは、以下の情報を取得・利用します。</p>
    <table>
      <thead><tr><th>情報の種類</th><th>取得タイミング</th><th>利用目的</th></tr></thead>
      <tbody>
        <tr><td>カメラ・ギャラリー内の画像（レシート等）</td><td>ユーザーがレシートを撮影、またはギャラリーから画像を選択した時</td><td>食材情報を自動認識し、アプリ内に登録するため（画像はAI解析APIに送信されます）</td></tr>
        <tr><td>アプリ内で登録した食材データ・賞味期限・カテゴリ情報</td><td>ユーザーが情報を入力・登録した時</td><td>食材管理機能の提供のため（端末内のデータベースに保存されます）</td></tr>
        <tr><td>広告識別子（AdID）・端末情報</td><td>アプリ起動時、広告表示・視聴時</td><td>広告配信（バナー広告・リワード広告）のため</td></tr>
        <tr><td>利用回数・機能利用状況（AIレシピ提案の利用回数等）</td><td>アプリ利用時</td><td>1日あたりの利用回数制限機能の提供のため（端末内に保存）</td></tr>
      </tbody>
    </table>
    <h2>2. 外部サービスへのデータ送信について</h2>
    <p>本アプリは、以下の外部サービスを利用しており、機能提供のために必要な範囲でデータが送信されます。</p>
    <ul>
      <li><strong>Google Gemini API（Google LLC）</strong>：レシート画像を送信し、食材情報の自動認識（AI-OCR）およびレシピ提案に利用します。</li>
      <li><strong>Google AdMob（Google LLC）</strong>：広告の配信・最適化のため、広告識別子等の情報が送信されます。</li>
    </ul>
    <p>これらの外部サービスにおけるデータの取り扱いについては、各社のプライバシーポリシーをご確認ください。</p>
    <p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google プライバシーポリシー</a></p>
    <h2>3. データの保存場所</h2>
    <p>登録された食材データ等は、ユーザーの端末内（ローカルデータベース）にのみ保存され、当方のサーバーには保存されません。アプリをアンインストールした場合、これらのデータは削除されます。</p>
    <h2>4. 第三者提供について</h2>
    <p>当方は、法令に基づく場合を除き、取得した情報を本人の同意なく第三者に提供することはありません。ただし、上記「2. 外部サービスへのデータ送信について」に記載のサービス提供事業者への送信は、機能提供上必要な範囲で行われます。</p>
    <h2>5. 広告について</h2>
    <p>本アプリはGoogle AdMobによる広告配信を行っています。広告配信にあたり、広告識別子等の情報が利用される場合があります。広告のパーソナライズ設定は、端末のOS設定（Android：設定＞Google＞広告）から変更できます。</p>
    <h2>6. 未成年の利用について</h2>
    <p>本アプリは特定の年齢層を対象としたものではありませんが、13歳未満のお子様がご利用になる場合は、保護者の方の同意・管理のもとでご利用ください。</p>
    <h2>7. お問い合わせ先</h2>
    <div class="contact">
      <p><strong>ポンコツスタジオ</strong></p>
      <p>Eメール：<a href="mailto:umincyu99@gmail.com">umincyu99@gmail.com</a></p>
    </div>
    <h2>8. 本ポリシーの変更について</h2>
    <p>当方は、必要に応じて本ポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、本ページに掲載された時点から効力を生じるものとします。</p>
  </div>
</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}