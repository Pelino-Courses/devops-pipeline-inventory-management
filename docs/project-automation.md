# GitHub Projects Automation Documentation

## Overview
This document describes the automation rules configured for the DevOps Pipeline Implementation GitHub Project board. The automation ensures that issues and pull requests move automatically through workflow columns based on their status and activity.

## Project Structure

### Workflow Columns
The project board uses the following columns:
1. **Backlog** - New issues awaiting prioritization
2. **Ready** - Issues ready to be worked on
3. **In Progress** - Issues currently being worked on
4. **In Review** - Pull requests under review
5. **Done** - Completed issues and merged pull requests

## Automation Rules

### 1. New Issues → Backlog
**Trigger:** When a new issue is created in the repository

**Action:** Automatically add the issue to the project board in the "Backlog" column

**Configuration:**
- Navigate to Project Settings → Workflows
- Create workflow: "Auto-add to project"
- Set trigger: `Issue opened`
- Set action: `Add to project` → `Backlog` column

**Testing:**
```bash
# Create a test issue through GitHub UI or CLI
gh issue create --title "Test Issue for Automation" --body "Testing backlog automation"
# Verify the issue appears in Backlog column
```

### 2. Assigned Issues → In Progress
**Trigger:** When an issue is assigned to a user

**Action:** Move the issue from its current column to "In Progress"

**Configuration:**
- Navigate to Project Settings → Workflows
- Create workflow: "Move assigned issues"
- Set trigger: `Issue assigned`
- Set action: `Set status` → `In Progress` column

**Testing:**
```bash
# Assign an issue to yourself or a team member
gh issue edit <issue-number> --add-assignee <username>
# Verify the issue moves to In Progress column
```

### 3. Linked PR Opened → In Review
**Trigger:** When a pull request is opened and linked to an issue

**Action:** Move the linked issue to "In Review" column

**Configuration:**
- Navigate to Project Settings → Workflows
- Create workflow: "Move linked issues on PR"
- Set trigger: `Pull request opened`
- Set action: `Set status` → `In Review` column
- Enable: `Apply to linked issues`

**PR Linking Methods:**
To link a PR to an issue, use one of these methods in the PR description:
- `Closes #123`
- `Fixes #123`
- `Resolves #123`

**Testing:**
```bash
# Create a branch and PR linked to an issue
git checkout -b feature/test-automation
# Make some changes
git commit -m "Test commit"
git push origin feature/test-automation
gh pr create --title "Test PR" --body "Closes #<issue-number>" --base main
# Verify the linked issue moves to In Review column
```

### 4. PR Merged → Done
**Trigger:** When a pull request is merged

**Action:** Move the linked issue to "Done" column and close the issue

**Configuration:**
- Navigate to Project Settings → Workflows
- Create workflow: "Close linked issues on merge"
- Set trigger: `Pull request merged`
- Set action: `Set status` → `Done` column
- Enable: `Apply to linked issues`
- Enable: `Close issue`

**Testing:**
```bash
# Merge a PR that is linked to an issue
gh pr merge <pr-number> --merge
# Verify the linked issue moves to Done column
# Verify the issue is closed
```

## GitHub Actions Integration

For additional automation capabilities, a GitHub Actions workflow can be used to complement the built-in project automation.

### Workflow File: `.github/workflows/project-automation.yml`

This workflow provides additional automation support:
- Validates that issues follow the correct workflow
- Sends notifications for project board changes
- Handles edge cases not covered by built-in automation

## Setup Instructions

### Prerequisites
1. GitHub Project must exist for the repository
2. Required columns must be created: Backlog, Ready, In Progress, In Review, Done
3. Branch protection rules must be applied to `main` and `develop` branches
4. Issue templates must exist (already configured in `.github/ISSUE_TEMPLATE/`)

### Step-by-Step Configuration

#### Step 1: Access Project Settings
1. Navigate to the GitHub repository
2. Click on "Projects" tab
3. Select "DevOps Pipeline Implementation" project
4. Click the "⋯" menu → "Settings"

#### Step 2: Configure Workflow Automations
1. In Project Settings, select "Workflows"
2. For each automation rule above:
   - Click "New workflow"
   - Select the appropriate trigger
   - Configure the action
   - Save the workflow

#### Step 3: Configure Item Behavior
In Project Settings → Item behavior:
- Enable "Auto-add to project" for new issues
- Enable "Auto-archive items" for closed issues (optional)

#### Step 4: Test Each Automation
Follow the testing steps outlined for each automation rule above to verify:
- ✅ New issues appear in Backlog
- ✅ Assigned issues move to In Progress
- ✅ PRs linked to issues move them to In Review
- ✅ Merged PRs move linked issues to Done
- ✅ All workflows handle edge cases gracefully

## Verification Checklist

Use this checklist to verify all automation rules are working correctly:

- [ ] Create a new issue and verify it appears in Backlog
- [ ] Assign yourself to the issue and verify it moves to In Progress
- [ ] Create a PR linked to the issue and verify it moves to In Review
- [ ] Merge the PR and verify the issue moves to Done
- [ ] Verify the issue is automatically closed when PR is merged
- [ ] Test with multiple issues and PRs to ensure consistency

## Advanced Configuration

### Status Field Customization
The project board can use custom status fields:
1. Navigate to Project Settings → Fields
2. Edit the "Status" field
3. Add, remove, or rename status options as needed
4. Update automation workflows to match new status names

### Additional Automation Ideas
Consider implementing these additional automations:
- Move stale issues back to Backlog after 30 days of inactivity
- Add priority labels automatically based on keywords
- Notify team members when issues are blocked
- Create monthly reports of completed issues

## Troubleshooting

### Issue Not Moving to Backlog
- Verify the project has "Auto-add to project" workflow enabled
- Check that the issue is in the correct repository
- Ensure you have appropriate permissions on the project

### PR Not Moving Issue to In Review
- Verify the PR description contains a closing keyword (`Closes`, `Fixes`, `Resolves`)
- Check that the issue number is correct
- Ensure the PR is targeting the correct base branch

### Issue Not Moving to Done After Merge
- Verify the PR was fully merged (not just closed)
- Check that the "Close linked issues" workflow is enabled
- Ensure the PR had proper linking keywords in the description

### Permission Issues
Required permissions:
- Repository: Write access
- Project: Write access
- Actions: Read/write permissions (if using GitHub Actions)

## Best Practices

1. **Consistent Linking**: Always link PRs to issues using closing keywords
2. **Branch Naming**: Use descriptive branch names like `feature/issue-123-description`
3. **Regular Reviews**: Review the project board weekly to ensure automation is working
4. **Documentation**: Keep this document updated as automation rules change
5. **Testing**: Test automation rules after any configuration changes

## Maintenance

### Regular Checks
- Weekly: Review project board for stuck items
- Monthly: Audit automation logs in GitHub Actions
- Quarterly: Review and update automation rules based on team feedback

### Updating Automation Rules
When updating automation:
1. Document the change in this file
2. Notify the team via issue comment or discussion
3. Test the new rule thoroughly before deploying
4. Monitor for any unexpected behavior

## Additional Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Actions for Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
- [Linking Pull Requests to Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)

## Support

For issues or questions about project automation:
1. Create an issue using the DevOps Task template
2. Tag @MINEGA-McDenver or @batesi-janet (project owners)
3. Include screenshots and error messages if applicable

---
**Last Updated:** 2025-11-19  
**Maintained By:** DevOps Team  
**Version:** 1.0
