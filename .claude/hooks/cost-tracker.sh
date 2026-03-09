#!/bin/bash
# session-tracker: record session metadata on stop
# Token/cost data is NOT available to hooks, so we track what we can

METRICS_DIR="$HOME/.claude/metrics"
METRICS_FILE="$METRICS_DIR/sessions.jsonl"

mkdir -p "$METRICS_DIR"

PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Count files changed since last commit
FILES_CHANGED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
LINES_ADDED=$(git diff --numstat 2>/dev/null | awk '{s+=$1} END {print s+0}')
LINES_REMOVED=$(git diff --numstat 2>/dev/null | awk '{s+=$1} END {print s+0}')

# Count tool calls from suggest-compact counter
SESSION_ID="${CLAUDE_SESSION_ID:-$(date '+%Y%m%d')}"
COUNTER_FILE="/tmp/claude-compact-counter-${SESSION_ID}"
TOOL_CALLS=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")

echo "{\"ts\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"branch\":\"$BRANCH\",\"files_changed\":$FILES_CHANGED,\"lines_added\":$LINES_ADDED,\"lines_removed\":$LINES_REMOVED,\"tool_calls\":$TOOL_CALLS}" >> "$METRICS_FILE"
