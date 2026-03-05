# Designer Setup Guide

Quick setup guide specifically for designers working on the Agentforce Prototype.

## Prerequisites

- Git installed
- Node.js 18+ installed
- Access to `git.soma.salesforce.com`
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://git.soma.salesforce.com/prantik-banerjee/slack-vibeface-simulator.git
cd slack-vibeface-simulator
```

### 2. Install Dependencies

```bash
npm install
```

This may take a few minutes. You'll see a lot of output - that's normal!

### 3. Start the Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

Open `http://localhost:3000` in your browser.

## Daily Workflow

### Starting Your Day

```bash
# 1. Make sure you're on main branch
git checkout main

# 2. Get latest changes
git pull soma main

# 3. Create a new branch for your work
git checkout -b designer/your-name/what-youre-doing

# Example:
git checkout -b designer/jane/update-slackbot-colors
```

### Making Changes

1. Edit files in your code editor
2. Save files
3. Browser should auto-refresh (Hot Module Replacement)
4. Test your changes visually

### Saving Your Work

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Design: Update Slackbot panel colors"

# Push to remote
git push soma designer/your-name/what-youre-doing
```

### Getting Updates from Others

```bash
# Switch to main
git checkout main

# Pull latest
git pull soma main

# Go back to your branch
git checkout designer/your-name/what-youre-doing

# Merge main into your branch
git merge main
```

## Common Tasks

### Update Colors

1. Open `tailwind.config.ts` or `src/app/globals.css`
2. Modify color values
3. Save and see changes instantly

### Update Images

1. Add new images to `public/` folder
2. Reference them: `/your-image.png`
3. Commit the image file

### Update Text Content

1. Find the component file (usually in `src/components/`)
2. Update the text strings
3. Save and refresh

### Update Spacing/Layout

1. Find the component
2. Modify Tailwind classes (e.g., `px-4` → `px-6`)
3. Save and see changes

## File Structure Overview

```
slack-vibeface-simulator/
├── public/              # Images, icons, assets
├── src/
│   ├── app/            # Pages and routes
│   ├── components/     # React components
│   │   ├── presentation/  # Main UI components
│   │   ├── shared/        # Reusable components
│   │   └── ui/            # Base UI components
│   ├── config/         # Configuration files
│   └── lib/            # Utilities and data
├── tailwind.config.ts  # Tailwind CSS config
└── package.json        # Dependencies
```

## Troubleshooting

### "Port 3000 already in use"

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### "Module not found" errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Changes not showing

1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache

### Git errors

```bash
# If you get merge conflicts
git status  # See what's conflicted
# Edit conflicted files, remove conflict markers
git add .
git commit -m "Resolve merge conflicts"
```

## Visual Testing Checklist

Before pushing your changes, verify:

- [ ] No console errors (open browser DevTools)
- [ ] Changes look correct on your screen
- [ ] No broken images or missing assets
- [ ] Navigation still works
- [ ] Buttons still clickable
- [ ] Text is readable
- [ ] Colors match design specs

## Getting Help

- **Git questions:** Check `CONTRIBUTING.md`
- **Technical issues:** Ask `prantik-banerjee`
- **Design questions:** Reference design files/Figma

## Quick Reference

```bash
# Start dev server
npm run dev

# Check for errors
npm run lint

# Create new branch
git checkout -b designer/your-name/feature

# Save work
git add .
git commit -m "Description"
git push soma designer/your-name/feature

# Get updates
git checkout main
git pull soma main
```

---

**Happy designing! 🎨**
