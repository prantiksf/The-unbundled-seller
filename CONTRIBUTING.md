# Contributing Guide for Designers

This guide helps designers collaborate safely on the Agentforce Prototype without breaking existing functionality.

## 🚀 Quick Start for Designers

### 1. Clone the Repository

```bash
git clone https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator.git
cd slack-vibeface-simulator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Workflow: How to Get Updates & Make Changes

### Getting the Latest Changes

**Always pull latest changes before starting work:**

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes from remote
git pull soma main
```

### Making Changes Safely

**Never commit directly to `main` branch!** Always create a feature branch:

```bash
# Create a new branch for your work
git checkout -b designer/your-name/feature-description

# Example:
git checkout -b designer/jane/update-button-colors
```

### Committing Your Changes

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "Design: Update button colors in Slackbot panel"

# Push to remote
git push soma designer/your-name/feature-description
```

### Creating a Pull Request

1. Go to: `https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator`
2. Click "Merge Requests" → "New Merge Request"
3. Select your branch → `main`
4. Add description of your changes
5. Request review from `prantik-banerjee`
6. Wait for approval before merging

## 🛡️ Protected Areas (Don't Modify Without Approval)

These files contain critical logic and should only be modified with explicit approval:

### Core Architecture Files
- `src/components/presentation/SceneLayout.tsx` - Main scene rendering logic
- `src/components/presentation/SlackAppShell.tsx` - Core shell architecture
- `src/config/demoMetadata.ts` - Narrative and arc configuration
- `.cursorrules` - Project-wide architectural rules

### State Management
- `src/context/*.tsx` - All context providers
- `src/lib/mock-data.ts` - Mock data structure

### Animation & Stability Logic
- `src/components/presentation/QuotaTracker.tsx` - Has complex animation logic
- `src/components/presentation/scenes/Arc1AgentforcePanel.tsx` - Critical state management

## ✅ Safe Areas for Designers

Feel free to modify these areas:

### Styling & Visual Design
- `src/app/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind configuration
- Component styling (className props, inline styles)
- Colors, spacing, typography

### Content & Copy
- Text content in components
- Button labels
- Placeholder text
- Error messages

### Images & Assets
- `public/*.png` - Image assets
- `public/*.svg` - SVG icons

### Component Props (Visual Only)
- Props that control visual appearance
- Props that control layout (spacing, sizing)
- Props that control colors/themes

## 🚨 Before You Commit: Checklist

- [ ] I pulled the latest changes from `main`
- [ ] I created a feature branch (not working on `main`)
- [ ] I tested my changes locally (`npm run dev`)
- [ ] I didn't modify protected files without approval
- [ ] My changes don't break existing functionality
- [ ] I wrote a clear commit message

## 🔍 Testing Your Changes

**Always test locally before pushing:**

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npm run lint

# Test the specific feature you modified
# Navigate through the app and verify:
# - No console errors
# - Visual changes appear as expected
# - Existing features still work
```

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

**Good:**
```
Design: Update Slackbot panel header colors
Design: Add hover states to navigation icons
Design: Improve spacing in activity feed
Fix: Correct button alignment in deal room
```

**Bad:**
```
changes
update
fix stuff
```

## 🔄 Syncing with Main Branch

If `main` has new changes while you're working:

```bash
# Save your current work
git add .
git commit -m "WIP: My current changes"

# Switch to main and pull updates
git checkout main
git pull soma main

# Go back to your branch
git checkout designer/your-name/feature-description

# Merge main into your branch
git merge main

# Resolve any conflicts if they occur
# Then continue working
```

## 🆘 Getting Help

- **Questions?** Reach out to `prantik-banerjee` on Slack
- **Found a bug?** Create an issue or mention in PR description
- **Need access?** Request access to the repository

## 📚 Key Files to Know

### Entry Points
- `src/app/page.tsx` - Main entry point
- `src/app/(demo)/demo/workspace/[workspaceId]/page.tsx` - Demo workspace

### Main Components
- `src/components/presentation/` - Core presentation components
- `src/components/shared/` - Shared UI components
- `src/components/presentation/scenes/` - Scene-specific components

### Configuration
- `src/config/demoMetadata.ts` - Arc and narrative metadata
- `src/lib/presentation-data.ts` - Scene data

## 🎨 Design System

- **Colors:** Defined in `tailwind.config.ts` and `globals.css`
- **Typography:** Uses Tailwind's default font stack
- **Spacing:** Tailwind spacing scale (4px base unit)
- **Components:** ShadCN UI components in `src/components/ui/`

## ⚠️ Important Notes

1. **Never force push** to `main` branch
2. **Always create a branch** for your work
3. **Test locally** before pushing
4. **Ask before modifying** protected files
5. **Keep commits focused** - one feature per commit

---

**Remember:** The goal is to collaborate safely while maintaining code quality and preventing breaking changes!
