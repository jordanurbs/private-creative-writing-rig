---
description: Import a .docx or .txt manuscript into a new project
argument-hint: filepath project-name
allowed-tools: Bash, Read, Write, Glob
---

Import a document into the workspace as a new project.

If the writer did not provide arguments, ask for:
1. The file path to their .docx, .txt, or .md file
2. A project name

Then run the import script:

!`node scripts/import.js $ARGUMENTS`

Tell the writer what was created and how many chapters were found. Suggest they run `/project:analyze` next if they want AI analysis of the manuscript.
