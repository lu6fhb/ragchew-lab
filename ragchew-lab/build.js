#!/usr/bin/env node
// Une index.html + css/ + js/ en un solo archivo (dist/RagChewLab.html).
// Ese archivo se puede abrir con doble clic, sin conexión y sin servidor.
// Uso: node build.js
const fs = require('fs'), path = require('path');
const root = __dirname;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g,
  (m, f) => '<style>\n' + fs.readFileSync(path.join(root, f), 'utf8') + '</style>');

const js = [];
html = html.replace(/<script src="([^"]+)"><\/script>\n?/g,
  (m, f) => { js.push(fs.readFileSync(path.join(root, f), 'utf8')); return ''; });
html = html.replace('</body>', () => '<script>\n' + js.join('\n') + '</script>\n</body>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'RagChewLab.html'), html);
console.log('Generado dist/RagChewLab.html (' + Math.round(html.length / 1024) + ' KB)');
