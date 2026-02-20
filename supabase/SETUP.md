# Supabase Setup (Card Creator Showcase)

1. Open Supabase Dashboard -> SQL Editor.
2. Run `supabase/creator_showcases.sql`.
3. Wait 10-30 seconds so PostgREST schema cache is refreshed.
4. Open `/card-creator/` and click `Save Link`.
5. Share the generated URL (`?sid=...`).

## Notes

- This setup allows public `insert` and public `read` for showcase links.
- Do not store sensitive/private user data in this table.
- For anti-spam production setup, add rate-limit/CAPTCHA with Edge Function later.

## Troubleshooting

- If error says `Could not find the table 'public.creator_showcases'`, table has not been created yet (or cache not refreshed).
- If error says `permission denied` / `row-level security`, re-run SQL file to recreate grants + policies.
