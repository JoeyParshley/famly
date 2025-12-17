#!/usr/bin/env bash
# Script to create GitHub issues for NestJS backend work from the plan
# Usage: ./scripts/create_nestjs_issues.sh [--dry-run]

source ~/.zshrc >/dev/null 2>&1 || true
set -euo pipefail

# --------------------- CONFIG & REQUIREMENTS -----------------------------------
# Requires: gh (logged in with 'project' scope), jq
# Environment (export these in ~/.zshrc):
#   GITHUB_USER="JoeyParshley"
#   REPO="famly"
#   PROJECT_ID="PVT_...."       # from `gh project list`

PLAN_FILE=".cursor/plans/nestjs_backend_conversion_c727fc5b.plan.md"
DRY_RUN="${DRY_RUN:-0}"

# Check for --dry-run flag
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

need() { command -v "$1" >/dev/null || { echo "❌ need $1"; exit 1; }; }
need gh
need jq

if [[ -z "${GITHUB_USER:-}" || -z "${REPO:-}" || -z "${PROJECT_ID:-}" ]]; then
  echo "❌ Set GITHUB_USER, REPO, PROJECT_ID in your shell (e.g., ~/.zshrc)."
  exit 1
fi

if [[ ! -f "$PLAN_FILE" ]]; then
  echo "❌ Plan file not found: $PLAN_FILE"
  echo "   Looking for plan file in current directory or .cursor/plans/"
  exit 1
fi

echo "📄 Using plan file: $PLAN_FILE"
echo "👤 Repo: $GITHUB_USER/$REPO"
echo "📈 Project ID: $PROJECT_ID"
[[ "$DRY_RUN" == "1" ]] && echo "🧪 DRY RUN — no issues will be created."
echo ""

# ------------------------------------------------------------------------------
# Utility: create label if it doesn't exist
ensure_label() {
  local label="$1" color="${2:-0E8A16}" desc="${3:-NestJS backend label}"
  local existing
  existing=$(gh label list --repo "$GITHUB_USER/$REPO" --json name --jq ".[] | select(.name == \"$label\") | .name" 2>/dev/null || echo "")
  if [[ -z "$existing" ]]; then
    echo "  📌 Creating label: $label"
    gh label create "$label" --repo "$GITHUB_USER/$REPO" --color "$color" --description "$desc" >/dev/null 2>&1 || true
  fi
}

# Ensure backend-nestjs label exists
if [[ "$DRY_RUN" != "1" ]]; then
  ensure_label "backend-nestjs" "0E8A16" "NestJS backend work"
  ensure_label "nestjs" "0E8A16" "NestJS related"
  ensure_label "nodejs" "339933" "Node.js related"
fi

# ------------------------------------------------------------------------------
# Get project Status field and Backlog option
discover_status_ids() {
  local FIELDS_JSON
  FIELDS_JSON=$(gh api graphql -F projectId="$PROJECT_ID" -f query='
    query($projectId:ID!){
      node(id:$projectId){
        ... on ProjectV2 {
          fields(first: 50) {
            nodes {
              __typename
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name }
              }
            }
          }
        }
      }
    }') || { echo "❌ Could not read project fields"; return 1; }

  STATUS_FIELD_ID=$(echo "$FIELDS_JSON" \
    | jq -r '.data.node.fields.nodes[]
            | select(.name? != null)
            | select((.name|ascii_downcase) == "status")
            | .id // empty')

  if [[ -z "$STATUS_FIELD_ID" ]]; then
    echo "⚠️  No 'Status' field found on this project."
    return 1
  fi

  BACKLOG_OPTION_ID=$(echo "$FIELDS_JSON" \
    | jq -r --arg fid "$STATUS_FIELD_ID" '
        .data.node.fields.nodes[]
        | select(.id == $fid)
        | .options[]?
        | select((.name|ascii_downcase) == "backlog")
        | .id // empty')

  if [[ -z "$BACKLOG_OPTION_ID" ]]; then
    echo "⚠️  The 'Status' field does not have a 'Backlog' option."
    return 1
  fi
}

# ------------------------------------------------------------------------------
# Get or add project item for an issue
get_or_add_project_item_id() {
  local issue_id="$1"
  
  local existing_item=$(gh api graphql -f query='
    query($issueId:ID!, $projectId:ID!){
      node(id:$issueId){
        ... on Issue{
          projectItems(first:50, includeArchived:false){
            nodes{
              id
              project{id}
            }
          }
        }
      }
    }' -f issueId="$issue_id" -f projectId="$PROJECT_ID" | jq -r --arg pid "$PROJECT_ID" '
      .data.node.projectItems.nodes[]?
      | select(.project.id == $pid)
      | .id
    ' | head -1)
  
  if [[ -n "$existing_item" ]]; then
    echo "$existing_item"
    return
  fi
  
  local add_json=$(gh api graphql -F projectId="$PROJECT_ID" -F contentId="$issue_id" -f query='
    mutation($projectId:ID!, $contentId:ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item { id }
      }
    }' 2>/dev/null)
  
  local item_id=$(echo "$add_json" | jq -r '.data.addProjectV2ItemById.item.id // empty')
  echo "$item_id"
}

# ------------------------------------------------------------------------------
# Set status to Backlog
set_status_backlog() {
  local item_id="$1"
  [[ -z "$item_id" ]] && return
  
  gh api graphql -F projectId="$PROJECT_ID" -F itemId="$item_id" -F fieldId="$STATUS_FIELD_ID" -F optionId="$BACKLOG_OPTION_ID" -f query='
    mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $optionId:String!){
      updateProjectV2ItemFieldValue(
        input: {
          projectId: $projectId,
          itemId: $itemId,
          fieldId: $fieldId,
          value: { singleSelectOptionId: $optionId }
        }
      ) { projectV2Item { id } }
    }' >/dev/null 2>&1 || true
}

# ------------------------------------------------------------------------------
# Find existing issue by title
find_open_issue_by_title() {
  local search_title="$1"
  gh issue list --repo "$GITHUB_USER/$REPO" --state open --json number,title,id,url --jq ".[] | select(.title == \"$search_title\")" | head -1
}

# ------------------------------------------------------------------------------
# Warm up field ids (fail early if missing) unless DRY_RUN
if [[ "$DRY_RUN" != "1" ]]; then
  discover_status_ids || exit 1
fi

# ------------------------------------------------------------------------------
# Parse the plan file and extract todos
echo "📋 Parsing plan file for todos..."
echo ""

# Extract todos using awk - find lines with "id:" and "content:" in the YAML frontmatter
# Process the file to extract todo id and content pairs
process_todo() {
  local todo_id="$1"
  local content_line="$2"
  
  # Create issue title from content
  local issue_title="$content_line"
  
  echo "📝 Todo: $issue_title"
  
  # Check if issue already exists
  local match_json="$(find_open_issue_by_title "$issue_title")"
  
  if [[ -n "$match_json" ]]; then
    local issue_url="$(echo "$match_json" | jq -r '.url')"
    local issue_id="$(echo "$match_json" | jq -r '.id')"
    local issue_num="$(echo "$match_json" | jq -r '.number')"
    echo "   🔁 already exists → $issue_url"
    
    if [[ "$DRY_RUN" != "1" ]]; then
      # Ensure labels
      gh issue edit "$issue_num" --repo "$GITHUB_USER/$REPO" --add-label "backend-nestjs" --add-label "nestjs" >/dev/null 2>&1 || true
      # Ensure on project and set Status=Backlog
      local item_id="$(get_or_add_project_item_id "$issue_id")"
      set_status_backlog "$item_id"
    fi
  else
    if [[ "$DRY_RUN" == "1" ]]; then
      echo "   🧪 would create new issue with labels: backend-nestjs, nestjs"
      return
    fi
    
    # Create new issue
    local issue_body="Auto-created from NestJS backend conversion plan.

**Todo ID:** \`$todo_id\`

This is part of the NestJS backend implementation work."
    
    local new_issue_url="$(
      gh issue create \
        --repo "$GITHUB_USER/$REPO" \
        --title "$issue_title" \
        --body "$issue_body" \
        --label "backend-nestjs" \
        --label "nestjs" \
        --label "nodejs" \
        | tr -d '\r'
    )" || { echo "   ❌ failed to create issue"; return; }
    
    local new_issue_number="${new_issue_url##*/}"
    echo "   ✅ Created issue #$new_issue_number"
    
    # Convert issue number → GraphQL ID
    local new_issue_id="$(
      gh api graphql \
        -F owner="$GITHUB_USER" \
        -F repo="$REPO" \
        -F number="$new_issue_number" \
        -f query='
          query($owner:String!, $repo:String!, $number:Int!){
            repository(owner:$owner, name:$repo){
              issue(number:$number){ id }
            }
          }' | jq -r '.data.repository.issue.id'
    )"
    
    # Add to project and set Status=Backlog
    local item_id="$(get_or_add_project_item_id "$new_issue_id")"
    if [[ -n "$item_id" ]]; then
      set_status_backlog "$item_id"
      echo "   ✅ Added to project and set Status=Backlog"
    fi
  fi
  echo ""
}

# Use awk to parse the YAML frontmatter and extract id/content pairs
# Store results in array to avoid subshell issues
declare -a todo_ids=()
declare -a todo_contents=()

while IFS='|' read -r todo_id content_line; do
  [[ -z "$todo_id" || -z "$content_line" ]] && continue
  todo_ids+=("$todo_id")
  todo_contents+=("$content_line")
done < <(awk '
  /^todos:/ { in_todos=1; next }
  /^---$/ && in_todos { exit }
  in_todos && /id:/ {
    gsub(/^[[:space:]]*-[[:space:]]*id:[[:space:]]*/, "")
    gsub(/[[:space:]]*$/, "")
    todo_id=$0
    next
  }
  in_todos && /content:/ {
    gsub(/^[[:space:]]*content:[[:space:]]*/, "")
    gsub(/[[:space:]]*$/, "")
    print todo_id "|" $0
  }
' "$PLAN_FILE")

# Process each todo
for i in "${!todo_ids[@]}"; do
  todo_id="${todo_ids[$i]}"
  content_line="${todo_contents[$i]}"
  process_todo "$todo_id" "$content_line"
done

echo "✅ Done! All NestJS backend issues have been created/updated."

