Export a project to a publishable format.

Ask the writer:
1. Which project to export (list the folders in `projects/`)
2. Which format: docx, pdf, or epub

Then run: `node scripts/export.js <project-folder-name> <format>`

The script will:
- Collect all chapter files in order
- Convert markdown to the chosen format
- Save the file in the project folder

Tell the writer where the exported file was saved.

$ARGUMENTS
