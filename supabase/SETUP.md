# Supabase Setup (Card Creator Showcase)

1. Open Supabase Dashboard -> SQL Editor.
2. Run `supabase/creator_showcases.sql`.
3. Redeploy/push website.
4. Open `/card-creator/` and click `Save Link`.
5. Share the generated URL (`?sid=...`).

## Notes

- This setup allows public `insert` and public `read` for showcase links.
- Do not store sensitive/private user data in this table.
- For anti-spam production setup, add rate-limit/CAPTCHA with Edge Function later.

