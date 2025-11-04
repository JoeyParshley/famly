# GitHub CLI Tool
Intsall with brew install gh

## some commands I used

```java
gh auth login
```

`USER` `JoeyParshley`
`REPO` = `famly`
`PROJECT_NAME` = `Famly Development Roadmap`

To open my board from terminal 
```bash
gh project view "$PROJECT_NUMBER" --owner "$USER" --web
```

When opening in `safar` the cli will ask you to copy a code to paste in the project. Then you will be asked to confirm access this will ask for your finger print. It must use safari,.

## To check what statuses exist in your project
I wanted to know if I had a `Backlog` status on my project

```bash
gh project field-list --owner "$USER" --number "$PROJECT_NUMBER"


```

## Ticket Creation: 
```bash
USER="<your-github-username>"
REPO="famly"
PROJECT_NUMBER=1

ISSUE_OUTPUT=$(gh issue create \
  --repo "$USER/$REPO" \
  --title "Add /api/health endpoint" \
  --body "Create HealthController and permit in SecurityConfig. Verify 200 OK at /api/health." \
  --label backend)

echo "Issue created: $ISSUE_OUTPUT"

```

## Check your gh Login status and scopes

```bash
brew install gh jq  # if not installed
gh auth status -t   # make sure you see 'project' scope, not just 'read:project'


# if project is not in scope: refresch scopes
gh auth refresh -h github.com -s project -s repo -s read:org -s workflow

```

```bash
ISSUE_NUMBER=$(echo "$ISSUE_OUTPUT" | sed 's#.*/##')
```
This extracts **just the issue number** from the github url returned by:

```bash
gh issue create
```
When you create an issue `GitHub CLI` prints out something like

```bash
https://github.com//JoeyParshley/famly/issues/14
```
But we actually need just: `14`

So we pipe the output into `sed` which performs a text substitution

### Breakdown of the `sed` part
`sed 's#.*/##'` means: 

| **Piecce** | **Meaning**                                                                    |
|------------|--------------------------------------------------------------------------------|
| `s`        | substitute                                                                     |
| `#`        | separator (like `/` but we chose `#` to avoid escaping the slashes in the URL) |
| `.*`       | "match everything"                                                             |
| `/`        | match the last slash boundary                                                  |
| `##`        | replace it with nothing                                                        |

So it grabs the issues number.

We need this because GitHub's **GraphQL** API requires the **GraphQL Issue ID**, not the URL or number so we
1. Create the Issue -> get URL
2. Strip the URL -> get number
3. convert thenumber -> GraphQL ID
4. Add the Issue to the Board

This step 2 in the chain 


