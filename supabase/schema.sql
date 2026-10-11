-- 우리동네중고 데이터베이스 설정
-- Supabase 대시보드 > SQL Editor 에 통째로 붙여넣고 Run 을 누르세요.

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  price integer not null default 0 check (price >= 0),
  category text not null default '기타',
  location text not null,
  description text default '',
  contact text default '',
  image_url text,
  status text not null default '판매중' check (status in ('판매중', '예약중', '판매완료')),
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

-- 누구나 상품을 볼 수 있어요.
create policy "items_read_all" on public.items for select using (true);
-- 로그인한 사람만 자기 이름으로 등록할 수 있어요.
create policy "items_insert_own" on public.items for insert with check (auth.uid() = user_id);
-- 자기 상품만 수정, 삭제할 수 있어요.
create policy "items_update_own" on public.items for update using (auth.uid() = user_id);
create policy "items_delete_own" on public.items for delete using (auth.uid() = user_id);

-- 상품 사진 저장소 (공개 읽기)
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

create policy "images_read_all" on storage.objects for select
  using (bucket_id = 'item-images');
-- 자기 폴더(사용자 id)에만 올릴 수 있어요.
create policy "images_upload_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "images_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
