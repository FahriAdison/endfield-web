# Supabase Setup (Card Creator + Visitor Counter)

1. Open Supabase Dashboard -> SQL Editor.
2. Run `supabase/creator_showcases.sql`.
3. Run `supabase/visitor_daily.sql`.
4. Wait 10-30 seconds so PostgREST schema cache is refreshed.
5. Open `/card-creator/` and click `Save Link`.
6. Open `/` (home page) and verify `Pengunjung Hari Ini` counter appears.

## Notes

- This setup allows public `insert` and public `read` for showcase links.
- Visitor counter menyimpan `visitor_id` acak dari browser + tanggal kunjungan (tanpa data sensitif).
- Do not store sensitive/private user data in this table.
- For anti-spam production setup, add rate-limit/CAPTCHA with Edge Function later.

## Troubleshooting

- If error says `Could not find the table 'public.creator_showcases'`, table has not been created yet (or cache not refreshed).
- If visitor card shows sync error, ensure table `public.visitor_daily` exists and RLS policy `select` + `insert` is active.
- If error says `permission denied` / `row-level security`, re-run SQL file to recreate grants + policies.
