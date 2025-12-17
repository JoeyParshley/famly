#!/bin/bash
# Script to pause all Spring Boot related issues in GitHub Project
# Usage: ./scripts/pause_spring_boot_issues.sh

set -e

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) is not installed. Install it first: brew install gh"
  exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
  echo "❌ Not authenticated with GitHub. Run: gh auth login"
  exit 1
fi

# Get repo info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [[ -z "$REPO" ]]; then
  echo "❌ Could not determine repository. Make sure you're in the famly repo directory."
  exit 1
fi

echo "📋 Finding Spring Boot related issues in $REPO..."

# Get all open issues
ISSUES=$(gh issue list --repo "$REPO" --state open --json number,title,labels --jq '.[] | select(.labels[].name | contains("backend-spring") or contains("spring") or contains("Spring Boot") or contains("java") or (test("(?i)spring"; "g"))) | {number: .number, title: .title, labels: [.labels[].name]}')

if [[ -z "$ISSUES" ]]; then
  echo "✅ No Spring Boot issues found to pause."
  exit 0
fi

echo "Found Spring Boot issues:"
echo "$ISSUES" | jq -r '. | "  #\(.number): \(.title)"'

# Ask for confirmation
read -p "Do you want to pause these issues? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

# Pause issues by adding a label or moving to a "Paused" status
# Option 1: Add a "paused" label
echo "Adding 'paused' label to Spring Boot issues..."

echo "$ISSUES" | jq -r '.number' | while read -r issue_num; do
  echo "  Pausing issue #$issue_num..."
  gh issue edit "$issue_num" --add-label "paused" --repo "$REPO" 2>/dev/null || echo "    ⚠️  Could not update issue #$issue_num"
done

echo ""
echo "✅ Spring Boot issues have been paused (labeled as 'paused')."
echo ""
echo "To unpause later, run:"
echo "  gh issue list --label paused --json number | jq -r '.[].number' | xargs -I {} gh issue edit {} --remove-label paused"

