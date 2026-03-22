# CharityBowl 2026

Live donation leaderboard for the CharitiBundi Bowl fundraising event. Automatically pulls donation data from GiveSmart every 5 minutes and deploys to GitHub Pages.

## To Do

- [ ] Add `GIVESMART_API_TOKEN` as a repository secret (Settings > Secrets and variables > Actions)
- [ ] Add `GIVESMART_CAMPAIGN` as a repository variable with this year's campaign name
- [ ] Enable GitHub Pages (Settings > Pages > Source: GitHub Actions)
- [ ] Replace `public/logo.png` with the 2026 event logo
- [ ] Update donation link (`edsbscharitybowl.com`) in `src/App.tsx` and `src/HeadToHead.tsx`
- [ ] Update `rivalries.txt` if rivalry matchups change for 2026
- [ ] Update `conferences.txt` if conference groupings change for 2026
- [ ] Review `data/harmonization.csv` — add any new team name mappings needed for 2026

### During the Event

- [ ] Check `unmapped.json` periodically for new write-in entries that need mappings
- [ ] Add new mappings to `data/harmonization.csv` as needed
- [ ] Add offline/corporate match donations to `data/manual_additions.json` as they come in
- [ ] When ready for "lights out" mode, set `LIGHTS_OUT = true` in `src/constants.ts`

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
