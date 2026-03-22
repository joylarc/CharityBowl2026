# Donation Leaderboard Website — Design

## Overview
A public-facing website that shows donation totals per college football team, pulling data from GiveSmart. The site is static (just files, no server) and a scheduled process automatically refreshes the data every 5 minutes.

## Architecture

```
Every 5 minutes:
  GitHub Actions (scheduled job)
      ↓
  Python script fetches transactions from GiveSmart API
      ↓
  Aggregates totals by "Name of School/Team" custom field
      ↓
  Writes data.json
      ↓
  Commits & pushes to GitHub Pages
      ↓
  Static site serves updated data (no server needed)
```

## Why Static
- Extremely reliable — just files, nothing to crash
- Free hosting via GitHub Pages
- No server to maintain or monitor
- If the update script fails, the site just shows the last good data
- Familiar model (like the previous manually-updated static site, but automated)

## Tech Stack
- **Plain HTML + CSS + vanilla JavaScript** — no frameworks, easy to modify
- **GitHub Pages** — free, reliable static site hosting
- **GitHub Actions** — free scheduled task runner (every 5 minutes)
- **Python** — script that fetches from GiveSmart and generates the data file

## File Structure

```
donation-leaderboard/
├── .github/
│   └── workflows/
│       └── update-data.yml     # Scheduled GitHub Action (runs every 5 min)
├── scripts/
│   ├── fetch_givesmart.py      # Calls GiveSmart API, aggregates by team
│   └── teams.py                # Team name normalization mapping
├── docs/                       # GitHub Pages serves from this folder
│   ├── index.html              # The leaderboard page
│   ├── styles.css              # Styling
│   ├── script.js               # Loads data.json and renders the leaderboard
│   └── data.json               # Auto-generated donation totals
└── README.md
```

## How It Works

### Data Flow
1. GitHub Actions runs `scripts/fetch_givesmart.py` every 5 minutes
2. The script calls the GiveSmart Transactions API (async 2-step: request report → fetch results)
3. It reads the "Name of School/Team" custom field from each transaction
4. It normalizes team names (e.g., "Bama" → "Alabama Crimson Tide") using a configurable mapping
5. It sums up `Collected Amount` per team and sorts by total
6. It writes `docs/data.json` with the leaderboard data and a timestamp
7. If data.json changed, the Action commits and pushes it
8. GitHub Pages automatically serves the updated file

### The Website
- On page load, `script.js` fetches `data.json`
- Renders a leaderboard: rank, team name, total raised, donation count
- Shows a "Last updated" timestamp
- Responsive — works on phone, desktop, and large screens/TVs

### Security
- GiveSmart API token stored as a GitHub repository secret (never in code)
- The token is only used in the GitHub Action, never exposed to the browser

## Setup Steps
1. Create a GitHub account (free) if you don't have one
2. Create a new repository and push the code
3. In repo Settings → Pages: enable GitHub Pages, source = `docs/` folder
4. In repo Settings → Secrets: add `GIVESMART_API_TOKEN` with your API key
5. Site goes live at `https://yourusername.github.io/repo-name/`
6. Optionally connect a custom domain
