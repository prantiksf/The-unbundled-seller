#!/bin/bash
cd "$(dirname "$0")"
echo "=== Deploy ==="
git add -A
git status --short
git commit -m "Pixel-perfect UI match: buttons, badges, avatars, density, Block Kit styling" 2>/dev/null || echo "(nothing new to commit)"
echo "Pushing..."
git push origin main
echo "=== Done ==="
