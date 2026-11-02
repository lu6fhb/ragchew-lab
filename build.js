#!/usr/bin/env node
// Prepara la publicación:
//  1. sincroniza el ?v= de index.html con la versión de package.json (cache-busting),
//  2. estampa sw.js con la versión y una huella de los archivos (para que el service worker
//     se actualice solo cuando cambia algo),
//  3. une index.html + css/ + js/ en un solo archivo (dist/RagChewLab.html), que se abre
//     con doble clic, sin conexión y sin servidor.
// Uso: node build.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname;
// Se leen con saltos de línea \n aunque el archivo tenga \r\n (Windows), para que el resultado
// sea el mismo en cualquier computadora y en GitHub Actions.
const read = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
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

// 3) sw.js: lista de archivos a guardar y huella (versión + contenido de esos archivos)
const local = [...synced.matchAll(/(?:href|src)="((?:css|js)\/[^"?]+)/g)].map(m => m[1]);
const files = ['index.html', ...local, 'manifest.webmanifest', 'icons/icon.svg'];
const assets = ['./', ...files];
const hash = crypto.createHash('sha1');
files.forEach(f => hash.update(f).update(read(f)));
const stamp = version + '-' + hash.digest('hex').slice(0, 8);
const sw = read('sw.js');
const sw2 = sw
  .replace(/^const VERSION = .*$/m, () => "const VERSION = '" + stamp + "';")
  .replace(/^const ASSETS = .*$/m, () => 'const ASSETS = ' + JSON.stringify(assets) + ';');
if (sw2 !== sw) {
  fs.writeFileSync(path.join(root, 'sw.js'), sw2);
  console.log('sw.js: versión ' + stamp);
}

// 4) dist/RagChewLab.html: todo en un solo archivo
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g,
  (m, f) => '<style>\n' + read(f.split('?')[0]) + '</style>');

const js = [];
html = html.replace(/<script src="([^"]+)"><\/script>\n?/g,
  (m, f) => { js.push(read(f.split('?')[0])); return ''; });
html = html.replace('</body>', () => '<script>\n' + js.join('\n') + '</script>\n</body>');

// En el archivo único no hay manifest ni íconos al lado: se quitan los <link data-pwa>
// y el favicon SVG se incrusta.
html = html.replace(/<link [^>]*data-pwa[^>]*>\n?/g, '');
html = html.replace(/<link rel="icon" href="([^"]+\.svg)"([^>]*)>/g,
  (m, f, rest) => '<link rel="icon" href="data:image/svg+xml,' + encodeURIComponent(read(f).trim()) + '"' + rest + '>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'RagChewLab.html'), html);
console.log('Generado dist/RagChewLab.html (' + Math.round(html.length / 1024) + ' KB)');
