#!/bin/bash
set -e

# ============================================================
# Creative Writer -- Setup Script
# Run this once to set up your private writing workspace.
# ============================================================

echo ""
echo "=== Creative Writer Setup ==="
echo "  Setting up your private writing workspace..."
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# --------------------------------------------------
# 1. Check for Node.js
# --------------------------------------------------
echo "[1/4] Checking for Node.js..."
if command -v node &> /dev/null; then
  echo "  OK - Node.js $(node -v) found"
else
  echo "  Node.js not found. Installing..."
  if command -v brew &> /dev/null; then
    brew install node
  elif command -v apt-get &> /dev/null; then
    sudo apt-get update && sudo apt-get install -y nodejs npm
  else
    echo "  ERROR: Cannot auto-install Node.js."
    echo "  Please install it from: https://nodejs.org"
    exit 1
  fi
  echo "  OK - Node.js installed"
fi

# --------------------------------------------------
# 2. Install OpenCode
# --------------------------------------------------
echo "[2/4] Installing OpenCode..."
if command -v opencode &> /dev/null; then
  echo "  OK - OpenCode already installed ($(opencode --version 2>/dev/null || echo 'version unknown'))"
else
  echo "  Installing OpenCode..."
  curl -fsSL https://opencode.ai/install | bash 2>/dev/null || npm install -g @opencode-ai/cli 2>/dev/null
  echo "  OK - OpenCode installed"
fi

# --------------------------------------------------
# 3. Set up Venice API key
# --------------------------------------------------
echo "[3/4] Setting up your Venice API key..."
cd "$PROJECT_ROOT"

if [ -f ".env" ]; then
  echo "  OK - .env file already exists"
else
  echo ""
  echo "  You need a Venice API key."
  echo "  Get one at: https://venice.ai/settings/api"
  echo "  (Consider buying DIEM tokens to save on API costs)"
  echo ""
  read -p "  Paste your API key here: " VENICE_KEY

  if [ -z "$VENICE_KEY" ]; then
    echo "  ERROR: API key is required."
    echo "  Get one at: https://venice.ai/settings/api"
    exit 1
  fi

  echo "VENICE_API_KEY=${VENICE_KEY}" > .env
  echo "  OK - API key saved to .env"
fi

# --------------------------------------------------
# 4. Install script dependencies
# --------------------------------------------------
echo "[4/4] Installing tools..."
cd "$PROJECT_ROOT/scripts"
if [ -f "package.json" ]; then
  npm install --silent 2>/dev/null
  echo "  OK - Import/export tools ready"
fi

# Set up workspace
cd "$PROJECT_ROOT"
if [ ! -f "notes/scratch-pad.md" ]; then
  mkdir -p notes
  cat > notes/scratch-pad.md << 'NOTES'
# Scratch Pad

Jot down anything here -- ideas, fragments, reminders, research links. This is not tied to any project.

---


NOTES
fi
echo "  OK - Workspace ready"

# --------------------------------------------------
# Done!
# --------------------------------------------------
echo ""
echo "=== Setup complete! ==="
echo ""
echo "  To start writing:"
echo ""
echo "  1. Open a terminal in this folder"
echo "  2. Run: opencode"
echo "  3. Type naturally to chat with your writing assistant"
echo "  4. Use commands like /newproject, /continue, /analyze"
echo ""
echo "  Your writing is private. Venice does not train on your data."
echo ""
