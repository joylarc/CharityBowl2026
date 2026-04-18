# CharityBowl 2026 — Agent Guide

## What This Project Is

A live donation leaderboard for the **CharitiBundi Bowl**, a college football charity fundraising event benefiting **New American Pathways**, an Atlanta-based refugee resettlement nonprofit. Donors contribute through GiveSmart in the name of college football teams over 7-10 days. The website shows real-time donation totals per team, updated automatically every 15 minutes during the event.

Two sites are deployed from this repo:
- **moneycannon.org** — the leaderboard site (via Cloudflare Pages, project `2026moneycannon`)
- **www.edsbscharitybowl.com** — the donation landing page (via Cloudflare Pages, project `2026edsbs`)

## Architecture

```
Every 15 minutes (during event):
  GitHub Actions (scheduled workflow)
      |
      v
  Python script (scripts/fetch_givesmart.py)
      |-- Calls GiveSmart Transactions API (async 2-step pattern)
      |-- Team name taken directly from dropdown (no harmonization needed)
      |-- Merges manual_additions.csv (offline gifts, corporate matches)
      |-- Writes donations.csv (leaderboard data)
      |-- Writes transactions.csv (detailed per-transaction data, NOT deployed)
      |-- Writes stats.json (unique donor count)
      v
  Vite builds the React app (yarn build)
      |
      v
  Deploys to two Cloudflare Pages projects:
    - moneycannon.org (leaderboard, about, teams, 2025 results)
    - edsbscharitybowl.com (landing page, FAQ, impact report)
```

The frontend is a React + TypeScript + Vite + MUI app. It reads `donations.csv` at page load and renders the leaderboard client-side. There is no backend server — the site is entirely static files.

## Hosting & Domain

- **Cloudflare Pages** serves both sites from the `dist/` folder (two projects, one build)
- **Base path:** `/` in vite.config.ts
- The deploy workflow builds once, then creates separate distributions for each domain
- All asset references use `import.meta.env.BASE_URL + "filename"` for base path compatibility

### DNS Configuration

**moneycannon.org** (managed at Gandi.net):
- `www` CNAME → `2026moneycannon.pages.dev.`
- Apex domain forwarding configured at Gandi

**edsbscharitybowl.com** (managed at GoDaddy):
- `www` CNAME → `2026edsbs.pages.dev`
- Apex domain forwarding → `www.edsbscharitybowl.com` (permanent 301)
- **Known limitation:** GoDaddy forwarding does not preserve subpage paths — always share links with `www.` prefix

## Multi-Page App Structure

The site has multiple HTML entry points, each with its own React root and theme:

| Page | Domain | Entry HTML | Entry TSX | Component | Font |
|------|--------|-----------|-----------|-----------|------|
| Main (leaderboard + pre-event) | moneycannon.org | `index.html` | `src/main.tsx` | `src/App.tsx` | Roboto |
| About Money Cannon | moneycannon.org/about.html | `about.html` | `src/aboutEntry.tsx` | `src/AboutPage.tsx` | Montserrat |
| Eligible teams | moneycannon.org/teams.html | `teams.html` | `src/schoolsEntry.tsx` | `src/SchoolsPage.tsx` | Montserrat |
| 2025 results | moneycannon.org/results2025.html | `results2025.html` | `src/results2025entry.tsx` | `src/Results2025.tsx` | Roboto |
| Landing page | edsbscharitybowl.com | `testreplacement.html` | `src/landingEntry.tsx` | `src/LandingPage.tsx` | Montserrat |
| Game Guide & FAQ | edsbscharitybowl.com/faq.html | `faq.html` | `src/faqEntry.tsx` | `src/FaqPage.tsx` | Montserrat |

Info page (`info.html` / `src/InfoPage.tsx`) has been removed from the build but source files remain for reference.

Vite is configured with multiple `rollupOptions.input` entries in `vite.config.ts` to build all pages.

## Design Decisions

### Fonts
- **Leaderboard / main app / 2025 results:** Roboto (MUI default)
- **Pre-event page, landing page, FAQ, about, teams:** Montserrat — applied via scoped `ThemeProvider` or per-entry-point theme. NOT applied globally to avoid affecting the leaderboard.
- **Landing page (edsbscharitybowl.com):** Montserrat with 0.1em letter-spacing on headings

### Color Palette
- **Primary:** Cyan (#00feff) — used for header backgrounds, accents, dividers. NOTE: This is #00feff NOT #00ffff. All logos must have ICC profiles stripped to match this color exactly.
- **Pre-event page:** Full cyan background (#00feff) with black text, black buttons with cyan text
- **Landing page (edsbscharitybowl.com):** Dark theme (#333/#444 backgrounds), green (#6ab648) buttons and accents, blue (#1a73e8) links, #326295 nav bar
- **About/FAQ/Teams pages:** Cyan header bar, white body, blue (#1a73e8) links
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
│   ├── deploy.yml                # Builds + deploys to both Cloudflare Pages projects
│   └── daily-export.yml          # 3 PM ET daily: fetches data, uploads transactions.csv artifact
├── scripts/
│   └── fetch_givesmart.py        # GiveSmart API -> donations.csv + transactions.csv + stats.json
├── archive/
│   ├── harmonization.csv         # 2025 team name mapping (1,877 rows) — kept for rollback
│   ├── manual_additions.json     # 2025 manual additions format — kept for rollback
│   └── unmapped.json             # 2025 unmapped write-ins — kept for rollback
├── src/
│   ├── App.tsx                   # Main app: header, search, tab routing, auto PRE_EVENT gate
│   ├── PreEvent.tsx              # Pre-event landing page with countdown (Montserrat font)
│   ├── LandingPage.tsx           # edsbscharitybowl.com landing page with progress tracker
│   ├── FaqPage.tsx               # Game Guide & FAQ page
│   ├── AboutPage.tsx             # About Money Cannon FAQ
│   ├── SchoolsPage.tsx           # Eligible teams list (3 columns)
│   ├── InfoPage.tsx              # (removed from build, source kept for reference)
│   ├── Results2025.tsx           # 2025 final standings (frozen data)
│   ├── Leaderboard.tsx           # Ranked table of all teams
│   ├── Rivalries.tsx             # Predefined rivalry/conference matchups
│   ├── HeadToHead.tsx            # Custom team comparison tool (short numeric URLs)
│   ├── Navigation.tsx            # Tab bar (desktop) / bottom nav (mobile)
│   ├── StripedTableRow.tsx       # Alternating row styling
│   ├── state.ts                  # Data loading: donations.csv, rivalries.txt, conferences.txt, schools.txt
│   ├── constants.ts              # PRE_EVENT and LIGHTS_OUT flags
│   ├── main.tsx                  # Main entry point (Roboto, leaderboard theme)
│   ├── landingEntry.tsx           # Landing page entry point (Montserrat, dark theme)
│   ├── faqEntry.tsx              # FAQ entry point (Montserrat theme)
│   ├── aboutEntry.tsx            # About entry point (Montserrat theme)
│   ├── schoolsEntry.tsx          # Teams page entry point (Montserrat theme)
│   └── results2025entry.tsx      # 2025 results entry point (Roboto, leaderboard theme)
├── donations.csv                 # Zeroed pre-event; auto-generated during event
├── donations-2025.csv            # Frozen 2025 final data (not regenerated)
├── transactions.csv              # Auto-generated: detailed per-transaction data (GITIGNORED — contains PII)
├── stats.json                    # Auto-generated: unique donor count
├── manual_additions.csv          # Offline gifts and corporate matches (manually maintained)
├── schools.txt                   # Master list of eligible teams (append-only for URL stability)
├── rivalries.txt                 # Rivalry groupings (name + school list, blank-line separated)
├── conferences.txt               # Conference groupings (same format as rivalries.txt)
├── index.html                    # Main Vite entry point
├── testreplacement.html          # Landing page entry point (becomes index.html on edsbs deploy)
├── about.html                    # About Money Cannon entry point
├── teams.html                    # Eligible teams entry point
├── faq.html                      # FAQ entry point
├── results2025.html              # 2025 results entry point
├── vite.config.ts                # Vite config: multiple entry points, copies data files to dist/
├── package.json                  # Dependencies: React 19, MUI v7, Vite
└── public/
    ├── logo.png                  # 2026 event logo (ICC profile stripped, #00feff background)
    ├── nap-logo-white.png        # New American Pathways white logo (landing page nav/footer)
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
| `name_of_school/team_(dropdown)` | Dropdown selection — used directly as team name (canonical, ~150 schools) |
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

For 2026, the GiveSmart campaign uses a fixed dropdown of ~150 schools with no write-in option. The dropdown value is used directly as the team name — no harmonization step is needed.

If the dropdown is empty/null, the transaction is skipped (no team).

> **Rollback note:** The 2025 pipeline with harmonization, write-in handling, and unmapped tracking is archived in `archive/` and fully documented in the Claude memory file `project_2025_data_pipeline.md`.

### Conference Lookup
The script reads `conferences.txt` to build a school-to-conference mapping. For each transaction, it looks up the conference for the team. This is used in the transactions CSV output.

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
| `school_team` | Team name from GiveSmart dropdown |
| `conference` | Conference from conferences.txt |
| `message` | Donor message/comment |

### donations-2025.csv (static, deployed to site)
Frozen final data from the 2025 event. Used by the 2025 results page. Not regenerated by the script.

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
- Data is loaded once via React Suspense, no client-side auto-refresh (the whole site is rebuilt every 15 min by GitHub Actions)

### URL Parameters
- `?mode=live` — bypasses `PRE_EVENT` flag, shows leaderboard even before go-live (for testing)
- `?q=<search>` — persists search query across tab navigation
- `?t=<tab>` — persists tab selection (leaderboard, rivalries, conferences, head-to-head)
- `?c=<ids>` — persists head-to-head team selections (numeric IDs from schools.txt line positions; old pipe-separated name format also supported for backwards compatibility)

## GitHub Actions Workflows

### deploy.yml (on push to main + scheduled during event)
- Cron schedule is **commented out** until go-live — uncomment when the event starts
- API fetch step is also **commented out** until go-live
- Also has `workflow_dispatch` for manual triggering
- Builds once, then creates separate distributions for moneycannon and edsbs
- **CRITICAL:** The `if: schedule` guards on the API fetch step have been accidentally removed multiple times by external edits. Always verify these guards are present after any workflow changes.

### daily-export.yml (3 PM ET daily)
- Fetches GiveSmart data + merges manual_additions.csv
- Uploads `transactions.csv` as a GitHub Actions artifact (timestamped in ET)
- For social media team to review donor messages, names, etc.

## Go-Live Checklist (April 20, 10 AM ET)

1. Uncomment the cron schedule AND the API fetch step in `.github/workflows/deploy.yml` and push
2. Re-enable donate buttons on edsbscharitybowl.com: restore GiveSmart href on all `GreenButton` instances in `src/LandingPage.tsx` and change text back to "Donate"
3. Reactivate the campaign keyword in GiveSmart
4. PRE_EVENT auto-switches to leaderboard at 10 AM ET April 20 — no code change needed (manual override: set `PRE_EVENT = false` in `src/constants.ts`)

## During the Event

- **Manual additions**: Add offline gifts and corporate matches to `manual_additions.csv` and push — they merge into leaderboard totals on the next API run
- **"Lights out" mode**: Set `LIGHTS_OUT = true` in `src/constants.ts` to hide scores and show a dialog — confirm dialog text and timing before activating
- **Daily export**: `transactions.csv` available as GitHub Actions artifact daily at 3 PM ET

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
