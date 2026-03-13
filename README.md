# Creative Writer

A private AI writing workspace. Write novels, short stories, essays, screenplays, poetry, or blog posts with an AI collaborator in your terminal -- powered by [Venice](https://venice.ai) for uncensored, private writing assistance.

No subscripand ytions. No data harvesting. Your manuscripts stay on your machine. The AI runs through Venice, which does not train on your data.

---

## What You Get

**A writing partner in your terminal.** Claude Code connects to Venice through a local router, giving you a private AI assistant that understands narrative structure, characters, pacing, and voice. It never refuses dark themes, mature content, or controversial subject matter -- fiction explores the full range of human experience.

**12 slash commands** for everything a writer needs:

| Command | What it does |
|---------|-------------|
| `/project:newproject` | Create a new project from a template |
| `/project:continue` | AI continues writing where you left off, matching your voice |
| `/project:rewrite` | Rewrite the current chapter with full story context |
| `/project:analyze` | 5-pass novel analysis: characters, plot, themes, style, settings |
| `/project:style` | Analyze your writing and generate a style guide the AI follows |
| `/project:wordcount` | Word count, pages, reading time |
| `/project:format` | Smart quotes, em dashes, clean spacing |
| `/project:names` | Generate character or place names |
| `/project:block` | Creative block helper |
| `/project:import` | Import a .docx or .txt manuscript |
| `/project:export` | Export to .docx, .pdf, or .epub |
| `/project:image` | Generate an image via Venice (Nano Banana Pro) |

**Project templates** for novels, short stories, essays, screenplays, blogs, and poetry collections.

**Import/export tools** to bring in existing .docx manuscripts (auto-split into chapters) and export finished work to Word, PDF, or EPUB.

---

## Setup (5 minutes, one time)

### What you need

- A computer (Mac, Windows, or Linux)
- [Node.js](https://nodejs.org/) (v18 or higher)
- A Venice account with API credits ([venice.ai](https://venice.ai))

### Step by step

**1. Download this project**

```
git clone https://github.com/jordanurbs/private-creative-writing-rig.git
cd private-creative-writing-rig
```

Or click "Code" > "Download ZIP" on GitHub and unzip it.

**2. Get your Venice API key**

1. Go to [venice.ai/settings/api](https://venice.ai/settings/api)
2. Create an account if you don't have one
3. Click "Create API Key"
4. Copy the key (starts with `vn_`)

**3. Run the setup script**

```
./scripts/setup.sh
```

This installs Claude Code, the Claude Code Router, and configures it to use Venice with the `olafangensan-glm-4.7-flash-heretic` model. It will ask for your API key.

**4. Start writing**

```
ccr start
ccr code
```

Or:

```
eval "$(ccr activate)" && claude
```

Claude Code opens in your terminal. Type naturally to chat with your writing assistant, or use any of the slash commands.

---

## How It Works

### The AI

Your writing assistant runs through [Claude Code](https://docs.anthropic.com/en/docs/claude-code), routed through Venice via [claude-code-router](https://github.com/musistudio/claude-code-router). The model (`olafangensan-glm-4.7-flash-heretic`) is uncensored, has a 128K token context window, and costs fractions of a cent per interaction.

### Writing

Open this folder in VS Code or Cursor. The editor is pre-configured for prose: serif font, generous line height, no line numbers, no distractions. Write in markdown files -- the AI reads your project structure (outline, characters, style guide) and understands your story.

### Rewriting a novel

If you have an existing manuscript that needs rewriting:

1. `/project:import` to bring in your .docx file (auto-splits into chapters)
2. `/project:analyze` to run 5 analysis passes (characters, plot, themes, style, settings)
3. Review the analysis files, fill in `rewrite-plan.md` with your goals
4. `/project:rewrite` on each chapter -- the AI rewrites with full story context
5. Compare the rewrite side-by-side with the original

### Image generation

`/project:image` generates images using Venice's Nano Banana Pro model. Describe a character, setting, or scene and get an illustration saved to your project.

---

## Project Structure

```
private-creative-writing-rig/
  CLAUDE.md              -- AI personality and behavior
  .claude/commands/      -- slash command definitions
  scripts/
    setup.sh             -- one-time setup
    import.js            -- .docx import
    export.js            -- .docx/.pdf/.epub export
    venice-image.py      -- image generation
  templates/             -- project templates (novel, essay, etc.)
  projects/              -- your writing projects
  notes/                 -- scratch pad for loose ideas
  .vscode/settings.json  -- distraction-free editor config
```

Each writing project:

```
projects/my-novel/
  chapters/              -- chapter files (01-chapter-one.md, etc.)
  characters/            -- character profiles
  notes/                 -- research, ideas
  images/                -- generated images
  outline.md             -- plot structure
  style-guide.md         -- your writing voice (auto-generated or manual)
  rewrite-plan.md        -- rewrite goals (created by /project:analyze)
```

---

## Costs

Venice is pay-per-use. The `olafangensan-glm-4.7-flash-heretic` model is extremely affordable:

| Usage | Estimated cost |
|-------|---------------|
| Light writing day (10 AI chats) | ~$0.02 |
| Heavy writing day (30 chats + chapter context) | ~$0.07 |
| Full novel analysis (5 passes) | ~$0.10-0.30 |
| Image generation | ~$0.01-0.03 each |
| Writing an entire novel over months | ~$2-5 total |

### How to add credits

**USD deposit** -- Pay as you go at [venice.ai](https://venice.ai).

**DIEM token** (recommended for regular writers) -- Stake [DIEM](https://venice.ai/blog/understanding-venice-compute-units-vcu) for $1/day of compute. Reduces long-term costs significantly.

**Pro account** -- $18/month with $10 API credit on upgrade.

---

## Privacy

- Your manuscripts are local files that never leave your computer
- Venice does not train on your data or store your conversations
- The router runs locally on your machine
- Your API key is stored in `.env` (gitignored)

---

## Contributing

Open source. MIT license. Contributions welcome.

1. Fork the repo
2. Edit commands in `.claude/commands/`, scripts in `scripts/`, or templates in `templates/`
3. Submit a pull request

---

## License

MIT -- Copyright (c) 2026 Venice & Jordan Urbs
