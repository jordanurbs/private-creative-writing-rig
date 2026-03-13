---
description: Run a full 5-pass novel analysis (characters, plot, themes, style, settings)
allowed-tools: Read, Write, Grep, Glob, Bash
---

Run a full analysis of the novel/manuscript in the current project. Read ALL chapter files in order to understand the complete work.

Perform 5 analysis passes and save each as a markdown file in the project folder:

1. **characters-analysis.md** -- Every character profiled: name, role, arc, personality, relationships, motivations, flaws, voice, strongest scenes. Include a relationship map at the end.

2. **plot-analysis.md** -- Story type, narrative arc, act-by-act breakdown, chapter-by-chapter summary, plot strengths, plot weaknesses (holes, pacing issues, unresolved threads), structural recommendations.

3. **themes-analysis.md** -- Major themes and how they are explored, recurring motifs and symbols, emotional arc of the reader, tonal consistency assessment.

4. **style-guide.md** -- Analyze the writer's voice: POV, tense, sentence structure, vocabulary, dialogue style, imagery, tone, pacing, quirks. Write in second person ("You write in...") as instructions for future AI writing.

5. **settings-analysis.md** -- Every significant location described, atmosphere, sensory details, world-building rules, consistency issues.

After all 5 analyses are saved, create a `rewrite-plan.md` template with sections:
- What I want to keep
- What I want to change
- Chapter-by-chapter rewrite notes

Tell the writer to review the analysis files and fill in the rewrite plan before using `/project:rewrite` on individual chapters.

$ARGUMENTS
