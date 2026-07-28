-- React Hub learner accounts and progress
-- Run in the Supabase SQL editor after enabling Email auth.

create table if not exists public.course_learners (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  course_version integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_progress (
  learner_id uuid not null references public.course_learners(id) on delete cascade,
  module_id text not null,
  activity_id text not null,
  explored boolean not null default true,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (learner_id, module_id, activity_id)
);

alter table public.course_learners enable row level security;
alter table public.course_progress enable row level security;

drop policy if exists "Learners read own profile" on public.course_learners;
create policy "Learners read own profile"
  on public.course_learners for select
  using (auth.uid() = id);

drop policy if exists "Learners update own profile" on public.course_learners;
create policy "Learners update own profile"
  on public.course_learners for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Learners read own progress" on public.course_progress;
create policy "Learners read own progress"
  on public.course_progress for select
  using (auth.uid() = learner_id);

drop policy if exists "Learners write own progress" on public.course_progress;
create policy "Learners write own progress"
  on public.course_progress for insert
  with check (auth.uid() = learner_id);

drop policy if exists "Learners update own progress" on public.course_progress;
create policy "Learners update own progress"
  on public.course_progress for update
  using (auth.uid() = learner_id)
  with check (auth.uid() = learner_id);

create or replace function public.create_course_learner()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.course_learners (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_course_learner_created on auth.users;
create trigger on_course_learner_created
  after insert on auth.users
  for each row execute procedure public.create_course_learner();
