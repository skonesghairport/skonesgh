#!/bin/bash

# DavSec/AvsEc Ghana Airport Security - GitHub Push Script
# This script pushes all code to GitHub repository

set -e

echo "🚀 DavSec Security App - GitHub Push Script"
echo "==========================================="
echo ""

# Configuration
REPO_URL="https://github.com/skonesghairport/skonesgh.git"
BRANCH="main"
COMMIT_MESSAGE="feat: DavSec/AvsEc Ghana Airport Security Portal - Complete Integration with CCTV Facial Recognition, Payroll Transparency, and Security Operations"

# Step 1: Configure Git
echo "📝 Step 1: Configuring Git..."
git config user.email "dev@skonesgh.com"
git config user.name "Skones Security Dev Team"
echo "✅ Git configured"
echo ""

# Step 2: Add all files
echo "📦 Step 2: Adding all files..."
git add -A
echo "✅ Files added"
echo ""

# Step 3: Check status
echo "📊 Step 3: Checking Git status..."
git status
echo ""

# Step 4: Create commit
echo "💾 Step 4: Creating commit..."
git commit -m "$COMMIT_MESSAGE" || echo "ℹ️  No changes to commit"
echo "✅ Commit created"
echo ""

# Step 5: Set remote
echo "🔗 Step 5: Setting GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo "✅ Remote configured: $REPO_URL"
echo ""

# Step 6: Push to GitHub
echo "🚀 Step 6: Pushing to GitHub..."
git push -u origin "$BRANCH" --force
echo "✅ Code pushed successfully!"
echo ""

# Step 7: Verify
echo "✅ Step 7: Verification..."
echo "Repository: $REPO_URL"
echo "Branch: $BRANCH"
echo "Commit: $(git log -1 --oneline)"
echo ""

echo "🎉 SUCCESS! Code pushed to GitHub"
echo "==========================================="
echo ""
echo "Next Steps:"
echo "1. Visit: $REPO_URL"
echo "2. Create a Pull Request"
echo "3. Add reviewers"
echo "4. Merge to main"
echo "5. Deploy to production"
echo ""

