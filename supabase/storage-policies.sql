-- Optional helper for Supabase Storage.
-- Recommended: create a PUBLIC bucket named "products" in Dashboard → Storage.
-- Uploads from this app use the service role key (bypasses Storage RLS).

-- If you need an explicit public-read policy:
-- drop policy if exists "Public read products" on storage.objects;
-- create policy "Public read products"
-- on storage.objects for select
-- to public
-- using (bucket_id = 'products');
