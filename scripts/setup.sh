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
echo "[1/5] Checking for Node.js..."
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
# 2. Install Claude Code
# --------------------------------------------------
echo "[2/5] Installing Claude Code..."
if command -v claude &> /dev/null; then
  echo "  OK - Claude Code already installed"
else
  npm install -g @anthropic-ai/claude-code 2>/dev/null
  echo "  OK - Claude Code installed"
fi

# --------------------------------------------------
# 3. Install Claude Code Router + Configure Venice
# --------------------------------------------------
echo "[3/5] Setting up Claude Code Router with Venice AI..."
if command -v ccr &> /dev/null; then
  echo "  OK - Claude Code Router already installed"
else
  npm install -g @musistudio/claude-code-router 2>/dev/null
  echo "  OK - Claude Code Router installed"
fi

cd "$PROJECT_ROOT"

# Get API key
if [ -f ".env" ]; then
  VENICE_KEY=$(grep -oP '(?<=VENICE_API_KEY=).*' .env 2>/dev/null || grep -o 'VENICE_API_KEY=.*' .env 2>/dev/null | cut -d= -f2)
  echo "  Found API key in .env"
else
  echo ""
  echo "  You need a Venice AI API key."
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

# Create router config
mkdir -p ~/.claude-code-router
cat > ~/.claude-code-router/config.json << ROUTERCONFIG
{
  "APIKEY": "",
  "LOG": true,
  "LOG_LEVEL": "info",
  "API_TIMEOUT_MS": 600000,
  "HOST": "127.0.0.1",
  "Providers": [
    {
      "name": "venice",
      "api_base_url": "https://api.venice.ai/api/v1/chat/completions",
      "api_key": "${VENICE_KEY}",
      "models": [
        "olafangensan-glm-4.7-flash-heretic"
      ],
      "transformer": {
        "use": ["anthropic"]
      }
    }
  ],
  "Router": {
    "default": "venice,olafangensan-glm-4.7-flash-heretic",
    "think": "venice,olafangensan-glm-4.7-flash-heretic",
    "background": "venice,olafangensan-glm-4.7-flash-heretic",
    "longContext": "venice,olafangensan-glm-4.7-flash-heretic",
    "longContextThreshold": 100000
  }
}
ROUTERCONFIG

echo "  OK - Router configured for Venice (model: olafangensan-glm-4.7-flash-heretic)"

# --------------------------------------------------
# 4. Install script dependencies
# --------------------------------------------------
echo "[4/5] Installing tools..."
cd "$PROJECT_ROOT/scripts"
if [ -f "package.json" ]; then
  npm install --silent 2>/dev/null
  echo "  OK - Import/export tools ready"
fi

# --------------------------------------------------
# 5. Set up workspace
# --------------------------------------------------
echo "[5/5] Setting up workspace..."
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
echo "  1. Open a terminal and run:"
echo "       ccr start"
echo "       ccr code"
echo ""
echo "  2. Or use the quick-start method:"
echo "       eval \"\$(ccr activate)\" && claude"
echo ""
echo "  3. Claude Code will open. Type naturally to chat with"
echo "     your writing assistant, or use commands like:"
echo "       /project:newproject"
echo "       /project:continue"
echo "       /project:analyze"
echo ""
echo "  Your writing is private. Venice AI does not train on your data."
echo ""
