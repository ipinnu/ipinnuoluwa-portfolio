-- ═══════════════════════════════════════════════════════
-- THE FORGE — Supabase Migration
-- Run sections C1 → C2 → C3 in order in the SQL editor
-- ═══════════════════════════════════════════════════════

-- ── C1: Assets table ──────────────────────────────────

create table if not exists assets (
  id                text primary key,
  name              text not null,
  asset_class       text not null check (asset_class in ('A','B','C')),
  allocation        int  not null default 0,
  return_types      text[] not null default '{}',
  status            text not null default 'monitor'
                    check (status in ('active','forming','monitor')),
  mandate_text      text not null default '',
  mandate_progress  int  not null default 0
                    check (mandate_progress between 0 and 100),
  scores            jsonb not null default '{"revenue":0,"impact":0,"strategic":0,"momentum":0}',
  actions           jsonb not null default '[]',
  last_reviewed     text not null default '',
  thesis            text,
  exit_condition    text,
  vision_ids        text[] default '{}',
  links             jsonb,
  updated_at        timestamptz default now()
);

alter table assets enable row level security;

-- App is password-gated at the app layer — allow anon read/write
create policy "Allow all anon" on assets for all to anon using (true) with check (true);


-- ── C2: Visions table ─────────────────────────────────

create table if not exists visions (
  id            text primary key,
  title         text not null,
  description   text not null,
  floor_link    text not null,
  time_horizon  text not null,
  game_weight   int  not null default 0
                check (game_weight between 0 and 100),
  status        text not null default 'active'
                check (status in ('active','forming','realized','paused')),
  display_order int  not null default 0,
  updated_at    timestamptz default now()
);

alter table visions enable row level security;

create policy "Allow all anon" on visions for all to anon using (true) with check (true);


-- ── C3: Seed visions ──────────────────────────────────

insert into visions (id, title, description, floor_link, time_horizon, game_weight, status, display_order)
values
(
  'sovereign-ground',
  'Sovereign Ground',
  'Move out. Own my space. Remove the last physical constraint on autonomy. My environment should be mine — my rules, my peace, my rhythm.',
  'Sovereignty — physical environment is the most tangible expression of autonomy. You cannot fully own your life in someone else''s space.',
  '12 months', 35, 'active', 1
),
(
  'income-independence',
  'Income Independence',
  'Build income streams I own completely. No single employer controls my stability. Revenue from what I build, not from permission someone else grants.',
  'Sovereignty — financial autonomy is the economic expression of the floor. Income you don''t own is autonomy you''re renting.',
  '18 months', 30, 'active', 2
),
(
  'the-living-room',
  'The Living Room',
  'Build a vivid community and place to express, connect, and share innately. A space where who I am has a spot — not waiting for the world to make room, but building the room myself.',
  'Peace — the deep floor statement: who I am has a spot in the world. Expression is downstream of sovereignty being intact.',
  '3 years', 35, 'active', 3
)
on conflict (id) do nothing;


-- ── C4: Seed assets ───────────────────────────────────

insert into assets (id, name, asset_class, allocation, return_types, status, mandate_text, mandate_progress, scores, actions, last_reviewed, vision_ids, exit_condition, links)
values
(
  'nysc-saed', 'NYSC SAED', 'A', 35,
  array['revenue','impact','brand'], 'active',
  'Complete current training cohort. Document outcomes. Explore state expansion.',
  80,
  '{"revenue":4,"impact":5,"strategic":4,"momentum":5}',
  '[{"text":"Deliver current training cohort","done":true},{"text":"Document outcomes with data","done":false},{"text":"Pitch state expansion to 1 partner","done":false},{"text":"Write case study for portfolio","done":false}]',
  '2025-04-01',
  array['income-independence','the-living-room'],
  'Program ends OR income threshold reached OR state expansion secured',
  '{"caseStudy":"/work/nysc-saed"}'
),
(
  'autodrive', 'AutoDrive', 'A', 30,
  array['revenue','strategic'], 'active',
  'Ship v2 feature set. Improve driver onboarding flow. Reach 500 active drivers.',
  65,
  '{"revenue":4,"impact":3,"strategic":5,"momentum":4}',
  '[{"text":"Ship v2 feature set","done":false},{"text":"Improve driver onboarding","done":true},{"text":"Reach 500 active drivers","done":false}]',
  '2025-04-01',
  array['income-independence','sovereign-ground'],
  '10,000 active users OR ₦500k/month revenue OR acquisition offer received',
  '{"caseStudy":"/work/autodrive"}'
),
(
  'brainbox', 'Freelance / BrainBox', 'A', 20,
  array['revenue','brand'], 'active',
  'Maintain 2 active client retainers. Build public brand through portfolio.',
  70,
  '{"revenue":5,"impact":2,"strategic":3,"momentum":4}',
  '[{"text":"Close Q2 retainer client","done":false},{"text":"Ship portfolio site","done":true}]',
  '2025-04-01',
  array['income-independence','sovereign-ground'],
  'Replaced by product revenue exceeding freelance income 3 months running',
  null
),
(
  'diaspora-app', 'Diaspora App', 'B', 8,
  array['strategic','impact'], 'forming',
  'Define MVP scope. Identify 3 early pilot users. Build waitlist landing page.',
  20,
  '{"revenue":2,"impact":5,"strategic":4,"momentum":2}',
  '[{"text":"Define MVP scope","done":false},{"text":"Identify 3 early pilot users","done":false},{"text":"Build waitlist landing page","done":false}]',
  '2025-03-15',
  array['the-living-room','income-independence'],
  'MVP live with 100 users OR co-founder found and funded',
  null
),
(
  'security-co', 'Security Company', 'B', 7,
  array['strategic'], 'forming',
  'Research regulatory requirements. Find 1 co-founder with ops background.',
  10,
  '{"revenue":3,"impact":3,"strategic":5,"momentum":1}',
  '[{"text":"Research regulatory requirements","done":false},{"text":"Find co-founder with ops background","done":false}]',
  '2025-03-01',
  array['sovereign-ground','income-independence'],
  'Whitepaper complete + co-founder identified OR concept pivoted',
  null
),
(
  'proden', 'Proden', 'C', 0,
  array['strategic'], 'monitor',
  'Thesis only.',
  0,
  '{"revenue":3,"impact":4,"strategic":4,"momentum":0}',
  '[]',
  '2025-01-01',
  array['the-living-room'],
  'Enters active development OR archived after 12 months idle',
  null
),
(
  'ncc-app', 'NCC App', 'C', 0,
  array['revenue'], 'monitor',
  'Thesis only.',
  0,
  '{"revenue":4,"impact":3,"strategic":2,"momentum":0}',
  '[]',
  '2025-01-01',
  array['income-independence'],
  'Market validation complete OR archived',
  null
),
(
  'real-estate-ar', 'Real Estate AR', 'C', 0,
  array['revenue'], 'monitor',
  'Thesis only.',
  0,
  '{"revenue":5,"impact":2,"strategic":3,"momentum":0}',
  '[]',
  '2025-01-01',
  array['income-independence'],
  'Funded prototype OR archived after 6 months',
  null
),
(
  'sacred-place', 'Sacred Place', 'C', 0,
  array['strategic'], 'monitor',
  'Thesis only.',
  0,
  '{"revenue":1,"impact":5,"strategic":5,"momentum":0}',
  '[]',
  '2025-01-01',
  array['the-living-room'],
  'Development begins OR merged into another project',
  null
)
on conflict (id) do nothing;
