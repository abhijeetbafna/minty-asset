-- Minty Personal Finance Schema Migration: Phase 1 & 2 Initial Engine
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Profiles & Preferences Table
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    currency_code text not null default 'INR',
    currency_symbol text not null default '₹',
    number_format text not null default 'lakh_crore', -- 'lakh_crore' | 'million_billion'
    fy_start_month integer not null default 4,        -- 4 = April (Indian Standard), 1 = January
    theme_preference text not null default 'light',    -- 'light' | 'dark' | 'system'
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Categories Table
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade, -- null indicates standard system baseline
    type text not null check (type in ('income', 'expense')),
    name text not null,
    subcategories text[] not null default '{}',
    icon text,
    color text,
    is_system_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_categories_user on public.categories(user_id, type);

-- 3. Row-Level Security (RLS) Policies
alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

create policy "Users can insert own profile"
    on public.user_profiles for insert
    with check (auth.uid() = id);

-- Categories Policies
create policy "Users can view own categories and system defaults"
    on public.categories for select
    using (auth.uid() = user_id or is_system_default = true);

create policy "Users can create own categories"
    on public.categories for insert
    with check (auth.uid() = user_id);

create policy "Users can update own categories"
    on public.categories for update
    using (auth.uid() = user_id and is_system_default = false);

create policy "Users can delete own categories"
    on public.categories for delete
    using (auth.uid() = user_id and is_system_default = false);

-- 4. Automatic User Profile Creation on Signup Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, display_name, currency_code, currency_symbol, number_format, fy_start_month)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        'INR',
        '₹',
        'lakh_crore',
        4
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
