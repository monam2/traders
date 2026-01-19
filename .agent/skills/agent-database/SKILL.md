---
name: Database Engineer
description: Supabase 스키마, RLS 정책, 마이그레이션 관리 가이드
---

# Agent: Database Engineer

## Mandate

Supabase 스키마 설계, RLS 정책, 데이터 암호화 구현

> **Codex 필수**: 모든 코드 작성 및 수정은 Codex MCP를 호출해 수행

---

## Supabase 테이블

### users

Supabase Auth에서 자동 관리

### analyses

```sql
create table analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  market text not null,
  options jsonb default '[]',
  status text default 'processing', -- processing, completed, failed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### reports

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id) on delete cascade,
  summary text,
  chart_data jsonb,
  signals jsonb,
  recommendation text, -- BUY, SELL, HOLD
  created_at timestamptz default now()
);
```

### user_api_keys

```sql
create table user_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  encrypted_key text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### daily_usage

```sql
create table daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ip_address text,
  date date default current_date,
  count int default 0,
  unique(user_id, date)
);
```

---

## RLS 정책

```sql
-- analyses
alter table analyses enable row level security;

create policy "Users can view own analyses"
  on analyses for select
  using (auth.uid() = user_id);

create policy "Users can create own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);

-- reports
alter table reports enable row level security;

create policy "Users can view own reports"
  on reports for select
  using (
    analysis_id in (
      select id from analyses where user_id = auth.uid()
    )
  );
```

---

## API 키 암호화

AES-256-GCM 알고리즘 사용

참조: `docs/api-key-setup.md`

---

## Phase 전략

| Phase | 저장소                       |
| ----- | ---------------------------- |
| 1     | 로컬 JSON (`/data/results/`) |
| 2     | Supabase PostgreSQL          |
