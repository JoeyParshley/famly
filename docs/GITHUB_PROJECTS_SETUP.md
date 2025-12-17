# 📋 GitHub Projects Setup Guide

This guide helps you set up and manage your Famly project using GitHub Projects.

## 🎯 Recommended Project Board Structure

### Columns (Status-based workflow)

1. **📋 Backlog** - Ideas and future work
2. **🔍 To Do** - Ready to start
3. **🚧 In Progress** - Currently working on
4. **👀 Review** - Needs review/testing
5. **✅ Done** - Completed

### Custom Fields

Add these custom fields to your project:

- **Status** (Single select): Backlog, To Do, In Progress, Review, Done
- **Priority** (Single select): Low, Medium, High, Critical
- **Type** (Single select): Feature, Bug, Task, Documentation
- **Phase** (Single select): Phase 1, Phase 2, Phase 3, Phase 4
- **Tech Stack** (Multi-select): Backend, Frontend, Database, DevOps

## 📝 Creating Issues from Roadmap

### Manual Method

1. Go to your GitHub repository
2. Click "Issues" → "New Issue"
3. Use the templates:
   - **Feature Request** - For new features
   - **Bug Report** - For bugs
   - **Task** - For specific tasks

### Automated Method

Use the existing scripts in `/scripts`:

```bash
# Create issues from roadmap checklist
./scripts/mk_issues_from_roadmap.sh

# Create NestJS-specific issues
./scripts/create_nestjs_issues.sh
```

## 🏷️ Recommended Labels

Create these labels in your repository:

### By Type
- `feature` - New feature
- `bug` - Bug fix
- `task` - General task
- `documentation` - Documentation work
- `refactor` - Code refactoring

### By Area
- `backend` - Backend work
- `frontend` - Frontend work
- `database` - Database related
- `infrastructure` - DevOps/infrastructure
- `api` - API endpoints

### By Priority
- `priority:high` - High priority
- `priority:medium` - Medium priority
- `priority:low` - Low priority

### By Status
- `in-progress` - Currently being worked on
- `blocked` - Blocked by something
- `needs-review` - Needs code review

### Tech Stack
- `nestjs` - NestJS related
- `react` - React related
- `typescript` - TypeScript related
- `postgresql` - PostgreSQL related

## 📊 Milestones

Create milestones to track major phases:

1. **Phase 1: Core API** - Authentication, Accounts, Transactions
2. **Phase 2: Budgeting** - Budgets, Debts, Calculations
3. **Phase 3: Frontend** - UI implementation
4. **Phase 4: Advanced Features** - Plaid integration, forecasting

## 🔄 Workflow

### Starting Work

1. Move issue from "To Do" to "In Progress"
2. Assign yourself
3. Create a feature branch: `git checkout -b feature/issue-number-description`
4. Work on the feature
5. Commit with conventional commits: `feat(module): description`

### Completing Work

1. Push branch and create Pull Request
2. Move issue to "Review" column
3. Request review (if applicable)
4. After merge, move issue to "Done"

### Weekly Review

- Review "In Progress" items - are they still active?
- Move stale items back to "To Do"
- Update priorities based on project needs
- Close completed issues

## 📈 Tracking Progress

### Project Views

1. **Board View** - Kanban-style board
2. **Table View** - Spreadsheet-like view
3. **Roadmap View** - Timeline view (if using dates)

### Filters

Use filters to focus:
- `is:open label:backend` - All open backend issues
- `is:open assignee:@me` - Your assigned issues
- `milestone:Phase1` - Phase 1 issues

## 🎯 Best Practices

1. **Keep issues small** - One issue = one feature/fix
2. **Use templates** - Consistent issue format
3. **Link related issues** - Use "Closes #123" in PRs
4. **Update status regularly** - Keep project board current
5. **Add context** - Include screenshots, error messages, etc.

## 🔗 Useful Links

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Guide](./ghCliTool.md) - For automating with `gh` CLI

## 📝 Example Issue Workflow

```
1. Create issue: "Implement user authentication"
   - Type: Feature
   - Phase: Phase 1
   - Labels: backend, nestjs, feature
   - Add to "To Do" column

2. Start work:
   - Move to "In Progress"
   - Assign yourself
   - Create branch: feature/123-user-auth

3. Complete work:
   - Create PR
   - Move to "Review"
   - After merge, move to "Done"
```

---

*Keep your project board updated regularly to reflect actual progress!*

