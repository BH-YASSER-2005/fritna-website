# Fritna website (Next.js + Supabase + Vercel)
Public site at `/`, private admin at `/admin` (login at `/login`). No admin link is shown to visitors.

## Run locally
1. Install Node.js 20+. In this folder: `npm install`
2. Copy `.env.example` to `.env.local` and fill the 3 values (see Setup below).
3. `npm run dev` then open http://localhost:3000

## Setup (free tiers)
1. **Supabase**: create a free project at supabase.com. SQL Editor > paste `supabase/migration.sql` > Run.
2. Authentication > Sign In / Providers > turn **off** "Allow new users to sign up". Authentication > Users > **Add user** (your email + a strong password, auto-confirm).
3. SQL Editor, run: `insert into public.admins (user_id) select id from auth.users where email = 'YOU@EXAMPLE.COM';`
4. Project Settings > API: copy **Project URL** and the **anon public** key into `.env.local`. Never use the service_role key in this project.
5. **GitHub**: create a repository and push this folder (`git init`, `git add .`, `git commit`, `git remote add`, `git push`).
6. **Vercel**: Add New > Project > import the repo > add the 3 environment variables > Deploy.
7. Set `NEXT_PUBLIC_SITE_URL` to your final address, then redeploy. Add Supabase Authentication > URL Configuration > Site URL = same address.

## Test after deploying
Public: open the site in a private window, check there is no Admin link and `/admin` redirects to `/login`.
Owner: sign in at `/login`, edit the headline, save, reload `/`. Add a product with an image, publish, check `/`. Log out, then open `/admin` again.

## Limits
Free tiers: Supabase pauses projects after about a week of inactivity (resume from dashboard); Vercel Hobby is for non-commercial use, so a business may need Pro (paid). Custom domain costs the registrar fee. Images max 4 MB (Vercel body limit). The contact form is a demo until an email service is added.
