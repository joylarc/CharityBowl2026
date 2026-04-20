# CharityBowl 2026

Live donation leaderboard for the CharitiBundi Bowl fundraising event. Automatically pulls donation data from GiveSmart every 15 minutes and deploys to Cloudflare Pages.

## To Do

- [x] Add `GIVESMART_API_TOKEN` as a repository secret (Settings > Secrets and variables > Actions)
- [x] Add `GIVESMART_CAMPAIGN` as a repository variable with this year's campaign name
- [x] Replace `public/logo.png` with the 2026 event logo
- [x] Update donation link (`edsbscharitybowl.com`) in `src/App.tsx` and `src/HeadToHead.tsx`
- [x] Update `rivalries.txt` if rivalry matchups change for 2026
- [x] Update `conferences.txt` if conference groupings change for 2026
- [x] Update DNS to point custom domain to Cloudflare Pages
- [x] Confirm pre-event landing page looks correct once deployed
- [x] Update info page (replaced with FAQ page)
- [x] Update edsbscharitybowl.com DNS to point to landing page
- [x] Update donate link on moneycannon head-to-head page
- [x] Re-link logo to edsbscharitybowl.com

### Known Limitations

- **edsbscharitybowl.com non-www subpages don't work.** GoDaddy forwarding redirects `edsbscharitybowl.com` to `www.edsbscharitybowl.com` but does not preserve subpage paths (e.g., `edsbscharitybowl.com/faq.html` fails). Always share links with `www.` prefix. Not fixable without moving DNS away from GoDaddy.

### Pre-Set (automatic at 10 AM ET April 20)

- Moneycannon.org leaderboard goes live automatically (time-based switch in App.tsx, auto-reloads for visitors on the page)
- Donate buttons on edsbscharitybowl.com enable automatically with GiveSmart link (auto-reloads for visitors on the page)
- Manual override if needed: set `PRE_EVENT = false` in `src/constants.ts`

### Go Live

- [ ] Uncomment the cron schedule AND the API fetch step in `.github/workflows/deploy.yml` and push
- [ ] Reactivate the campaign keyword in GiveSmart
- [ ] Immediately after go-live: run "Daily transaction export" workflow to verify donations.csv and transactions.csv populate correctly before the first cron deploy

### During the Event

- [ ] Add offline/corporate match donations to `manual_additions.csv` as they come in
- [ ] When ready for "lights out" mode, set `LIGHTS_OUT = true` in `src/constants.ts`
- [ ] Confirm lights-out dialog text and timing are correct before activating

## Local Development

```bash
# Fetch fresh data (requires API token)
GIVESMART_API_TOKEN=<token> GIVESMART_CAMPAIGN="Charity Bowl 2025" python3 scripts/fetch_givesmart.py

# Install dependencies and run dev server
yarn install
yarn dev

# Build for production
yarn build
```

See [AGENTS.md](AGENTS.md) for full technical documentation.
