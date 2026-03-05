# Branch Protection Strategy

This document explains how the repository is protected to prevent breaking changes while allowing safe collaboration.

## 🛡️ Protection Strategy

### Main Branch Protection

The `main` branch is protected with the following rules:

1. **No Direct Commits** - All changes must go through Merge Requests
2. **Required Approvals** - At least 1 approval required (from repository owner)
3. **Status Checks** - Must pass linting before merging
4. **No Force Push** - Prevents accidental overwrites

### How This Protects Your Code

✅ **Designers can't accidentally break main**
- They must create a branch first
- Changes are reviewed before merging
- You can reject problematic changes

✅ **Everyone gets updates safely**
- Designers pull from `main` to get your changes
- Their branches can be updated without affecting `main`
- Conflicts are resolved before merging

✅ **History is preserved**
- All changes are tracked in Merge Requests
- Easy to see who changed what and why
- Can revert if something breaks

## 🔧 Setting Up Branch Protection (GitLab)

To enable branch protection in GitLab Soma:

1. Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator/-/settings/repository`

2. Expand **"Protected branches"**

3. Add protection for `main`:
   - **Allowed to merge:** `Maintainers` or `Developers + Maintainers`
   - **Allowed to push:** `No one` (forces MR workflow)
   - **Allowed to force push:** ❌ Unchecked
   - **Allowed to delete:** ❌ Unchecked

4. Under **"Merge request settings"**:
   - ✅ Require approval from code owners
   - ✅ Require pipeline to succeed
   - ✅ Remove source branch after merge

## 📋 Workflow Example

### Designer Workflow

```bash
# 1. Designer starts work
git checkout main
git pull soma main
git checkout -b designer/jane/update-colors

# 2. Makes changes, commits
git add .
git commit -m "Design: Update button colors"
git push soma designer/jane/update-colors

# 3. Creates Merge Request in GitLab
# 4. You review and approve
# 5. Merge happens automatically
# 6. Designer pulls updated main
```

### Your Workflow

```bash
# 1. You make changes
git checkout main
git checkout -b feature/new-feature

# 2. Commit and push
git add .
git commit -m "Add new feature"
git push soma feature/new-feature

# 3. Create MR, self-approve (or have teammate approve)
# 4. Merge to main
```

## 🚨 What Happens If Someone Tries to Break Rules

### Attempting Direct Commit to Main

```bash
git checkout main
git commit -m "Bad change"
git push soma main
```

**Result:** GitLab rejects with error:
```
! [remote rejected] main -> main (protected branch hook declined)
```

### Attempting Force Push

```bash
git push --force soma main
```

**Result:** GitLab rejects - force push is disabled

### Attempting to Merge Without Approval

**Result:** Merge Request shows "Approval required" - can't merge until approved

## ✅ Best Practices

### For You (Repository Owner)

1. **Review Merge Requests promptly** - Designers are waiting
2. **Provide feedback** - Help them learn the codebase
3. **Merge small changes quickly** - Encourages frequent commits
4. **Test before approving** - Pull their branch locally and test

### For Designers

1. **Create branches** - Never work directly on `main`
2. **Pull before starting** - Always get latest changes
3. **Small, focused changes** - Easier to review and less risky
4. **Clear commit messages** - Help reviewers understand changes

## 🔍 Monitoring Changes

### View All Merge Requests

Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator/-/merge_requests`

### View Recent Commits

```bash
git log --oneline --graph --all
```

### See Who Changed What

```bash
git blame src/components/presentation/SceneLayout.tsx
```

## 🆘 Emergency Procedures

### If Main Branch Breaks

```bash
# Revert the bad commit
git checkout main
git pull soma main
git revert <bad-commit-hash>
git push soma main
```

### If You Need to Force Push (Emergency Only)

1. Temporarily disable branch protection in GitLab
2. Make your emergency fix
3. Re-enable protection immediately

### If Merge Request Has Conflicts

```bash
# Designer resolves conflicts
git checkout designer/jane/update-colors
git merge main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push soma designer/jane/update-colors
```

## 📊 Benefits Summary

| Feature | Benefit |
|---------|---------|
| Protected `main` | Prevents accidental breaking changes |
| Required MRs | All changes are reviewed before merging |
| Required approvals | You control what goes into `main` |
| No force push | History is preserved and safe |
| Branch workflow | Designers can experiment safely |

---

**Remember:** Branch protection is your safety net. It prevents accidents while allowing full collaboration!
