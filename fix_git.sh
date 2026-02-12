#!/bin/bash
echo "⚠️  Removing broken git repository..."
rm -rf .git

echo "✅  Initializing new git repository..."
git init

echo "📦  Adding files (large files are now ignored)..."
git add .

echo "💾  Committing..."
git commit -m "Initial commit"

echo "🔗  Connecting to GitHub..."
git branch -M main
git remote add origin https://github.com/AtharvaBhole02/SmartEduMine.git

echo "🚀  Pushing to GitHub..."
git push -u origin main --force

echo "🎉  Done! Your repository is fixed."
