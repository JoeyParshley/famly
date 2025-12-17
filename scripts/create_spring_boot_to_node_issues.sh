#!/usr/bin/env bash
# Script to create GitHub issues from SPRING_BOOT_TO_NODE_ISSUES.md
# Usage: ./scripts/create_spring_boot_to_node_issues.sh [--dry-run]

source ~/.zshrc >/dev/null 2>&1 || true
set -euo pipefail

# --------------------- CONFIG & REQUIREMENTS -----------------------------------
# Requires: gh (logged in with 'project' scope), jq
# Environment (export these in ~/.zshrc):
#   GITHUB_USER="JoeyParshley"
#   REPO="famly"
#   PROJECT_ID="PVT_...."       # from `gh project list`

DRY_RUN="${DRY_RUN:-0}"

# Check for --dry-run flag
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

need() { command -v "$1" >/dev/null || { echo "❌ need $1"; exit 1; }; }
need gh
need jq

if [[ -z "${GITHUB_USER:-}" || -z "${REPO:-}" ]]; then
  echo "❌ Set GITHUB_USER and REPO in your shell (e.g., ~/.zshrc)."
  exit 1
fi

ISSUES_FILE="${ISSUES_FILE:-docs/SPRING_BOOT_TO_NODE_ISSUES.md}"

if [[ ! -f "$ISSUES_FILE" ]]; then
  echo "❌ Issues file not found: $ISSUES_FILE"
  exit 1
fi

echo "👤 Repo: $GITHUB_USER/$REPO"
echo "📄 Reading issues from: $ISSUES_FILE"
[[ "$DRY_RUN" == "1" ]] && echo "🧪 DRY RUN — no issues will be created."
echo ""

# ------------------------------------------------------------------------------
# Utility: create label if it doesn't exist
ensure_label() {
  local label="$1" color="${2:-0E8A16}" desc="${3:-}"
  local existing
  existing=$(gh label list --repo "$GITHUB_USER/$REPO" --json name --jq ".[] | select(.name == \"$label\") | .name" 2>/dev/null || echo "")
  if [[ -z "$existing" ]]; then
    echo "  📌 Creating label: $label"
    if [[ "$DRY_RUN" != "1" ]]; then
      gh label create "$label" --repo "$GITHUB_USER/$REPO" --color "$color" --description "$desc" >/dev/null 2>&1 || true
    fi
  fi
}

# Ensure all required labels exist
if [[ "$DRY_RUN" != "1" ]]; then
  echo "🏷️  Ensuring labels exist..."
  ensure_label "backend" "1F77B4" "Backend work"
  ensure_label "nestjs" "0E8A16" "NestJS related"
  ensure_label "api" "8C564B" "API endpoint work"
  ensure_label "auth" "D73A4A" "Authentication related"
  ensure_label "security" "B60205" "Security related"
  ensure_label "entity" "9467BD" "Database entity work"
  ensure_label "database" "D62728" "Database related"
  ensure_label "crud" "0E8A16" "CRUD operations"
  ensure_label "authorization" "D93F0B" "Authorization checks"
  ensure_label "pagination" "FBCA04" "Pagination"
  ensure_label "filtering" "FBCA04" "Filtering"
  ensure_label "calculations" "0052CC" "Calculations"
  ensure_label "infrastructure" "7057FF" "Infrastructure"
  ensure_label "error-handling" "B60205" "Error handling"
  ensure_label "documentation" "0075CA" "Documentation"
  ensure_label "swagger" "0075CA" "Swagger/OpenAPI"
  ensure_label "validation" "D93F0B" "Input validation"
  ensure_label "testing" "7F7F7F" "Testing related"
  ensure_label "integration-tests" "7F7F7F" "Integration tests"
  ensure_label "cleanup" "EDEDED" "Cleanup tasks"
  ensure_label "migration" "EDEDED" "Migration related"
  echo ""
fi

# ------------------------------------------------------------------------------
# Function to create an issue
create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  
  echo "📝 Creating: $title"
  
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "   🧪 Would create with labels: $labels"
    echo ""
    return
  fi
  
  # Check if issue already exists
  local existing=$(gh issue list --repo "$GITHUB_USER/$REPO" --state open --json number,title --jq ".[] | select(.title == \"$title\") | .number" | head -1)
  
  if [[ -n "$existing" ]]; then
    echo "   🔁 Already exists: #$existing"
    echo ""
    return
  fi
  
  # Create the issue
  local issue_url=$(gh issue create \
    --repo "$GITHUB_USER/$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    | tr -d '\r')
  
  if [[ -n "$issue_url" ]]; then
    local issue_num="${issue_url##*/}"
    echo "   ✅ Created: #$issue_num"
    
    # Add to project if PROJECT_ID is set
    if [[ -n "${PROJECT_ID:-}" ]]; then
      local issue_id=$(gh api graphql \
        -F owner="$GITHUB_USER" \
        -F repo="$REPO" \
        -F number="$issue_num" \
        -f query='
          query($owner:String!, $repo:String!, $number:Int!){
            repository(owner:$owner, name:$repo){
              issue(number:$number){ id }
            }
          }' | jq -r '.data.repository.issue.id')
      
      if [[ -n "$issue_id" ]]; then
        gh api graphql -F projectId="$PROJECT_ID" -F contentId="$issue_id" -f query='
          mutation($projectId:ID!, $contentId:ID!) {
            addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
              item { id }
            }
          }' >/dev/null 2>&1 && echo "   ✅ Added to project"
      fi
    fi
  else
    echo "   ❌ Failed to create"
  fi
  echo ""
}

# ------------------------------------------------------------------------------
# Parse issues from markdown file
parse_and_create_issues() {
  local in_issue=false
  local current_title=""
  local current_body=""
  local current_labels=""
  local in_description=false
  local in_code_block=false
  local description_content=""
  
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Check if we're starting a new issue
    if [[ "$line" =~ ^####\ Issue\ [0-9]+: ]]; then
      # Save previous issue if exists
      if [[ "$in_issue" == true && -n "$current_title" ]]; then
        create_issue "$current_title" "$current_body" "$current_labels"
      fi
      
      # Start new issue
      in_issue=true
      current_title=""
      current_body=""
      current_labels=""
      in_description=false
      in_code_block=false
      description_content=""
      continue
    fi
    
    # Extract title
    if [[ "$line" =~ ^\*\*Title:\*\*\ \`(.+)\` ]]; then
      current_title="${BASH_REMATCH[1]}"
      continue
    fi
    
    # Start of description section
    if [[ "$line" =~ ^\*\*Description:\*\* ]]; then
      in_description=true
      description_content=""
      continue
    fi
    
    # Start of markdown code block
    if [[ "$line" =~ ^\`\`\`markdown ]]; then
      in_code_block=true
      continue
    fi
    
    # End of markdown code block
    if [[ "$line" =~ ^\`\`\`$ ]] && [[ "$in_code_block" == true ]]; then
      in_code_block=false
      in_description=false
      # Trim trailing newlines
      current_body="${description_content%$'\n'}"
      continue
    fi
    
    # Extract labels (format: `label1`, `label2`, `label3`)
    if [[ "$line" =~ ^\*\*Labels:\*\*\ (.+) ]]; then
      # Extract the labels part and remove all backticks
      local labels_raw="${BASH_REMATCH[1]}"
      # Remove backticks and split by comma, then clean each label
      current_labels=$(echo "$labels_raw" | sed 's/`//g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/,[[:space:]]*/,/g')
      continue
    fi
    
    # Collect description content (inside code block)
    if [[ "$in_code_block" == true ]]; then
      description_content+="$line"$'\n'
    fi
  done < "$ISSUES_FILE"
  
  # Don't forget the last issue
  if [[ "$in_issue" == true && -n "$current_title" ]]; then
    create_issue "$current_title" "$current_body" "$current_labels"
  fi
}

# ------------------------------------------------------------------------------
# Main execution
echo "🚀 Parsing issues from markdown file..."
echo ""

parse_and_create_issues

echo "✅ Done! All issues have been processed."
