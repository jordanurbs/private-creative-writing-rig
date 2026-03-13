---
name: venice-media
description: Generate images using Venice with Nano Banana Pro model. Use when the writer wants to visualize a character, scene, setting, or mood board. Triggers on requests like "generate an image", "draw", "illustrate", "visualize", or "picture of".
---

# Venice Media — Image Generation

Generate images to help visualize characters, settings, and scenes.

## How to Generate

Run the script from the workspace root:

```bash
python3 scripts/venice-image.py --prompt "DESCRIPTION" --model nano-banana-pro --out-dir PROJECT_IMAGES_DIR
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--prompt` | (required) | Description of the image |
| `--model` | `nano-banana-pro` | Venice image model |
| `--out-dir` | `.` | Output directory |
| `--width` | `1024` | Image width |
| `--height` | `1024` | Image height |

## Where to Save

- If the writer is working inside a project, save to `projects/<name>/images/`
- Otherwise save to `notes/images/`

Create the directory if it does not exist.

## Notes

- The script reads `VENICE_API_KEY` from the `.env` file in the workspace root
- Images are saved as PNG with a descriptive filename
- Cost: ~$0.01-0.03 per image
- Safe mode is disabled (Venice is uncensored)
