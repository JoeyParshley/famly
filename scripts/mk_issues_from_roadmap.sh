#!/usr/bin/env bash
source ~/.zshrc >/dev/null 2>&1 || true
set -euo pipefail

# --------------------- CONFIG & REQUIREMENTS -----------------------------------
# Requires: gh (logged in with 'project' scope), jq
# Environment (export these in ~/.zshrc, which you already did):
#   GITHUB_USER="JoeyParshley"
#   REPO="famly"
#   PROJECT_ID="PVT_...."       # from `gh project list`
#
# Optional: DRY_RUN=1 to preview without creating anything.

DOCS_CANDIDATES=(
  "docs/Famly Project Roadmap & Progress Tracker.md"
  "docs/Famly_Project_Checklist.md"
)

DRY_RUN="${DRY_RUN:-0}"

need() { command -v "$1" >/dev/null || { echo "❌ need $1"; exit 1; }; }
need gh
need jq
# ------------------------------------------------------------------------------

# Pick the first existing file
ROADMAP_FILE=""
for f in "${DOCS_CANDIDATES[@]}"; do
  if [[ -f "$f" ]]; then ROADMAP_FILE="$f"; break; fi
done
if [[ -z "$ROADMAP_FILE" ]]; then
  echo "❌ Could not find roadmap file in docs/. Checked:"
  printf ' - %s\n' "${DOCS_CANDIDATES[@]}"
  exit 1
fi

if [[ -z "${GITHUB_USER:-}" || -z "${REPO:-}" || -z "${PROJECT_ID:-}" ]]; then
  echo "❌ Set GITHUB_USER, REPO, PROJECT_ID in your shell (e.g., ~/.zshrc)."
  exit 1
fi

echo "📄 Using roadmap file: $ROADMAP_FILE"
echo "👤 Repo: $GITHUB_USER/$REPO"
echo "📈 Project ID: $PROJECT_ID"
[[ "$DRY_RUN" == "1" ]] && echo "🧪 DRY RUN — no issues will be created."

# ------------------------------------------------------------------------------
# Utility: create label if it doesn't exist
ensure_label() {
  local label="$1" color="${2:-BFD4F2}" desc="${3:-"Phase label"}"
  gh label create "$label" --color "$color" --description "$desc" 2>/dev/null || true
}

# Utility: search for existing OPEN issue with exact title
find_open_issue_by_title() {
  local title="$1"
  local q="repo:$GITHUB_USER/$REPO is:issue state:open in:title \"$title\""
  # shellcheck disable=SC2016
  gh api graphql -F q="$q" -f query='
    query($q:String!) {
      search(type: ISSUE, first: 10, query: $q) {
        nodes { ... on Issue { id number url title state } }
      }
    }' \
  | jq -r --arg t "$title" '
      .data.search.nodes[]? | select(.title == $t) | @json' \
  | head -n1
}

# ------------------------------------------------------------------------------
# NEW: Discover Status field + "Backlog" option once and cache their IDs
STATUS_FIELD_ID=""
BACKLOG_OPTION_ID=""

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
    echo "⚠️  No 'Status' field found on this project. Add one in the Project UI, then re-run."
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
    echo "⚠️  The 'Status' field does not have a 'Backlog' option. Add it in the Project UI, then re-run."
    return 1
  fi

  echo "🧭 Status field id: $STATUS_FIELD_ID"
  echo "🧭 Backlog option id: $BACKLOG_OPTION_ID"
}

# ------------------------------------------------------------------------------
# Given an Issue node id, return the Project Item id for THIS project if it exists;
# otherwise create it and return the new item id.
get_or_add_project_item_id() {
  local issue_id="$1"

  # 1) Fetch project items for this issue (no unused projectId variable)
  local ITEMS_JSON ITEM_ID
  ITEMS_JSON=$(gh api graphql -F issueId="$issue_id" -f query='
    query($issueId:ID!){
      node(id:$issueId){
        ... on Issue {
          projectItems(first:50, includeArchived:false){
            nodes {
              id
              project { id }
            }
          }
        }
      }
    }') || true

  # 2) Filter for THIS project (guard against nulls with ?)
  ITEM_ID=$(echo "$ITEMS_JSON" \
    | jq -r --arg pid "$PROJECT_ID" '
        .data.node.projectItems.nodes[]?            # tolerate empty/null
        | select(.project.id == $pid)
        | .id // empty' | head -n1)

  # 3) If missing, add and capture id from mutation result
  if [[ -z "$ITEM_ID" ]]; then
    local ADD_JSON
    ADD_JSON=$(gh api graphql \
      -F projectId="$PROJECT_ID" \
      -F contentId="$issue_id" \
      -f query='
        mutation($projectId:ID!, $contentId:ID!) {
          addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
            item { id }
          }
        }') || { echo "❌ Could not add item to project"; return 1; }

    ITEM_ID=$(echo "$ADD_JSON" | jq -r '.data.addProjectV2ItemById.item.id // empty')
  fi

  if [[ -z "$ITEM_ID" ]]; then
    echo "❌ Could not obtain project item id for issue=$issue_id"
    return 1
  fi

  echo "$ITEM_ID"
}


# ------------------------------------------------------------------------------
# NEW: Set Status = Backlog for a given project item id
set_status_backlog() {
  local item_id="$1"

  # If DRY_RUN, skip updates
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "   🧪 would set Status=Backlog for item $item_id"
    return 0
  fi

  # Ensure ids discovered
  if [[ -z "$STATUS_FIELD_ID" || -z "$BACKLOG_OPTION_ID" ]]; then
    discover_status_ids || return 1
  fi

  gh api graphql \
    -F projectId="$PROJECT_ID" \
    -F itemId="$item_id" \
    -F fieldId="$STATUS_FIELD_ID" \
    -F optionId="$BACKLOG_OPTION_ID" \
    -f query='
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
# Parse the roadmap:
#  - Capture "current phase" from H2 lines starting with "## " that contain "Phase"
#  - For each task line "- [ ] ..." create/ensure issue
current_phase=""
current_phase_label=""

# colors to rotate for phase labels (nice pastel-ish)
phase_colors=(BFD4F2 FAE3C6 F9D0C4 C7DEF8 C4F0C2 E6CCFF FCE8A8 D1F7C4)
phase_idx=0

# Warm up field ids (fail early if missing) unless DRY_RUN
if [[ "$DRY_RUN" != "1" ]]; then
  discover_status_ids || exit 1
fi

while IFS= read -r line; do
  # Detect phase headers, e.g.: "## 🏁 Phase 3 – Authentication & Security"
  if [[ "$line" =~ ^##[[:space:]].*Phase[[:space:]]+[0-9]+ ]]; then
    current_phase="$(echo "$line" | sed -E 's/^##[[:space:]]+//')"   # strip leading ##
    # Normalize label text (labels can contain spaces; keep it readable)
    current_phase_label="$current_phase"
    color="${phase_colors[$((phase_idx % ${#phase_colors[@]}))]}"
    phase_idx=$((phase_idx+1))
    echo "📌 Phase: $current_phase_label"
    if [[ "$DRY_RUN" != "1" ]]; then
      ensure_label "$current_phase_label" "$color" "Phase grouping from roadmap"
    fi
    continue
  fi

  # Detect unchecked checklist items: "- [ ] Task title"
  if [[ "$line" =~ ^-\ \[\ \]\ (.+)$ ]]; then
    task_title="${BASH_REMATCH[1]}"

    # Skip if we don't have a phase yet
    if [[ -z "$current_phase_label" ]]; then
      echo "⚠️  Task outside of a Phase heading, skipping: $task_title"
      continue
    fi

    echo " • Task → \"$task_title\" (label: \"$current_phase_label\")"

    # Duplicate-safe search
    match_json="$(find_open_issue_by_title "$task_title")"

    if [[ -n "$match_json" ]]; then
      issue_url="$(echo "$match_json"    | jq -r '.url')"
      issue_id="$(echo "$match_json"     | jq -r '.id')"
      issue_num="$(echo "$match_json"    | jq -r '.number')"
      echo "   🔁 already exists → $issue_url"

      if [[ "$DRY_RUN" != "1" ]]; then
        # ensure phase label present
        gh issue edit "$issue_num" --repo "$GITHUB_USER/$REPO" --add-label "$current_phase_label" >/dev/null 2>&1 || true
        # ensure project item and set Status=Backlog
        item_id="$(get_or_add_project_item_id "$issue_id")"
        set_status_backlog "$item_id"
      fi
    else
      if [[ "$DRY_RUN" == "1" ]]; then
        echo "   🧪 would create new issue, add to project, and set Status=Backlog."
        continue
      fi

      # Create new issue with phase label
      new_issue_url="$(
        gh issue create \
          --repo "$GITHUB_USER/$REPO" \
          --title "$task_title" \
          --body "Auto-created from **$ROADMAP_FILE**\n\n**Phase:** $current_phase_label" \
          --label "$current_phase_label" \
          | tr -d '\r'
      )" || { echo "   ❌ failed to create issue"; continue; }

      new_issue_number="${new_issue_url##*/}"

      # Convert issue number → GraphQL ID
      new_issue_id="$(
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

      # ensure on project and set Status=Backlog
      item_id="$(get_or_add_project_item_id "$new_issue_id")"
      set_status_backlog "$item_id"

      echo "   ✅ created → $new_issue_url"
    fi
  fi
done < "$ROADMAP_FILE"

echo "🎉 Done."
