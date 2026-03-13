---
description: Export a project to .docx, .pdf, or .epub
argument-hint: project-name format
allowed-tools: Bash, Read, Glob
---

Export a project to a publishable format.

If the writer did not provide arguments, ask:
1. Which project to export (list the folders in `projects/`)
2. Which format: docx, pdf, or epub

Then run:

!`node scripts/export.js $ARGUMENTS`

Tell the writer where the exported file was saved.
