#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const CHAPTER_PATTERNS = [
  /^#{1,3}\s*(chapter|part|section|act|book)\s+/i,
  /^(chapter|part|section|act|book)\s+(\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/i,
  /^(prologue|epilogue|introduction|preface|foreword|afterword|interlude)\s*$/i,
  /^#{1,3}\s+\S/,
];

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node import.js <filepath> <project-name>');
    console.log('  filepath: path to .docx, .txt, or .md file');
    console.log('  project-name: name for the new project folder');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const projectName = args.slice(1).join(' ');
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const projectsDir = path.join(__dirname, '..', 'projects');
  const projectDir = path.join(projectsDir, slug);

  if (fs.existsSync(projectDir)) {
    console.error(`Project "${slug}" already exists in projects/`);
    process.exit(1);
  }

  console.log(`Importing: ${path.basename(filePath)}`);
  console.log(`Project: ${projectName}`);

  let rawText;
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    rawText = result.value;
    console.log(`Extracted ${rawText.length} characters from .docx`);
  } else {
    rawText = fs.readFileSync(filePath, 'utf-8');
  }

  const chapters = splitIntoChapters(rawText);
  console.log(`Detected ${chapters.length} chapter(s)`);

  const chaptersDir = path.join(projectDir, 'chapters');
  fs.mkdirSync(chaptersDir, { recursive: true });
  fs.mkdirSync(path.join(projectDir, 'characters'), { recursive: true });
  fs.mkdirSync(path.join(projectDir, 'notes'), { recursive: true });
  fs.mkdirSync(path.join(projectDir, 'images'), { recursive: true });

  if (chapters.length === 1 && !chapters[0].title) {
    const outPath = path.join(projectDir, 'manuscript.md');
    fs.writeFileSync(outPath, `# ${projectName}\n\n${chapters[0].content}`);
    console.log(`  -> manuscript.md (single file, no chapters detected)`);
  } else {
    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      const num = String(i + 1).padStart(2, '0');
      const titleSlug = ch.title
        ? ch.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
        : 'untitled';
      const filename = `${num}-${titleSlug}.md`;
      fs.writeFileSync(
        path.join(chaptersDir, filename),
        `# ${ch.title || 'Chapter ' + (i + 1)}\n\n${ch.content}`
      );
      console.log(`  -> chapters/${filename}`);
    }
  }

  fs.writeFileSync(path.join(projectDir, 'outline.md'),
    `# ${projectName} -- Outline\n\nImported from: ${path.basename(filePath)}\nChapters: ${chapters.length}\n\n## Structure\n\n` +
    chapters.map((ch, i) => `${i + 1}. ${ch.title || 'Untitled'}`).join('\n') + '\n'
  );

  fs.writeFileSync(path.join(projectDir, 'style-guide.md'),
    `# Style Guide\n\n*Run /project:style to auto-generate this from your manuscript.*\n`
  );

  console.log(`\nDone! Project created at: projects/${slug}/`);
  console.log(`Run /project:analyze to get a full analysis of the manuscript.`);
}

function splitIntoChapters(text) {
  const lines = text.split('\n');
  const breaks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    for (const pattern of CHAPTER_PATTERNS) {
      if (pattern.test(line)) {
        const prev = i > 0 ? lines[i - 1]?.trim() : '';
        const next = i < lines.length - 1 ? lines[i + 1]?.trim() : '';
        if (!prev || !next || line.startsWith('#')) {
          breaks.push({ lineIndex: i, title: line.replace(/^#+\s*/, '').trim() });
          break;
        }
      }
    }
  }

  if (breaks.length === 0) {
    return [{ title: '', content: text.trim() }];
  }

  const chapters = [];
  for (let i = 0; i < breaks.length; i++) {
    const start = breaks[i].lineIndex + 1;
    const end = i < breaks.length - 1 ? breaks[i + 1].lineIndex : lines.length;
    const content = lines.slice(start, end).join('\n').trim();
    chapters.push({ title: breaks[i].title, content });
  }

  if (breaks[0].lineIndex > 0) {
    const preamble = lines.slice(0, breaks[0].lineIndex).join('\n').trim();
    if (preamble.length > 100) {
      chapters.unshift({ title: 'Preamble', content: preamble });
    }
  }

  return chapters.filter(ch => ch.content.length > 0);
}

main().catch(err => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
