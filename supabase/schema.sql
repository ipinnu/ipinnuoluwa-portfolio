-- ============================================================
-- Ipinnuoluwa Oladipo Portfolio — Supabase Schema
-- Run this in the Supabase SQL editor to set up the database
-- ============================================================

-- Contact form submissions
create table if not exists contact_submissions (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  email       text not null,
  company     text,
  project_type text not null,
  budget_range text not null,
  timeline    text not null,
  description text not null,
  referral    text,
  status      text default 'new', -- new | read | replied | converted
  created_at  timestamptz default now()
);

-- Blog post view counts
create table if not exists post_views (
  slug        text primary key,
  views       bigint default 0,
  updated_at  timestamptz default now()
);

-- Projects (optional CMS layer)
create table if not exists projects (
  id          uuid default gen_random_uuid() primary key,
  slug        text unique not null,
  title       text not null,
  summary     text,
  role        text,
  stack       text[],
  tags        text[],
  outcome     text,
  featured    boolean default false,
  order_index int default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- Enable RLS on all tables
alter table contact_submissions enable row level security;
alter table post_views enable row level security;
alter table projects enable row level security;

-- post_views: public read, service role write
create policy "Public can read views"
  on post_views for select
  using (true);

create policy "Service role can upsert views"
  on post_views for all
  using (auth.role() = 'service_role');

-- contact_submissions: insert only from public, no public read
create policy "Anyone can submit"
  on contact_submissions for insert
  with check (true);

-- projects: public read if published
create policy "Public can read published projects"
  on projects for select
  using (published = true);

-- ============================================================
-- Seed project data (optional)
-- ============================================================

insert into projects (slug, title, summary, role, stack, tags, outcome, featured, order_index) values
  (
    'autodrive',
    'Autodrive',
    'A full-stack fleet & driver management mobile app, shipped to the Play Store after two years of development.',
    'Product Manager + Flutter Contributor',
    array['Flutter', 'Firebase', 'GitHub Actions', 'Dart'],
    array['Mobile', 'Flutter', 'Product Management'],
    'Shipped to Play Store · 2-year development · Full CI/CD pipeline',
    true,
    1
  ),
  (
    'my-health-padi',
    'My Health Padi',
    'A 25-screen cross-platform health companion app built with Flutter and Firebase.',
    'Flutter Developer',
    array['Flutter', 'Firebase', 'Dart'],
    array['Mobile', 'Flutter', 'Health'],
    '25-screen health app · Cross-platform · Android & iOS',
    true,
    2
  ),
  (
    'insdec',
    'iNSDEC Website & Internal Tools',
    'End-to-end tech setup for an NGO — company website, Microsoft 365 deployment, and internal workflow tools.',
    'Technical Officer',
    array['Next.js', 'Microsoft 365', 'SharePoint', 'Power Automate'],
    array['Web', 'Consulting', 'Business Tech'],
    'M365 deployed for full org · Internal tools live · Company website shipped',
    false,
    3
  ),
  (
    'hermex-travels',
    'HermexTravels',
    'Mobile-first UI for a travel booking platform with REST API integration.',
    'Frontend Engineer',
    array['Flutter', 'REST APIs', 'Dart'],
    array['Mobile', 'Flutter', 'Travel'],
    'Responsive UI components · API integration · Mobile-first',
    false,
    4
  )
on conflict (slug) do nothing;
