#!/bin/bash
# Save session summary on conversation end

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NOTES_FILE="$ROOT/.claude/session-notes.md"

cd "$ROOT" 2>/dev/null || exit 0

# Create file if not exists
if [ ! -f "$NOTES_FILE" ]; then
  echo "# Session Notes" > "$NOTES_FILE"
  echo "" >> "$NOTES_FILE"
fi

# Append session end marker
echo "" >> "$NOTES_FILE"
echo "---" >> "$NOTES_FILE"
echo "## $(date '+%Y-%m-%d %H:%M') Session End" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

# Recent commits
echo "### Recent Commits" >> "$NOTES_FILE"
git log --oneline -5 2>/dev/null >> "$NOTES_FILE" || echo "No commits yet" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

# Changed files (uncommitted)
UNCOMMITTED=$(git diff --name-only 2>/dev/null)
if [ -n "$UNCOMMITTED" ]; then
  echo "### Uncommitted Changes" >> "$NOTES_FILE"
  echo "$UNCOMMITTED" >> "$NOTES_FILE"
  echo "" >> "$NOTES_FILE"
fi

# Keep file under 200 lines
LINES=$(wc -l < "$NOTES_FILE")
if [ "$LINES" -gt 200 ]; then
  tail -100 "$NOTES_FILE" > "$NOTES_FILE.tmp"
  mv "$NOTES_FILE.tmp" "$NOTES_FILE"
fi
