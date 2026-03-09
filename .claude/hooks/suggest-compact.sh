#!/bin/bash
# suggest-compact: track tool calls and suggest /compact at ~50 calls
# Uses a fixed-path counter file per session (CLAUDE_SESSION_ID or fallback to date)

SESSION_ID="${CLAUDE_SESSION_ID:-$(date '+%Y%m%d')}"
COUNTER_FILE="/tmp/claude-compact-counter-${SESSION_ID}"

if [ ! -f "$COUNTER_FILE" ]; then
  echo "0" > "$COUNTER_FILE"
fi

COUNT=$(cat "$COUNTER_FILE")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

if [ "$COUNT" -eq 50 ]; then
  echo "已执行 50 次工具调用，建议 /compact 释放上下文空间"
elif [ "$COUNT" -eq 80 ]; then
  echo "已执行 80 次工具调用，强烈建议 /compact 或开新对话"
fi
