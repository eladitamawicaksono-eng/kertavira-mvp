-- Jalankan file ini di Supabase Dashboard > SQL Editor

-- 1. Tabel merchant (1 baris per user yang login)
create table merchants (
  id uuid references auth.users on delete cascade primary key,
  business_name text,
  created_at timestamp with time zone default now()
);

-- 2. Tabel kategori transaksi
create table categories (
  id uuid default gen_random_uuid() primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  name text not null,
  type text check (type in ('masuk', 'keluar')) not null
);

-- 3. Tabel transaksi harian
create table transactions (
  id uuid default gen_random_uuid() primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  category_id uuid references categories(id),
  type text check (type in ('masuk', 'keluar')) not null,
  amount numeric not null,
  note text,
  transaction_date date default current_date,
  created_at timestamp with time zone default now()
);

-- 4. Otomatis buat baris merchant begitu ada user baru daftar/login
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.merchants (id, business_name)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Row Level Security: tiap merchant HANYA bisa lihat/ubah datanya sendiri
alter table merchants enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;

create policy "Merchant kelola baris sendiri"
  on merchants for all
  using (auth.uid() = id);

create policy "Merchant kelola kategori sendiri"
  on categories for all
  using (auth.uid() = merchant_id);

create policy "Merchant kelola transaksi sendiri"
  on transactions for all
  using (auth.uid() = merchant_id);
