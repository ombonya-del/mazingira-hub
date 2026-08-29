#!/usr/bin/env bash
# Re-arm the dormant GitHub Actions scanners across the CMT projects.
#
# GitHub auto-DISABLES a scheduled workflow after 60 days with no repo activity.
# An empty commit does NOT wake an already-disabled one — you must re-enable it.
# This script re-enables every scheduled workflow and gives each a first manual run.
#
# Requires the GitHub CLI, authenticated:  gh auth login
# Run it from your Mac (it uses your GitHub credentials).  bash rearm-github-scanners.sh
set -uo pipefail

# repo path  ->  scheduled workflow files to re-enable
run_repo () {
  local dir="$1"; shift
  echo
  echo "================================================================"
  echo "  $dir"
  echo "================================================================"
  if [ ! -d "$dir/.git" ]; then echo "  (skip — no git repo here)"; return; fi
  cd "$dir" || return
  for wf in "$@"; do
    echo "-- $wf"
    gh workflow enable "$wf"      2>&1 | sed 's/^/   enable: /'
    gh workflow run    "$wf"      2>&1 | sed 's/^/   run:    /'
  done
  cd - >/dev/null || true
}

run_repo "$HOME/femsaidiakenya"      intel-pipeline.yml
run_repo "$HOME/imaarisha-srhr-hub"  radar.yml imara-scanner.yml opportunity-scanner.yml resource-scanner.yml ingest-resources.yml
# Nairobi 2055's pages.yml deploys on push and needs no re-arming.

echo
echo "Done. Check each repo's Actions tab — the workflows should show as enabled with a green run."
echo "Note: intel-pipeline runs rss-scanner/health-check/intel-brief on their own crons;"
echo "the manual run above triggers the default (rss+health). Use the Actions 'Run workflow'"
echo "button with target=intel-brief if you want to force a brief draft now."
