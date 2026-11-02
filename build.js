#!/usr/bin/env node
// Une index.html + css/ + js/ en un solo archivo (dist/RagChewLab.html).
// Ese archivo se puede abrir con doble clic, sin conexión y sin servidor.
// Antes de unir, sincroniza el ?v= de index.html con la versión de package.json,
// para que el navegador no use copias viejas en caché después de cada versión nueva.
// Uso: node build.js
const fs = require('fs'), path = require('path');
const root = __dirname;
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const version = JSON.parse(read('package.json')).version;

// 1) index.html: todas las referencias locales a css/ y js/ llevan ?v=<versión>
const src = read('index.html');
const synced = src.replace(/((?:href|src)="(?:css|js)\/[^"?]+)(?:\?v=[^"]*)?"/g, '$1?v=' + version + '"');
if (synced !== src) {
  fs.writeFileSync(path.join(root, 'index.html'), synced);
  console.log('index.html: ?v= actualizado a ' + version);
}
let html = synced;

// 2) el pie de página (js/04-i18n.js) tiene que mostrar la misma versión
if (!read('js/04-i18n.js').includes('· v' + version)) {
  console.error('✖ js/04-i18n.js no muestra "· v' + version + '" en el pie de página: actualizalo.');
  process.exitCode = 1;
}

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g,
  (m, f) => '<style>\n' + read(f.split('?')[0]) + '</style>');

const js = [];
html = html.replace(/<script src="([^"]+)"><\/script>\n?/g,
  (m, f) => { js.push(read(f.split('?')[0])); return ''; });
html = html.replace('</body>', () => '<script>\n' + js.join('\n') + '</script>\n</body>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'RagChewLab.html'), html);
console.log('Generado dist/RagChewLab.html (' + Math.round(html.length / 1024) + ' KB)');
