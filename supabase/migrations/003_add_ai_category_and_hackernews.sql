-- enum に ai カテゴリと hackernews ソースを追加（既存データへの影響なし）
ALTER TYPE trend_category ADD VALUE 'ai';
ALTER TYPE trend_source ADD VALUE 'hackernews';
