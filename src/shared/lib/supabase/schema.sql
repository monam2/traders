-- Create analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid(),
  ticker text not null,
  market text default 'US',
  options jsonb default '[]',
  status text check (status in ('processing', 'completed', 'failed')) default 'processing',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create reports table
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  analysis_id uuid references public.analyses(id) on delete cascade not null,
  summary text,
  recommendation text check (recommendation in ('BUY', 'SELL', 'HOLD')),
  signals jsonb default '[]',
  chart_data jsonb default '[]',
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.analyses enable row level security;
alter table public.reports enable row level security;

-- Create Policies (Allow anonymous/authenticated users to insert and read)
-- Note: In production, reading should be restricted to the owner (user_id).
-- For this MVP, we allow public read for shared links, or restrict by ID.

-- Analyses: Allow Select
create policy "Allow select for everyone" on public.analyses
  for select using (true);

-- Analyses: Allow Insert (Authenticated/Anonymous)
create policy "Allow insert for authenticated users" on public.analyses
  for insert with check (true);

-- Analyses: Allow Update (Server-side mostly, but for now allow public if needed or just service role)
-- Service role bypasses RLS, so we don't strictly need update policy for the API route.
-- However, we might want to allow users to update their own analysis? Likely not needed.

-- Reports: Allow Select
create policy "Allow select for everyone" on public.reports
  for select using (true);

-- Reports: Allow Insert (Service role bypasses, but good to have)
create policy "Allow insert for service role" on public.reports
  for insert with check (true);
