create extension if not exists "pgcrypto";

create type trend_source as enum ('reddit', 'youtube', 'producthunt');
create type trend_category as enum ('gadget', 'gaming', 'tech');

create table trends (
  id           uuid primary key default gen_random_uuid(),
  source       trend_source not null,
  source_id    text not null,
  category     trend_category not null,
  title_en     text not null,
  title_ja     text,
  summary_en   text,
  summary_ja   text,
  url          text not null,
  thumbnail    text,
  score        integer not null default 0,
  published_at timestamptz not null,
  fetched_at   timestamptz not null default now(),

  constraint trends_source_id_unique unique (source, source_id)
);

create index trends_category_score_idx on trends (category, score desc);
create index trends_fetched_at_idx on trends (fetched_at desc);

-- 公開読み取りを許可（anon key でフロントから取得できるように）
alter table trends enable row level security;

create policy "public read" on trends
  for select using (true);

-- サービスロールのみ書き込み可（GitHub Actions から）
create policy "service write" on trends
  for all using (auth.role() = 'service_role');
