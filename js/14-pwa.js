// ---- PWA: registra el service worker (solo si la página viene por http/https y tiene manifest;
// con doble clic sobre el archivo no hace falta, y la versión dist/ no lleva manifest)
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('link[rel=manifest]'))
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
