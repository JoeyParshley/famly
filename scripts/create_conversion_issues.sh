#!/usr/bin/env bash
# Script to create GitHub issues for Spring Boot to NestJS conversion
# Usage: ./scripts/create_conversion_issues.sh [--dry-run]

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

echo "👤 Repo: $GITHUB_USER/$REPO"
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

# Ensure labels exist
if [[ "$DRY_RUN" != "1" ]]; then
  echo "🏷️  Ensuring labels exist..."
  ensure_label "backend" "1F77B4" "Backend work"
  ensure_label "frontend" "FF7F0E" "Frontend work"
  ensure_label "nestjs" "0E8A16" "NestJS related"
  ensure_label "nodejs" "339933" "Node.js related"
  ensure_label "typescript" "3178C6" "TypeScript related"
  ensure_label "setup" "F58518" "Initial setup tasks"
  ensure_label "entity" "9467BD" "Database entity work"
  ensure_label "api" "8C564B" "API endpoint work"
  ensure_label "docker" "E377C2" "Docker/containerization"
  ensure_label "testing" "7F7F7F" "Testing related"
  ensure_label "config" "BCBD22" "Configuration"
  ensure_label "module" "17BECF" "NestJS module"
  ensure_label "database" "D62728" "Database related"
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
# Create issues

echo "🚀 Creating conversion issues..."
echo ""

# Phase 1: Setup
create_issue \
  "[SETUP] Install NestJS CLI and create project structure" \
  "## Goal
Set up the NestJS project in the \`backend/\` directory.

## Tasks
- [ ] Install NestJS CLI globally: \`npm install -g @nestjs/cli\`
- [ ] Create NestJS project: \`cd backend && nest new . --skip-git\`
- [ ] Verify project structure is created correctly
- [ ] Test that \`npm run start:dev\` works

## Acceptance Criteria
- [ ] NestJS project is initialized in \`backend/\` directory
- [ ] \`package.json\`, \`tsconfig.json\`, and \`nest-cli.json\` exist
- [ ] Application starts without errors
- [ ] Basic \"Hello World\" endpoint is accessible

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 2, Step 1-2" \
  "backend,nestjs,setup"

create_issue \
  "[SETUP] Install TypeORM, Config, and Validation Dependencies" \
  "## Goal
Install all necessary npm packages for the NestJS backend.

## Tasks
- [ ] Install database packages: \`@nestjs/typeorm\`, \`typeorm\`, \`pg\`
- [ ] Install configuration: \`@nestjs/config\`
- [ ] Install validation: \`class-validator\`, \`class-transformer\`
- [ ] Install dev dependencies: \`@types/node\`

## Acceptance Criteria
- [ ] All packages are listed in \`package.json\`
- [ ] \`npm install\` completes without errors
- [ ] No dependency conflicts

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 2, Step 3" \
  "backend,nestjs,setup"

create_issue \
  "[CONFIG] Set up TypeORM connection to PostgreSQL" \
  "## Goal
Configure TypeORM to connect to the existing PostgreSQL database.

## Tasks
- [ ] Configure \`ConfigModule\` in \`app.module.ts\`
- [ ] Configure \`TypeOrmModule\` with PostgreSQL connection
- [ ] Use environment variables from \`infra/.env\`
- [ ] Set \`synchronize: false\` (we use migrations)
- [ ] Enable SQL logging in development

## Acceptance Criteria
- [ ] Backend connects to database successfully
- [ ] Environment variables are loaded correctly
- [ ] TypeORM can query the database
- [ ] No connection errors in logs

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 2, Step 4
- Database connection details in \`infra/.env\`" \
  "backend,nestjs,database,config"

create_issue \
  "[CONFIG] Set up CORS, validation, and API prefix" \
  "## Goal
Configure global application settings in \`main.ts\`.

## Tasks
- [ ] Enable CORS for frontend (localhost:5173)
- [ ] Set up global validation pipe
- [ ] Set global API prefix to \`/api\`
- [ ] Configure port (8080) from environment variable

## Acceptance Criteria
- [ ] CORS allows requests from frontend
- [ ] Validation pipe is active
- [ ] All routes are prefixed with \`/api\`
- [ ] Application starts on port 8080

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 5, Step 10" \
  "backend,nestjs,config"

# Phase 2: Entities
create_issue \
  "[ENTITY] Create User entity with TypeORM" \
  "## Goal
Create the User entity matching the existing database schema.

## Tasks
- [ ] Create \`src/users/entities/user.entity.ts\`
- [ ] Map all columns from \`users\` table
- [ ] Set up relationships (OneToMany with HouseholdMember)
- [ ] Use UUID primary key
- [ ] Add \`@CreateDateColumn\` for timestamps

## Acceptance Criteria
- [ ] Entity matches database schema exactly
- [ ] All relationships are defined correctly
- [ ] TypeORM can query User entity
- [ ] Entity compiles without TypeScript errors

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 3, Step 5
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

create_issue \
  "[ENTITY] Create Household entity with relationships" \
  "## Goal
Create the Household entity with all relationships.

## Tasks
- [ ] Create \`src/households/entities/household.entity.ts\`
- [ ] Map all columns from \`households\` table
- [ ] Set up OneToMany relationships:
  - HouseholdMembers
  - Accounts
  - Assets
  - Debts
  - Budgets
- [ ] Use UUID primary key

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] All relationships are correctly defined
- [ ] Can query household with related entities

## References
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

create_issue \
  "[ENTITY] Create HouseholdMember join entity" \
  "## Goal
Create the HouseholdMember entity (many-to-many join table).

## Tasks
- [ ] Create \`src/households/entities/household-member.entity.ts\`
- [ ] Set up ManyToOne relationships to Household and User
- [ ] Add unique constraint on (household_id, user_id)
- [ ] Map foreign keys correctly

## Acceptance Criteria
- [ ] Entity represents the join table correctly
- [ ] Unique constraint prevents duplicate memberships
- [ ] Relationships work bidirectionally

## References
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

create_issue \
  "[ENTITY] Create Account entity" \
  "## Goal
Create the Account entity with relationship to Household.

## Tasks
- [ ] Create \`src/accounts/entities/account.entity.ts\`
- [ ] Map all columns (id, household_id, name, type, balance)
- [ ] Set up ManyToOne relationship to Household
- [ ] Set up OneToMany relationship to Transactions
- [ ] Use numeric type for balance

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationships are correctly defined
- [ ] Can query account with transactions

## References
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

create_issue \
  "[ENTITY] Create Transaction entity" \
  "## Goal
Create the Transaction entity.

## Tasks
- [ ] Create \`src/transactions/entities/transaction.entity.ts\`
- [ ] Map all columns (id, account_id, description, amount, category, occurred_on)
- [ ] Set up ManyToOne relationship to Account
- [ ] Use timestamptz for occurred_on

## Acceptance Criteria
- [ ] Entity matches database schema
- [ ] Relationship to Account works
- [ ] Can query transactions by account

## References
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

create_issue \
  "[ENTITY] Create Asset, Debt, and Budget entities" \
  "## Goal
Create the remaining entities: Asset, Debt, and Budget.

## Tasks
- [ ] Create \`src/assets/entities/asset.entity.ts\`
- [ ] Create \`src/debts/entities/debt.entity.ts\`
- [ ] Create \`src/budgets/entities/budget.entity.ts\`
- [ ] Map all columns for each entity
- [ ] Set up ManyToOne relationships to Household

## Acceptance Criteria
- [ ] All three entities match database schema
- [ ] Relationships are correctly defined
- [ ] Can query each entity

## References
- Database schema: \`backend/src/main/resources/db/migration/V1__init.sql\`" \
  "backend,nestjs,entity,database"

# Phase 3: Modules
create_issue \
  "[MODULE] Create modules for all entities" \
  "## Goal
Create NestJS modules for each entity domain.

## Tasks
- [ ] Create \`UsersModule\`
- [ ] Create \`HouseholdsModule\`
- [ ] Create \`AccountsModule\`
- [ ] Create \`TransactionsModule\`
- [ ] Create \`AssetsModule\`
- [ ] Create \`DebtsModule\`
- [ ] Create \`BudgetsModule\`
- [ ] Register all modules in \`AppModule\`

## Acceptance Criteria
- [ ] All modules are created
- [ ] Each module imports \`TypeOrmModule.forFeature([Entity])\`
- [ ] All modules are registered in \`AppModule\`
- [ ] Application starts without errors

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 3, Step 6" \
  "backend,nestjs,module"

# Phase 4: API
create_issue \
  "[API] Implement /api/health endpoint" \
  "## Goal
Create a health check endpoint to verify the API is running.

## Tasks
- [ ] Create \`HealthController\` with \`@Controller('health')\`
- [ ] Add \`@Get()\` method returning \`{ status: 'UP' }\`
- [ ] Create \`HealthModule\`
- [ ] Register \`HealthModule\` in \`AppModule\`
- [ ] Test endpoint: \`curl http://localhost:8080/api/health\`

## Acceptance Criteria
- [ ] GET \`/api/health\` returns \`{\"status\":\"UP\"}\`
- [ ] Endpoint is accessible without authentication
- [ ] Response is valid JSON

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 4, Step 7-9" \
  "backend,nestjs,api"

# Phase 5: Docker
create_issue \
  "[DOCKER] Create multi-stage Dockerfile for NestJS backend" \
  "## Goal
Create a production-ready Dockerfile for the NestJS backend.

## Tasks
- [ ] Create multi-stage Dockerfile
- [ ] Build stage: Install dependencies and compile TypeScript
- [ ] Production stage: Copy only built files and production dependencies
- [ ] Expose port 8080
- [ ] Set CMD to run the application

## Acceptance Criteria
- [ ] Dockerfile builds successfully
- [ ] Image size is optimized (multi-stage build)
- [ ] Application runs in container
- [ ] Health endpoint works in container

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 7, Step 15" \
  "backend,docker,deployment"

create_issue \
  "[DOCKER] Update docker-compose.yml for NestJS backend" \
  "## Goal
Update docker-compose.yml to work with NestJS backend.

## Tasks
- [ ] Update backend service to use new Dockerfile
- [ ] Add environment variables:
  - POSTGRES_HOST=db
  - POSTGRES_PORT=5432
  - NODE_ENV=production
  - PORT=8080
- [ ] Test: \`docker compose up --build backend\`

## Acceptance Criteria
- [ ] Backend container builds successfully
- [ ] Backend connects to database
- [ ] Health endpoint works
- [ ] All environment variables are set correctly

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 7, Step 16" \
  "docker,infrastructure"

# Phase 6: Frontend
create_issue \
  "[FRONTEND] Set up React + TypeScript + Vite project" \
  "## Goal
Create the React frontend application.

## Tasks
- [ ] Create Vite React project: \`npm create vite@latest . -- --template react-ts\`
- [ ] Install dependencies
- [ ] Verify project structure
- [ ] Test: \`npm run dev\`

## Acceptance Criteria
- [ ] React app is created in \`frontend/\` directory
- [ ] TypeScript is configured
- [ ] Development server starts on port 5173
- [ ] Basic \"Hello World\" renders

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 6, Step 11" \
  "frontend,react,typescript,setup"

create_issue \
  "[FRONTEND] Install Material UI, React Query, and other dependencies" \
  "## Goal
Install all necessary packages for the frontend.

## Tasks
- [ ] Install Material UI: \`@mui/material\`, \`@emotion/react\`, \`@emotion/styled\`
- [ ] Install icons: \`@mui/icons-material\`
- [ ] Install routing: \`react-router-dom\`
- [ ] Install state management: \`@tanstack/react-query\`
- [ ] Install HTTP client: \`axios\`
- [ ] Install forms: \`react-hook-form\`

## Acceptance Criteria
- [ ] All packages are installed
- [ ] No dependency conflicts
- [ ] \`package.json\` is updated

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 6, Step 12" \
  "frontend,react,dependencies"

create_issue \
  "[FRONTEND] Set up QueryClient, Theme, and API client" \
  "## Goal
Configure the frontend application structure.

## Tasks
- [ ] Set up \`QueryClientProvider\` in \`main.tsx\`
- [ ] Configure Material UI theme
- [ ] Create API client with Axios
- [ ] Configure Vite proxy for API calls
- [ ] Create basic \`App.tsx\` component

## Acceptance Criteria
- [ ] React Query is configured
- [ ] Material UI theme is set up
- [ ] API client can make requests to backend
- [ ] Vite proxy forwards \`/api\` requests to backend

## References
- See \`docs/LEARNING_GUIDE_SPRING_TO_NODE.md\` Part 6, Step 13-14" \
  "frontend,react,config"

# Phase 7: Testing
create_issue \
  "[TEST] Verify full stack integration" \
  "## Goal
Verify that the entire stack works together.

## Tasks
- [ ] Start database: \`docker compose up -d db\`
- [ ] Start backend: \`npm run start:dev\` (in backend/)
- [ ] Start frontend: \`npm run dev\` (in frontend/)
- [ ] Test health endpoint from frontend
- [ ] Verify CORS is working
- [ ] Check browser console for errors

## Acceptance Criteria
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Frontend can call backend API
- [ ] No CORS errors
- [ ] Health endpoint returns correct response

## References
- See \`docs/QUICK_START_CHECKLIST.md\` Testing Checklist" \
  "testing,integration"

echo "✅ Done! All conversion issues have been created/updated."

