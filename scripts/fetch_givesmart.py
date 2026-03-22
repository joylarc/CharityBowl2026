#!/usr/bin/env python3
"""
Fetches donation transactions from the GiveSmart API, resolves team names
using the harmonization CSV, and writes donations.csv for the leaderboard.
"""

import csv
import json
import os
import sys
import time
from datetime import datetime, timezone

import subprocess

# --- Configuration ---
API_BASE = "https://fundraise.givesmart.com/api/v2"
CAMPAIGN = os.environ.get("GIVESMART_CAMPAIGN", "Charity Bowl 2025")
TOKEN = os.environ.get("GIVESMART_API_TOKEN", "")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
HARMONIZATION_PATH = os.path.join(REPO_ROOT, "data", "harmonization.csv")
MANUAL_ADDITIONS_PATH = os.path.join(REPO_ROOT, "data", "manual_additions.json")
DONATIONS_CSV_PATH = os.path.join(REPO_ROOT, "donations.csv")
UNMAPPED_JSON_PATH = os.path.join(REPO_ROOT, "unmapped.json")

# How long to wait for the async report (seconds)
REPORT_TIMEOUT = 600
REPORT_POLL_INTERVAL = 10


def get_headers():
    return {
        "Authorization": f'Token token="{TOKEN}"',
        "Accept": "application/json",
        "Content-type": "application/json",
    }


def load_harmonization():
    """Load the harmonization CSV into a case-insensitive lookup dict."""
    mapping = {}
    with open(HARMONIZATION_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw = row["Name Of School/Team"].strip()
            harmonized = row["Harmonized Name"].strip()
            if raw and harmonized:
                mapping[raw.lower()] = harmonized
    return mapping


def load_manual_additions():
    """Load manual additions JSON file."""
    if not os.path.exists(MANUAL_ADDITIONS_PATH):
        return []
    with open(MANUAL_ADDITIONS_PATH, encoding="utf-8") as f:
        return json.load(f)


def api_get(url, params=None):
    """Make a GET request to the GiveSmart API using curl."""
    if params:
        from urllib.parse import urlencode
        url = f"{url}?{urlencode(params)}"
    result = subprocess.run(
        [
            "curl", "-s", "--fail-with-body",
            "-H", f'Authorization: Token token="{TOKEN}"',
            "-H", "Accept: application/json",
            "-H", "Content-type: application/json",
            url,
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"curl error (exit {result.returncode}): {result.stderr}", file=sys.stderr)
        print(f"URL: {url}", file=sys.stderr)
        sys.exit(1)
    return result.stdout


def fetch_transactions():
    """Fetch all transactions from GiveSmart using the async report pattern."""
    print(f"Requesting transactions for campaign: {CAMPAIGN}")
    text = api_get(
        f"{API_BASE}/reports/transactions.json",
        {"campaign": CAMPAIGN, "status": "collected,pending"},
    )
    report_id = json.loads(text)["id"]
    print(f"Report ID: {report_id}")

    # Poll for results
    start = time.time()
    while time.time() - start < REPORT_TIMEOUT:
        print(f"Polling for results... ({int(time.time() - start)}s elapsed)")
        text = api_get(f"{API_BASE}/reports/results.json", {"id": report_id})
        text = text.strip()

        # Check if still processing
        if text.startswith("Request#") and "not yet complete" in text:
            time.sleep(REPORT_POLL_INTERVAL)
            continue

        # Check for empty result
        if text == "[]":
            print("Warning: empty result set returned")
            return []

        data = json.loads(text)
        if isinstance(data, list):
            print(f"Received {len(data)} transactions")
            return data

        # Unexpected response
        print(f"Unexpected response: {text[:200]}")
        time.sleep(REPORT_POLL_INTERVAL)

    print("ERROR: Timed out waiting for report", file=sys.stderr)
    sys.exit(1)


def parse_amount(amount_str):
    """Parse a dollar amount string like '$100.00' into a float."""
    if not amount_str:
        return 0.0
    return float(amount_str.replace("$", "").replace(",", ""))


def resolve_team(transaction, harmonization):
    """
    Resolve the team name for a transaction.
    Returns (canonical_name, None) on success,
    or (None, unmapped_entry_dict) if unmapped,
    or (None, None) if no team selected.
    """
    dropdown = (transaction.get("name_of_school/team_(dropdown)") or "").strip()

    # No team selected (offline/corporate match)
    if not dropdown:
        return None, None

    # Write-in entry
    if dropdown.upper() == "OTHER - WRITE IN":
        manual_entry = (transaction.get("name_of_school/team_(manualentry)") or "").strip()
        if not manual_entry:
            return None, None

        canonical = harmonization.get(manual_entry.lower())
        if canonical:
            return canonical, None

        # Unmapped write-in
        return None, {
            "write_in": manual_entry,
            "amount": transaction.get("pledged_amount", "$0"),
            "date": transaction.get("transaction_date", ""),
            "donor": f"{transaction.get('first_name', '')} {transaction.get('last_name', '')}".strip(),
        }

    # Dropdown selection — look up in harmonization
    canonical = harmonization.get(dropdown.lower())
    if canonical:
        return canonical, None

    # Dropdown value not in harmonization (shouldn't happen, but handle it)
    # Use the dropdown value as-is
    return dropdown, None


def main():
    if not TOKEN:
        print("ERROR: GIVESMART_API_TOKEN environment variable not set", file=sys.stderr)
        sys.exit(1)

    # Load harmonization mapping
    harmonization = load_harmonization()
    print(f"Loaded {len(harmonization)} harmonization mappings")

    # Load manual additions
    manual_additions = load_manual_additions()
    print(f"Loaded {len(manual_additions)} manual additions")

    # Fetch transactions
    transactions = fetch_transactions()

    # Aggregate by team
    team_totals = {}
    unmapped = []
    skipped_no_team = 0
    skipped_unmapped = 0

    for txn in transactions:
        amount = parse_amount(txn.get("pledged_amount"))
        if amount <= 0:
            continue

        team, unmapped_entry = resolve_team(txn, harmonization)

        if team:
            team_totals[team] = team_totals.get(team, 0) + amount
        elif unmapped_entry:
            unmapped.append(unmapped_entry)
            skipped_unmapped += 1
        else:
            skipped_no_team += 1

    # Apply manual additions
    for addition in manual_additions:
        team = addition.get("team", "").strip()
        amount = addition.get("amount", 0)
        if team and amount > 0:
            team_totals[team] = team_totals.get(team, 0) + amount

    # Write donations.csv
    timestamp = datetime.now(timezone.utc).strftime("%m-%d-%Y %H:%M UTC")
    with open(DONATIONS_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        f.write(f'"{timestamp}"\n')
        for team, total in sorted(team_totals.items()):
            f.write(f'"{team}","{total}"\n')

    # Write unmapped.json
    with open(UNMAPPED_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(unmapped, f, indent=2)

    # Summary
    print(f"\nResults:")
    print(f"  Teams on leaderboard: {len(team_totals)}")
    print(f"  Total raised: ${sum(team_totals.values()):,.2f}")
    print(f"  Transactions processed: {len(transactions)}")
    print(f"  Skipped (no team): {skipped_no_team}")
    print(f"  Skipped (unmapped write-in): {skipped_unmapped}")
    print(f"  Unmapped entries written to: {UNMAPPED_JSON_PATH}")
    print(f"  Donations CSV written to: {DONATIONS_CSV_PATH}")


if __name__ == "__main__":
    main()
