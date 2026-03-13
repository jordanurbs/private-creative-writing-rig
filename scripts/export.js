#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node export.js <project-folder-name> <format>');
    console.log('  format: docx, pdf, or epub');
    process.exit(1);
  }

  const projectName = args[0];
  const format = args[1].toLowerCase();
  const projectDir = path.join(__dirname, '..', 'projects', projectName);

  if (!fs.existsSync(projectDir)) {
    console.error(`Project not found: projects/${projectName}/`);
    process.exit(1);
  }

  if (!['docx', 'pdf', 'epub'].includes(format)) {
    console.error('Format must be: docx, pdf, or epub');
    process.exit(1);
  }

  const chapters = collectChapters(projectDir);
  if (chapters.length === 0) {
    console.error('No markdown files found in this project.');
    process.exit(1);
  }

  const title = projectName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  console.log(`Exporting "${title}" (${chapters.length} chapters) to ${format}...`);

  let outputPath;
  switch (format) {
    case 'docx': outputPath = await exportDocx(projectDir, title, chapters); break;
    case 'pdf': outputPath = await exportPdf(projectDir, title, chapters); break;
    case 'epub': outputPath = await exportEpub(projectDir, title, chapters); break;
  }

  console.log(`Done! Saved to: ${outputPath}`);
}

function collectChapters(projectDir) {
  const chapters = [];
  for (const sub of ['chapters', 'acts', 'poems', 'posts']) {
    const dir = path.join(projectDir, sub);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
      for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        const titleMatch = raw.match(/^#\s+(.+)$/m);
        const t = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/[-_]/g, ' ');
        const content = raw.replace(/^#\s+.+\n*/, '').trim();
        chapters.push({ title: t, content });
      }
      return chapters;
    }
  }
  const files = fs.readdirSync(projectDir)
    .filter(f => f.endsWith('.md') && !['README.md', 'outline.md', 'style-guide.md'].includes(f)).sort();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(projectDir, file), 'utf-8');
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const t = titleMatch ? titleMatch[1].trim() : file.replace(/\.md$/, '');
    const content = raw.replace(/^#\s+.+\n*/, '').trim();
    chapters.push({ title: t, content });
  }
  return chapters;
}

function stripMd(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/^>\s+/gm, '')
    .replace(/^---+$/gm, '');
}

async function exportDocx(projectDir, title, chapters) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
  const allParagraphs = [
    new Paragraph({ text: title, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
  ];

  for (const ch of chapters) {
    allParagraphs.push(new Paragraph({ text: ch.title, heading: HeadingLevel.HEADING_1, spacing: { after: 400 }, pageBreakBefore: true }));
    for (const line of stripMd(ch.content).split('\n')) {
      const trimmed = line.trim();
      allParagraphs.push(trimmed === ''
        ? new Paragraph({ text: '' })
        : new Paragraph({
            children: [new TextRun({ text: trimmed, font: 'Times New Roman', size: 24 })],
            spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
          })
      );
    }
  }

  const doc = new Document({ creator: 'Creative Writer', title, sections: [{ children: allParagraphs }] });
  const buffer = await Packer.toBuffer(doc);
  const out = path.join(projectDir, `${title.toLowerCase().replace(/\s+/g, '-')}.docx`);
  fs.writeFileSync(out, buffer);
  return out;
}

async function exportPdf(projectDir, title, chapters) {
  const PDFDocument = require('pdfkit');
  const out = path.join(projectDir, `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margins: { top: 72, bottom: 72, left: 72, right: 72 }, info: { Title: title } });
    const stream = fs.createWriteStream(out);
    doc.pipe(stream);
    doc.fontSize(28).font('Times-Bold').text(title, { align: 'center' });
    doc.moveDown(4);

    for (let i = 0; i < chapters.length; i++) {
      if (i > 0) doc.addPage();
      doc.fontSize(18).font('Times-Bold').text(chapters[i].title, { align: 'center' });
      doc.moveDown(1.5);
      doc.fontSize(12).font('Times-Roman');
      for (const para of stripMd(chapters[i].content).split('\n\n')) {
        const cleaned = para.replace(/\n/g, ' ').trim();
        if (cleaned) { doc.text(cleaned, { align: 'justify', lineGap: 4, indent: 36 }); doc.moveDown(0.5); }
      }
    }
    doc.end();
    stream.on('finish', () => resolve(out));
    stream.on('error', reject);
  });
}

async function exportEpub(projectDir, title, chapters) {
  const JSZip = require('jszip');
  const zip = new JSZip();
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const uid = `creative-writer-${slug}-${Date.now()}`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  zip.file('mimetype', 'application/epub+zip');
  zip.file('META-INF/container.xml',
    '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');

  const manifest = chapters.map((_, i) => `<item id="ch${i}" href="ch${i}.xhtml" media-type="application/xhtml+xml"/>`).join('\n');
  const spine = chapters.map((_, i) => `<itemref idref="ch${i}"/>`).join('\n');

  zip.file('OEBPS/content.opf',
    `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${esc(title)}</dc:title><dc:identifier id="uid">${uid}</dc:identifier><dc:language>en</dc:language></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>${manifest}</manifest><spine toc="ncx">${spine}</spine></package>`);

  const tocItems = chapters.map((ch, i) => `<navPoint id="np${i}" playOrder="${i + 1}"><navLabel><text>${esc(ch.title)}</text></navLabel><content src="ch${i}.xhtml"/></navPoint>`).join('');
  zip.file('OEBPS/toc.ncx',
    `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${uid}"/></head><docTitle><text>${esc(title)}</text></docTitle><navMap>${tocItems}</navMap></ncx>`);

  for (let i = 0; i < chapters.length; i++) {
    const paras = stripMd(chapters[i].content).split('\n\n').map(p => p.replace(/\n/g, ' ').trim()).filter(p => p).map(p => `<p>${esc(p)}</p>`).join('\n');
    zip.file(`OEBPS/ch${i}.xhtml`,
      `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${esc(chapters[i].title)}</title><style>body{font-family:serif;margin:2em;line-height:1.6}h1{text-align:center;margin-bottom:1.5em}p{text-indent:1.5em;margin:0.3em 0}</style></head><body><h1>${esc(chapters[i].title)}</h1>${paras}</body></html>`);
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/epub+zip' });
  const out = path.join(projectDir, `${slug}.epub`);
  fs.writeFileSync(out, buffer);
  return out;
}

main().catch(err => { console.error('Export failed:', err.message); process.exit(1); });
