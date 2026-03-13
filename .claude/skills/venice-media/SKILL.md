---
name: venice-media
description: Generate images using Venice API with Nano Banana Pro model for character portraits, scene illustrations, and mood boards.
requires:
  bins: ["python3"]
  env: ["VENICE_API_KEY"]
---

# Venice Media — Image Generation

Generate images to help visualize characters, settings, and scenes using Venice's Nano Banana Pro model.

## Usage

```bash
python3 scripts/venice-image.py --prompt "DESCRIPTION" --out-dir PROJECT_IMAGES_DIR
```

## Options

- `--prompt` (required): Description of the image
- `--model` (default: nano-banana-pro): Venice image model
- `--out-dir` (default: current dir): Where to save the image
- `--width` (default: 1024): Image width
- `--height` (default: 1024): Image height

## Examples

```bash
# Character portrait
python3 scripts/venice-image.py --prompt "a weathered sea captain with grey beard and kind eyes, oil painting style" --out-dir projects/my-novel/images

# Scene illustration
python3 scripts/venice-image.py --prompt "a fog-covered Victorian London street at midnight, gas lamps glowing" --out-dir projects/my-novel/images

# Mood board
python3 scripts/venice-image.py --prompt "abstract watercolor of loneliness and hope, blue and gold tones" --out-dir projects/my-novel/images
```

## Pricing

~$0.01-0.03 per image.

## Notes

- The script reads VENICE_API_KEY from the `.env` file in the workspace root
- Images are saved as PNG with a descriptive filename
- Safe mode is disabled by default (Venice is an uncensored platform)
