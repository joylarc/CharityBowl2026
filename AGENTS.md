# CharityBowl 2026 — Agent Guide

## What This Project Is

A live donation leaderboard for the **CharitiBundi Bowl**, a college football charity fundraising event benefiting **New American Pathways**, an Atlanta-based refugee resettlement nonprofit. Donors contribute through GiveSmart in the name of college football teams over 7-10 days. The website shows real-time donation totals per team, updated automatically every 5 minutes during the event.

The site is hosted at **moneycannon.org** via GitHub Pages with a custom domain.

## Architecture

```
Every 5 minutes (during event):
  GitHub Actions (scheduled workflow)
      |
      v
  Python script (scripts/fetch_givesmart.py)
      |-- Calls GiveSmart Transactions API (async 2-step pattern)
      |-- Resolves team names via harmonization CSV
      |-- Writes donations.csv (leaderboard data)
      |-- Writes transactions.csv (detailed per-transaction data, NOT deployed)
      |-- Writes unmapped.json (unmatched write-ins)
      v
  Vite builds the React app (yarn build)
      |
      v
  Deploys static files to GitHub Pages at moneycannon.org
```

The frontend is a React + TypeScript + Vite + MUI app. It reads `donations.csv` at page load and renders the leaderboard client-side. There is no backend server — the site is entirely static files.

## Hosting & Domain

- **GitHub Pages** serves the site from the `dist/` folder
- **Custom domain:** moneycannon.org (configured via `public/CNAME`)
- **Base path:** `/` in vite.config.ts (since we use a custom domain, not the `username.github.io/repo` path)
- All asset references use `import.meta.env.BASE_URL + "filename"` for base path compatibility

### DNS Configuration (Gandi.net)

The domain `moneycannon.org` is managed at Gandi.net. The following DNS records are required:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 10800 |
| A | @ | 185.199.109.153 | 10800 |
| A | @ | 185.199.110.153 | 10800 |
| A | @ | 185.199.111.153 | 10800 |
| CNAME | www | joylarc.github.io. | 10800 |

**Important notes:**
- The four A records point the apex domain (moneycannon.org) to GitHub Pages' IPs
- The `www` CNAME must use a trailing dot (`joylarc.github.io.`) to prevent Gandi from appending `.moneycannon.org` to it
- Do not delete the existing MX/mail-related DNS records (gm1._domainkey, gm2._domainkey, gm3._domainkey CNAME records for Gandi mail)
- "Enforce HTTPS" should be checked in GitHub repo Settings > Pages
- After DNS changes, propagation can take up to the TTL (10800s = 3 hours)

## Multi-Page App Structure

The site has three separate HTML entry points, each with its own React root and theme:

| Page | URL | Entry HTML | Entry TSX | Component | Font |
|------|-----|-----------|-----------|-----------|------|
| Main (leaderboard + pre-event) | moneycannon.org | `index.html` | `src/main.tsx` | `src/App.tsx` | Roboto |
| Info page | moneycannon.org/info.html | `info.html` | `src/info.tsx` | `src/InfoPage.tsx` | Montserrat |
| 2025 results | moneycannon.org/results2025.html | `results2025.html` | `src/results2025entry.tsx` | `src/Results2025.tsx` | Roboto |

Vite is configured with multiple `rollupOptions.input` entries in `vite.config.ts` to build all three pages.

## Design Decisions

### Fonts
- **Leaderboard / main app / 2025 results:** Roboto (MUI default)
- **Pre-event landing page and info page:** Montserrat — applied via scoped `ThemeProvider` in `PreEvent.tsx` and via the `info.tsx` entry point theme. The font is NOT applied globally to avoid affecting the leaderboard.

### Color Palette
- **Primary:** Cyan (#00ffff) — used for header backgrounds, accents, dividers
- **Pre-event page:** Full cyan background (#00ffff) with black text, black buttons with cyan text
- **Info page:** Cyan hero header area with black text, white body area with dark grey (#333) section headers and cyan (#00bfbf) links, cyan dividers between sections
- **Leaderboard:** Cyan header bar with logo, standard MUI light/dark mode for the body
- **Lights-out mode:** Forces dark mode, gold (#fed426) accent text

### Pre-Event Landing Page (`src/PreEvent.tsx`)
- Shown when `PRE_EVENT = true` in `src/constants.ts`
- Can be bypassed with `?mode=live` URL parameter for testing
- Full cyan background
- Title: "The 2026 Charitibundi Bowl" + "Coming Soon" (italic)
- Live countdown timer to April 20, 2026 10:00 AM CDT (Central Daylight Time, UTC-5)
- Two buttons: "Learn More" (links to newamericanpathways.org) and "2025 Final Scores" (links to results2025.html)

### Info Page (`src/InfoPage.tsx`)
- Separate page at `/info.html` with its own entry point and Montserrat theme
- Cyan hero area at top with tagline ("Prove yourself better than your rival in the name of charity") and live countdown timer
- White body area with sections separated by cyan dividers:
  1. Kickoff announcement (links to New American Pathways Bluesky and Instagram)
  2. "The game is the same as it's always been" — how donations work
  3. "New American Pathways" — about the beneficiary nonprofit
  4. "Some highlights from the past year" — with photo (IMG_1107.jpg) beside the list
  5. "Where is your money going?" — donation impact amounts, with photo (IMG_1109.jpg)
  6. "It begins with spite and it ends with hugs (and spite)" — link to 2025 results + "Donate beginning April 20, 2026"

### 2025 Results Page (`src/Results2025.tsx`)
- Standalone page at `/results2025.html` showing frozen 2025 final standings
- Loads data from `donations-2025.csv` (a static snapshot, not regenerated)
- Uses `2025results.png` (money bag logo) in header
- Searchable leaderboard only — no tabs, rivalries, or conferences
- No "last updated" text (data is final)

### Leaderboard (Main App)
- Four tabs: Leaderboard, Rivalries, Conferences, Head-to-Head
- Search persisted to URL `?q=` parameter
- Tab selection persisted to URL `?t=` parameter
- Head-to-head school selections persisted to URL `?c=` parameter
- Mobile: bottom navigation bar; Desktop: top tab bar
- "Last updated" timestamp shown in red at top

### Feature Flags (`src/constants.ts`)
- `PRE_EVENT = true` — shows pre-event landing page instead of leaderboard. Set to `false` when event starts.
- `LIGHTS_OUT = false` — when `true`, forces dark mode and shows a dialog announcing the "lights out" free-for-all phase near the end of the event.

## File Structure

```
CharityBowl2026/
├── .github/workflows/
│   ├── build.yml                  # Builds on push (creates release zip)
│   └── update-data.yml           # Scheduled: fetch data, build, deploy to Pages
├── scripts/
│   └── fetch_givesmart.py        # GiveSmart API -> donations.csv + transactions.csv
├── data/
│   ├── harmonization.csv         # 1,877-row team name mapping (raw -> canonical)
│   └── manual_additions.json     # Offline/corporate match donations to add manually
├── src/
│   ├── App.tsx                   # Main app: header, search, tab routing, PRE_EVENT gate
│   ├── PreEvent.tsx              # Pre-event landing page with countdown (Montserrat font)
│   ├── InfoPage.tsx              # Info page about the event and charity (Montserrat font)
│   ├── Results2025.tsx           # 2025 final standings (frozen data)
│   ├── Leaderboard.tsx           # Ranked table of all schools
│   ├── Rivalries.tsx             # Predefined rivalry/conference matchups
│   ├── HeadToHead.tsx            # Custom school comparison tool
│   ├── Navigation.tsx            # Tab bar (desktop) / bottom nav (mobile)
│   ├── StripedTableRow.tsx       # Alternating row styling
│   ├── state.ts                  # Data loading: reads donations.csv, rivalries.txt, conferences.txt
│   ├── constants.ts              # PRE_EVENT and LIGHTS_OUT flags
│   ├── main.tsx                  # Main entry point (Roboto, leaderboard theme)
│   ├── info.tsx                  # Info page entry point (Montserrat theme)
│   └── results2025entry.tsx      # 2025 results entry point (Roboto, leaderboard theme)
├── donations.csv                 # Auto-generated: timestamp + "school","amount" rows
├── donations-2025.csv            # Frozen 2025 final data (not regenerated)
├── transactions.csv              # Auto-generated: detailed per-transaction data (GITIGNORED — contains PII)
├── unmapped.json                 # Auto-generated: write-in entries with no mapping
├── rivalries.txt                 # Rivalry groupings (name + school list, blank-line separated)
├── conferences.txt               # Conference groupings (same format as rivalries.txt)
├── index.html                    # Main Vite entry point
├── info.html                     # Info page entry point
├── results2025.html              # 2025 results entry point
├── vite.config.ts                # Vite config: 3 entry points, copies donations*.csv and *.txt to dist/
├── package.json                  # Dependencies: React 19, MUI v7, Vite
└── public/
    ├── CNAME                     # Custom domain: moneycannon.org
    ├── logo.png                  # 2026 event logo (displayed in main header)
    ├── 2025results.png           # 2025 money bag logo (used on results page)
    ├── IMG_1107.jpg              # Photo for info page "highlights" section
    ├── IMG_1109.jpg              # Photo for info page "where is your money going" section
    └── helmet.svg                # Favicon
```

## GiveSmart API Integration

### Authentication
- Token-based: `Authorization: Token token="<private_api_token>"`
- Token stored as GitHub secret `GIVESMART_API_TOKEN`

### Transactions Endpoint (async 2-step pattern)
1. `GET /api/v2/reports/transactions.json?campaign=<name>&status=collected,pending`
   - Returns `{"id": "<report_id>"}`
2. `GET /api/v2/reports/results.json?id=<report_id>`
   - Returns "not yet complete" while processing (can take several minutes)
   - Returns JSON array of transactions when ready

### Key Transaction Fields
| Field | Description |
|-------|-------------|
| `name_of_school/team_(dropdown)` | Dropdown selection (mixed case) |
| `name_of_school/team_(manualentry)` | Free-text entry when "Other - Write In" selected |
| `pledged_amount` | Dollar string like "$100.00" (used for leaderboard totals) |
| `first_name` | Donor first name |
| `last_name` | Donor last name |
| `zip` / `zip_code` / `postal_code` | Donor zip code (exact field name TBD from live data) |
| `frequency` | Donation frequency (one-time, monthly, etc.) |
| `message` / `comment` | Donor message (exact field name TBD from live data) |
| `transaction_date` | Date of the transaction |
| `billing_status` | "settled", "pending", etc. |
| `billing_type` | "paypal", "offline", etc. |
| `source` | "offline", "bulk_offline", "Paid via Mobile Web (Pledging)", etc. |

### Team Name Resolution (scripts/fetch_givesmart.py)

For each transaction:

1. **Read dropdown value** (`name_of_school/team_(dropdown)`)
   - If empty/null: skip (offline/corporate match with no team)
   - If "OTHER - WRITE IN": go to step 2
   - Otherwise: look up in `data/harmonization.csv` (case-insensitive). Use canonical name.

2. **Read write-in value** (`name_of_school/team_(manualentry)`)
   - Look up in `data/harmonization.csv` (case-insensitive)
   - If match: use canonical name
   - If no match: **exclude from leaderboard**, add to `unmapped.json`

3. **Manual additions** (`data/manual_additions.json`)
   - Added to team totals after API data is processed
   - For offline donations or corporate matches that need to be attributed to a team

### Conference Lookup
The script reads `conferences.txt` to build a school-to-conference mapping. For each transaction, after harmonizing the team name, it looks up the conference. This is used in the transactions CSV output.

### Environment Variables
| Variable | Where Set | Description |
|----------|-----------|-------------|
| `GIVESMART_API_TOKEN` | GitHub Secret | Private API token |
| `GIVESMART_CAMPAIGN` | GitHub Variable (or env) | Campaign name filter (default: "Charity Bowl 2025") |

## Data Files

### donations.csv (auto-generated, deployed to site)
Generated by `fetch_givesmart.py`. Format matches what the frontend expects:
```
"03-22-2026 14:30 UTC"
"Alabama","15827.37"
"Michigan","12345.67"
...
```
First line is a quoted timestamp. Subsequent lines are `"school","amount"` pairs. The frontend aggregates duplicate school names client-side.

### transactions.csv (auto-generated, GITIGNORED — not deployed)
Detailed per-transaction CSV for analysis and record-keeping. Contains PII (names, zip codes) so it is gitignored and excluded from the Vite build (vite.config.ts copies only `donations*.csv`, not all `*.csv`).

Columns:
| Column | Description |
|--------|-------------|
| `transaction_date` | Date of the transaction |
| `first_name` | Donor first name |
| `last_name` | Donor last name |
| `zip_code` | Donor zip code |
| `frequency` | Donation frequency (one-time, monthly, etc.) |
| `amount` | Pledged amount for this transaction |
| `total` | Computed total (amount x12 for monthly, x4 for quarterly, x52 for weekly; same as amount for one-time/annual) |
| `dropdown_school_team` | Raw dropdown selection from GiveSmart |
| `write_in_school_team` | Manual write-in text (only if dropdown was "Other - Write In") |
| `harmonized_school_team` | Canonical team name from harmonization.csv |
| `conference` | Conference from conferences.txt |
| `message` | Donor message/comment |

### donations-2025.csv (static, deployed to site)
Frozen final data from the 2025 event. Used by the 2025 results page. Not regenerated by the script.

### data/harmonization.csv
Maps raw team names (from dropdown or write-in) to canonical display names. Two columns:
```
Name Of School/Team,Harmonized Name
Bama,Alabama
University of Alabama,Alabama
ALABAMA,Alabama
...
```
Currently has 1,877 mappings covering 667 unique canonical names. Includes the 128 dropdown options plus hundreds of write-in variations from previous years. Can be edited directly on GitHub during the event.

### data/manual_additions.json
For adding offline/corporate match donations to specific teams:
```json
[
  {"team": "Michigan", "amount": 500.00, "note": "Google Benevity match - John Lynch"},
  {"team": "Georgia", "amount": 1000.00, "note": "Wells Fargo match - Kacie Rowlette"}
]
```
Team names must match canonical names from the harmonization CSV.

### unmapped.json (auto-generated, deployed to site)
Auto-generated list of write-in entries that didn't match any harmonization mapping:
```json
[
  {
    "write_in": "U of Central Oklahoma",
    "amount": "$51.32",
    "date": "04/25/2025 21:44",
    "donor": "Fred Jones"
  }
]
```
Check this during the event. To fix: add a row to `data/harmonization.csv` mapping the write-in to a canonical name. The next update cycle will pick it up.

### rivalries.txt / conferences.txt
Groupings displayed in the Rivalries and Conferences tabs. Format: group name on first line, school names on subsequent lines, blank line separates groups.
```
Iron Bowl
Alabama
Auburn

The Game
Michigan
Ohio State
```
School names must match the canonical names used in donations.csv.

## Frontend

### Tech Stack
- React 19, TypeScript, Vite, MUI (Material UI) v7
- Builds to static files in `dist/`
- `vite-plugin-static-copy` copies `donations*.csv` and `*.txt` into `dist/`

### State Management (src/state.ts)
- Fetches `donations.csv`, `rivalries.txt`, `conferences.txt` at startup
- Parses donations CSV into a `{school: amount}` map (aggregates duplicates)
- First line of CSV is the "Last updated" timestamp
- Data is loaded once via React Suspense, no client-side auto-refresh (the whole site is rebuilt every 5 min by GitHub Actions)

### URL Parameters
- `?mode=live` — bypasses `PRE_EVENT` flag, shows leaderboard even before go-live (for testing)
- `?q=<search>` — persists search query across tab navigation
- `?t=<tab>` — persists tab selection (leaderboard, rivalries, conferences, head-to-head)
- `?c=<schools>` — persists head-to-head school selections

## GitHub Actions Workflows

### update-data.yml (every 5 minutes during event)
- Cron schedule is **commented out** until go-live — uncomment when the event starts
- Also has `workflow_dispatch` for manual triggering
- Steps:
  1. Checkout repo
  2. Set up Python 3.12
  3. Run `fetch_givesmart.py` (generates `donations.csv`, `transactions.csv`, `unmapped.json`)
  4. Set up Node, `yarn install --frozen-lockfile`, `yarn build`
  5. Deploy `dist/` to GitHub Pages

### build.yml (on push to master)
Builds the site and creates a GitHub release with the zipped `dist/` folder.

## Go-Live Checklist

1. Set `PRE_EVENT = false` in `src/constants.ts` and push
2. Uncomment the cron schedule in `.github/workflows/update-data.yml` and push
3. Set `GIVESMART_CAMPAIGN` repository variable to the 2026 campaign name

## During the Event

- **Check `unmapped.json`** periodically for new write-in entries that need mappings
- **Add mappings** by editing `data/harmonization.csv` (can be done directly on GitHub) and pushing
- **Add offline/corporate donations** by editing `data/manual_additions.json`
- **"Lights out" mode**: Set `LIGHTS_OUT = true` in `src/constants.ts` to hide scores and show a dialog

## Local Development

```bash
# Fetch fresh data (requires API token)
GIVESMART_API_TOKEN=<token> GIVESMART_CAMPAIGN="Charity Bowl 2025" python3 scripts/fetch_givesmart.py

# Install dependencies and run dev server
yarn install
yarn dev

# Build for production
yarn build

# Preview production build
npx vite preview
```

## Security Notes

- The repo is public — do not commit API tokens, PII, or sensitive data
- `transactions.csv` is gitignored because it contains donor names and zip codes
- The vite build only copies `donations*.csv` (not `transactions.csv`) to prevent accidental deployment of PII
- `GIVESMART_API_TOKEN` is stored as a GitHub secret, never in code
- The GitHub account uses 2FA and private email settings
- GitHub Issues are disabled to prevent abuse (the charity topic may attract negative attention)
