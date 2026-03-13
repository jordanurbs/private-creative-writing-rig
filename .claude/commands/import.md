Import a document into the workspace as a new project.

Ask the writer for:
1. The file path to their .docx, .txt, or .md file
2. A project name

Then:
1. Run `node scripts/import.js <filepath> <project-name>` to convert and split the document
2. The script will create the project folder in `projects/` with chapters split by heading detection
3. Tell the writer what was created and how many chapters were found
4. Suggest they run `/project:analyze` next if they want AI analysis of the manuscript

$ARGUMENTS
