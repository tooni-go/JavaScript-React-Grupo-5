const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

// Map of manual ID renames for PlantaBaja
const renames = {
  'rect5': 'Aula-PB22',
  'path47': 'Aula-Comedor',
  'muro_patio': 'Aula-Patio-1',
  'rect53': 'Aula-Patio-Taller'
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Rename specific IDs
  if (file === 'PlantaBaja.svg') {
    for (const [oldId, newId] of Object.entries(renames)) {
      content = content.replace(new RegExp(`id="${oldId}"`, 'g'), `id="${newId}"`);
    }
  }

  // 2. Fix fill:none for any element whose ID starts with Aula-
  // This is a bit tricky with regex, we can match the whole tag
  const tagRegex = /<(rect|path|circle|polygon|polyline)([^>]+id="Aula-[^>]+)>/g;
  content = content.replace(tagRegex, (match, tag, attrs) => {
    // If it has fill:none, replace it
    if (attrs.includes('fill:none')) {
      attrs = attrs.replace(/fill:none/g, 'fill:currentColor;fill-opacity:0');
    }
    // Also if it lacks fill:currentColor;fill-opacity:0 and doesn't have it, we could add it, 
    // but usually it's just fill:none that breaks it since my previous script fixed the others.
    return `<${tag}${attrs}>`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed styles and IDs in ${file}`);
  }
});
