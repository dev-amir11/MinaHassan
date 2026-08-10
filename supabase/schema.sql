-- Run this in Supabase Dashboard → SQL Editor
-- Then create a PUBLIC storage bucket named "products"

create extension if not exists "pgcrypto";

create table if not exists admin_users (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  password_hash text not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id text references categories(id) on delete cascade,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_parent_id_idx on categories(parent_id);
create index if not exists categories_sort_order_idx on categories(sort_order);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  fabrics text,
  delivery_timeline text,
  disclaimer text,
  size_guide text,
  images jsonb not null default '[]'::jsonb,
  video_url text,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on products(is_published);
create index if not exists products_featured_idx on products(is_featured);
create index if not exists products_new_idx on products(is_new);

create table if not exists product_categories (
  product_id text not null references products(id) on delete cascade,
  category_id text not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx on product_categories(category_id);

create table if not exists quote_requests (
  id text primary key default gen_random_uuid()::text,
  full_name text not null,
  email text not null,
  phone text not null,
  country text,
  city text,
  event_date text,
  occasion text,
  size_note text,
  message text,
  status text not null default 'new',
  product_id text references products(id) on delete set null,
  product_name text,
  product_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quote_requests_status_idx on quote_requests(status);
create index if not exists quote_requests_created_at_idx on quote_requests(created_at);
create index if not exists quote_requests_product_id_idx on quote_requests(product_id);

create table if not exists track_orders (
  id text primary key default gen_random_uuid()::text,
  order_number text not null unique,
  customer_name text,
  customer_email text,
  customer_phone text,
  status text not null default 'Received',
  notes text,
  timeline jsonb not null default '[]'::jsonb,
  product_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists track_orders_order_number_idx on track_orders(order_number);
create index if not exists track_orders_status_idx on track_orders(status);

create table if not exists newsletter_subscribers (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_at_idx on newsletter_subscribers(created_at);

create table if not exists site_settings (
  id text primary key default gen_random_uuid()::text,
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Keep service-role access for the Next.js server.
-- Enable RLS (API anon key cannot read/write by default).
alter table admin_users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_categories enable row level security;
alter table quote_requests enable row level security;
alter table track_orders enable row level security;
alter table newsletter_subscribers enable row level security;
alter table site_settings enable row level security;
