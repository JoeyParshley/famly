# Scripts Directory

This directory contains utility scripts for managing the Famly project.

## Available Scripts

### `create_spring_boot_to_node_issues.sh`

Creates GitHub issues from the `docs/SPRING_BOOT_TO_NODE_ISSUES.md` file.

**Usage:**
```bash
# Dry run (preview what would be created)
./scripts/create_spring_boot_to_node_issues.sh --dry-run

# Actually create the issues
./scripts/create_spring_boot_to_node_issues.sh
```

**Prerequisites:**
- GitHub CLI (`gh`) installed and authenticated
- `jq` installed
- Environment variables set in `~/.zshrc`:
  ```bash
  export GITHUB_USER="JoeyParshley"
  export REPO="famly"
  export PROJECT_ID="PVT_..."  # Optional: from `gh project list`
  ```

**What it does:**
1. Parses `docs/SPRING_BOOT_TO_NODE_ISSUES.md` to extract issue titles, descriptions, and labels
2. Creates all required labels if they don't exist
3. Creates GitHub issues for each issue found in the markdown file
4. Optionally adds issues to a GitHub Project if `PROJECT_ID` is set
5. Skips issues that already exist (checks by title)

**Labels created:**
- backend, nestjs, api, auth, security, entity, database, crud, authorization
- pagination, filtering, calculations, infrastructure, error-handling
- documentation, swagger, validation, testing, integration-tests
- cleanup, migration

---

### Other Scripts

- `create_conversion_issues.sh` - Creates issues for initial NestJS conversion
- `move_spring_boot_to_backlog.sh` - Moves Spring Boot issues to backlog
- `pause_spring_boot_issues.sh` - Pauses Spring Boot issues
