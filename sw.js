// Service worker de RagChew+ Lab: guarda la app en el dispositivo para usarla sin conexión.
// Las dos líneas siguientes las reescribe build.js (versión + huella de los archivos): no editar a mano.
const VERSION = '1.2.0-bc5ebf70';
const ASSETS = ["./","index.html","css/style.css","js/01-base.js","js/02-audio.js","js/03-realista.js","js/04-i18n.js","js/05-keyer.js","js/06-estacion.js","js/07-motor.js","js/08-flujo.js","js/09-progreso.js","js/10-modos.js","js/11-entrenador.js","js/12-libreta.js","js/13-ui.js","js/14-pwa.js","manifest.webmanifest","icons/icon.svg"];
const CACHE = 'ragchew-' + VERSION;

// Instalación: baja todos los archivos de la app (saltando la caché HTTP, para no guardar copias viejas).
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

// Activación: borra las cachés de versiones anteriores.
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('ragchew-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Pedidos: primero lo guardado (ignora ?v=), si no está va a la red; sin red, vuelve a la página principal.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true, cacheName: CACHE }).then(hit => hit ||
    fetch(r).catch(() => r.mode === 'navigate' ? caches.match('./', { cacheName: CACHE }) : Response.error())));
});
