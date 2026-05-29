/**
 * El servidor del poli (PM2) arranca dist/index.js.
 * Nest compila a dist/src/main.js — este archivo puente los conecta.
 */
const fs = require('fs');
const path = require('path');

const entry = path.join(__dirname, '..', 'dist', 'index.js');
const main = path.join(__dirname, '..', 'dist', 'src', 'main.js');

if (!fs.existsSync(main)) {
  console.error('No existe dist/src/main.js. Ejecutá "pnpm run build" primero.');
  process.exit(1);
}

fs.writeFileSync(entry, "require('./src/main.js');\n");
console.log('Creado dist/index.js → dist/src/main.js');
