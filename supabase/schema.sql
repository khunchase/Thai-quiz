-- Thai Word Quiz — cloud sync schema.
-- Run this once in your Supabase project's SQL Editor.
-- Table names are prefixed thai_quiz_ so this can safely share a project
-- with other apps (e.g. stronglift4chase-tma) without name collisions.

create table if not exists public.thai_quiz_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  review_states jsonb not null default '{}'::jsonb,
  daily_log jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date text,
  updated_at timestamptz not null default now()
);

create table if not exists public.thai_quiz_deck (
  user_id uuid primary key references auth.users (id) on delete cascade,
  custom_words jsonb not null default '[]'::jsonb,
  custom_categories jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.thai_quiz_progress enable row level security;
alter table public.thai_quiz_deck enable row level security;

drop policy if exists "Users manage own progress" on public.thai_quiz_progress;
create policy "Users manage own progress" on public.thai_quiz_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own deck" on public.thai_quiz_deck;
create policy "Users manage own deck" on public.thai_quiz_deck
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
