---
description: Generate an image using Venice to visualize a scene, character, or setting
argument-hint: description of the image
allowed-tools: Bash, Read
---

Generate an image using Venice to help the writer visualize a scene, character, or setting.

If the writer did not provide a description, ask what they want to see.

Determine the output directory:
- If working inside a project, use that project's `images/` folder
- Otherwise use `notes/images/`

Then run:

!`python3 scripts/venice-image.py --prompt "$ARGUMENTS" --model nano-banana-pro --out-dir <output-dir>`

Tell the writer where the image was saved.
