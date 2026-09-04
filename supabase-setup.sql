-- QueryPath: таблица для облачного сохранения прогресса.
-- Префикс sql_ выбран специально, чтобы не пересекаться с таблицами
-- другого вашего проекта в том же Supabase-аккаунте.

create table if not exists sql_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security: каждый видит и меняет только свою строку.
alter table sql_progress enable row level security;

create policy "Users manage their own progress"
  on sql_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
