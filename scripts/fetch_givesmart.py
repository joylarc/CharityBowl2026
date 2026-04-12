#!/usr/bin/env python3
"""
Fetches donation transactions from the GiveSmart API and writes
donations.csv for the leaderboard.
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
DONATIONS_CSV_PATH = os.path.join(REPO_ROOT, "donations.csv")
TRANSACTIONS_CSV_PATH = os.path.join(REPO_ROOT, "transactions.csv")
CONFERENCES_PATH = os.path.join(REPO_ROOT, "conferences.txt")

# How long to wait for the async report (seconds)
REPORT_TIMEOUT = 600
REPORT_POLL_INTERVAL = 10


def load_conferences():
    """Load conferences.txt into a school -> conference lookup dict."""
    mapping = {}
    if not os.path.exists(CONFERENCES_PATH):
        return mapping
    current_conf = None
    with open(CONFERENCES_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                current_conf = None
                continue
            if current_conf is None:
                current_conf = line
            else:
                mapping[line.lower()] = current_conf
    return mapping


def compute_total(amount, frequency):
    """Compute total based on pledged amount and frequency."""
    if not frequency:
        return amount
    freq = frequency.strip().lower()
    if freq in ("one-time", "one time", "onetime", ""):
        return amount
    if freq == "monthly":
        return amount * 12
    if freq in ("quarterly", "every 3 months"):
        return amount * 4
    if freq in ("weekly", "every week"):
        return amount * 52
    if freq in ("annually", "yearly", "annual"):
        return amount
    # Unknown frequency — return the single amount
    return amount


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


def main():
    if not TOKEN:
        print("ERROR: GIVESMART_API_TOKEN environment variable not set", file=sys.stderr)
        sys.exit(1)

    # Load conference mapping
    conferences = load_conferences()
    print(f"Loaded {len(conferences)} conference mappings")

    # Fetch transactions
    transactions = fetch_transactions()

    # Aggregate by team and build transaction rows
    team_totals = {}
    txn_rows = []

    for txn in transactions:
        amount = parse_amount(txn.get("pledged_amount"))
        if amount <= 0:
            continue

        # Team name comes directly from the dropdown — no harmonization needed
        team = (txn.get("name_of_school/team_(dropdown)") or "").strip()
        if not team:
            continue

        # Build transaction row for detailed CSV
        frequency = (txn.get("frequency") or "").strip()
        total = compute_total(amount, frequency)

        team_totals[team] = team_totals.get(team, 0) + total
        conf = conferences.get(team.lower(), "")

        txn_rows.append({
            "transaction_date": txn.get("transaction_date", ""),
            "first_name": txn.get("first_name", ""),
            "last_name": txn.get("last_name", ""),
            "zip_code": txn.get("zip") or txn.get("zip_code") or txn.get("postal_code") or "",
            "frequency": frequency,
            "amount": f"{amount:.2f}",
            "total": f"{total:.2f}",
            "school_team": team,
            "conference": conf,
            "message": txn.get("message") or txn.get("comment") or "",
        })

    # Write donations.csv
    timestamp = datetime.now(timezone.utc).strftime("%m-%d-%Y %H:%M UTC")
    with open(DONATIONS_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        f.write(f'"{timestamp}"\n')
        for team, total in sorted(team_totals.items()):
            f.write(f'"{team}","{total}"\n')

    # Write transactions.csv
    txn_fields = [
        "transaction_date", "first_name", "last_name", "zip_code",
        "frequency", "amount", "total",
        "school_team", "conference", "message",
    ]
    with open(TRANSACTIONS_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=txn_fields)
        writer.writeheader()
        writer.writerows(txn_rows)

    # Summary
    print(f"\nResults:")
    print(f"  Teams on leaderboard: {len(team_totals)}")
    print(f"  Total raised: ${sum(team_totals.values()):,.2f}")
    print(f"  Transactions processed: {len(transactions)}")
    print(f"  Donations CSV written to: {DONATIONS_CSV_PATH}")
    print(f"  Transactions CSV written to: {TRANSACTIONS_CSV_PATH}")


if __name__ == "__main__":
    main()
