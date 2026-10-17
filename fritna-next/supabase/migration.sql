-- Run once in Supabase > SQL Editor.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create function public.is_admin() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
create table public.site_content (id int primary key default 1 check (id = 1), data jsonb not null default '{}', updated_at timestamptz not null default now());
create table public.products (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120),
  category text, description text, image_url text, published boolean not null default false,
  sort_order int not null default 0, is_sample boolean not null default false, created_at timestamptz not null default now());
alter table public.admins enable row level security;
alter table public.site_content enable row level security;
alter table public.products enable row level security;
create policy "own admin row" on public.admins for select to authenticated using (user_id = auth.uid());
create policy "public read content" on public.site_content for select to anon, authenticated using (true);
create policy "admin write content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read published products" on public.products for select to anon, authenticated using (published or public.is_admin());
create policy "admin write products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
insert into public.site_content (id, data) values (1, '{}');
insert into public.products (name, category, description, published, sort_order, is_sample) values
 ('French fries','Sample','Sample product for the fries category.',true,0,true),
 ('Potato wedges','Sample','Sample product for the wedges category.',true,1,true),
 ('Other potato products','Sample','Sample product category.',true,2,true);
-- AFTER creating your user in Authentication > Users, run (with YOUR email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
