#!/usr/bin/env bash
# Script to move all Spring Boot related issues to "Backlog" status in GitHub Project
# Usage: ./scripts/move_spring_boot_to_backlog.sh

source ~/.zshrc >/dev/null 2>&1 || true
set -euo pipefail

# --------------------- CONFIG & REQUIREMENTS -----------------------------------
# Requires: gh (logged in with 'project' scope), jq
# Environment (export these in ~/.zshrc):
#   GITHUB_USER="JoeyParshley"
#   REPO="famly"
#   PROJECT_ID="PVT_...."       # from `gh project list`

need() { command -v "$1" >/dev/null || { echo "❌ need $1"; exit 1; }; }
need gh
need jq

if [[ -z "${GITHUB_USER:-}" || -z "${REPO:-}" || -z "${PROJECT_ID:-}" ]]; then
  echo "❌ Set GITHUB_USER, REPO, PROJECT_ID in your shell (e.g., ~/.zshrc)."
  echo "   Example:"
  echo "   export GITHUB_USER=\"JoeyParshley\""
  echo "   export REPO=\"famly\""
  echo "   export PROJECT_ID=\"PVT_...\"  # Get from: gh project list"
  exit 1
fi

echo "📋 Finding Spring Boot related issues in $GITHUB_USER/$REPO..."
echo "📈 Project ID: $PROJECT_ID"
echo ""

# Get all open issues with Spring Boot related labels
echo "🔍 Searching for Spring Boot issues..."
ISSUES_JSON=$(gh issue list --repo "$GITHUB_USER/$REPO" --state open --json number,title,labels,id --jq '.[] | select(
  .labels[].name | ascii_downcase | 
  test("spring|java|backend-spring|spring-boot")
)')

if [[ -z "$ISSUES_JSON" || "$ISSUES_JSON" == "[]" ]]; then
  echo "✅ No Spring Boot issues found."
  exit 0
fi

ISSUE_COUNT=$(echo "$ISSUES_JSON" | jq -s 'length')
echo "Found $ISSUE_COUNT Spring Boot issue(s):"
echo "$ISSUES_JSON" | jq -r '. | "  #\(.number): \(.title)"'
echo ""

# Get project fields to find Status field and Backlog option
echo "🔍 Getting project fields..."
FIELDS_JSON=$(gh api graphql -F projectId="$PROJECT_ID" -f query='
  query($projectId:ID!){
    node(id:$projectId){
      ... on ProjectV2 {
        fields(first:20){
          nodes{
            ... on ProjectV2Field {
              id
              name
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              options{
                id
                name
              }
            }
          }
        }
      }
    }
  }') || { echo "❌ Could not read project fields"; exit 1; }

STATUS_FIELD_ID=$(echo "$FIELDS_JSON" | jq -r '.data.node.fields.nodes[] | select(.name == "Status" or .name == "status") | .id // empty' | head -1)

if [[ -z "$STATUS_FIELD_ID" ]]; then
  echo "❌ No 'Status' field found on this project."
  echo "   Available fields:"
  echo "$FIELDS_JSON" | jq -r '.data.node.fields.nodes[] | "  - \(.name)"'
  exit 1
fi

BACKLOG_OPTION_ID=$(echo "$FIELDS_JSON" | jq -r --arg fieldId "$STATUS_FIELD_ID" '
  .data.node.fields.nodes[]
  | select(.id == $fieldId)
  | .options[]
  | select(.name | ascii_downcase | test("backlog"))
  | .id
' | head -1)

if [[ -z "$BACKLOG_OPTION_ID" ]]; then
  echo "❌ No 'Backlog' option found in Status field."
  echo "   Available status options:"
  echo "$FIELDS_JSON" | jq -r --arg fieldId "$STATUS_FIELD_ID" '
    .data.node.fields.nodes[]
    | select(.id == $fieldId)
    | .options[]
    | "  - \(.name)"
  '
  exit 1
fi

echo "✅ Found Status field (ID: $STATUS_FIELD_ID)"
echo "✅ Found Backlog option (ID: $BACKLOG_OPTION_ID)"
echo ""

# Ask for confirmation
read -p "Move these $ISSUE_COUNT issue(s) to Backlog? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

# Function to get or add project item for an issue
get_or_add_project_item_id() {
  local issue_id="$1"
  
  # Check if issue is already in project
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
  
  # Add issue to project
  local add_json=$(gh api graphql -F projectId="$PROJECT_ID" -F contentId="$issue_id" -f query='
    mutation($projectId:ID!, $contentId:ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item { id }
      }
    }' 2>/dev/null)
  
  local item_id=$(echo "$add_json" | jq -r '.data.addProjectV2ItemById.item.id // empty')
  echo "$item_id"
}

# Function to update status to Backlog
update_status_to_backlog() {
  local item_id="$1"
  local issue_num="$2"
  
  gh api graphql -F projectId="$PROJECT_ID" -F itemId="$item_id" -F fieldId="$STATUS_FIELD_ID" -F optionId="$BACKLOG_OPTION_ID" -f query='
    mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $optionId:String!){
      updateProjectV2ItemFieldValue(
        input:{
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: {singleSelectOptionId: $optionId}
        }
      ) { projectV2Item { id } }
    }' >/dev/null 2>&1 && echo "  ✅ Moved issue #$issue_num to Backlog" || echo "  ⚠️  Failed to update issue #$issue_num"
}

# Process each issue
echo ""
echo "🔄 Moving issues to Backlog..."
echo ""

echo "$ISSUES_JSON" | jq -c '.' | while read -r issue; do
  issue_id=$(echo "$issue" | jq -r '.id')
  issue_num=$(echo "$issue" | jq -r '.number')
  issue_title=$(echo "$issue" | jq -r '.title')
  
  echo "Processing #$issue_num: $issue_title"
  
  item_id=$(get_or_add_project_item_id "$issue_id")
  
  if [[ -z "$item_id" ]]; then
    echo "  ⚠️  Could not add issue to project"
    continue
  fi
  
  update_status_to_backlog "$item_id" "$issue_num"
done

echo ""
echo "✅ Done! All Spring Boot issues have been moved to Backlog."

