---
description: Show word count and reading stats for the current file or entire project
allowed-tools: Read, Bash, Grep, Glob
---

Calculate word count statistics.

If a specific file is open, show stats for that file. If the writer asks for project stats, count all markdown files in the project.

!`wc -w $1 2>/dev/null || echo ""`

Report:
- Word count
- Estimated reading time (at 238 words per minute)
- Estimated page count (at 250 words per page)

If showing project stats, list each chapter file with its individual word count, plus the total.

$ARGUMENTS
