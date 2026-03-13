---
description: Create a new writing project from a template
argument-hint: type title (e.g. "novel My Great Story")
allowed-tools: Read, Write, Bash, Glob
---

Create a new writing project from a template.

If the writer did not provide arguments, ask:
1. What type? (novel, short-story, essay, blog, screenplay, poetry-collection)
2. What is the title?

Available templates are in `templates/`. List them:

!`ls templates/`

Copy the matching template from `templates/<type>/` to `projects/<title-slug>/`.

Replace `{{title}}` with the project title and `{{date}}` with today's date in all copied files.

After creating the project, open the main writing file and tell the writer they are ready. Mention `/project:style` for generating a style guide after writing a few pages.

$ARGUMENTS
