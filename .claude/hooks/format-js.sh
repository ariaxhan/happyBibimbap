#!/bin/bash
# PostToolUse hook: Format JS/CSS files with Prettier after Edit/Write

# Read JSON input from stdin
INPUT=$(cat)

# Extract file_path from tool_input using jq (or fallback to grep)
if command -v jq &> /dev/null; then
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')
else
    # Fallback: simple grep extraction
    FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi

# Exit if no file path found
[ -z "$FILE_PATH" ] && exit 0

# Only format JS/JSX/JSON/CSS files
case "$FILE_PATH" in
    *.js|*.jsx|*.json|*.css)
        # Run prettier from the happy-bibimbap directory
        cd "$CLAUDE_PROJECT_DIR/happy-bibimbap" 2>/dev/null || exit 0
        npx prettier --write "$FILE_PATH" 2>/dev/null || true
        ;;
esac

exit 0
