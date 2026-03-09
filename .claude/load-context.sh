#!/bin/bash
# Load session context on conversation start
# Outputs key project state for Claude to consume

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Lobster University — Session Context ==="
echo ""

# Current branch and status
echo "## Git Status"
cd "$ROOT" 2>/dev/null
git branch --show-current 2>/dev/null
git log --oneline -3 2>/dev/null || echo "No commits"
echo ""

# Show task progress
if [ -f "$ROOT/.claude/tasks.md" ]; then
  echo "## Task Progress"
  grep -E '^\- \[[ x]\]' "$ROOT/.claude/tasks.md" | head -20
  echo ""
fi

# Show last session notes
if [ -f "$ROOT/.claude/session-notes.md" ]; then
  echo "## Last Session Notes"
  tail -20 "$ROOT/.claude/session-notes.md"
  echo ""
fi

echo "=== Ready to work ==="
