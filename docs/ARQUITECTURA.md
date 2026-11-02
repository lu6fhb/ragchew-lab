# Arquitectura

La app es HTML + CSS + JavaScript puro, sin librerías. Para usarla no hace falta compilar nada; `build.js` solo prepara la publicación (ver más abajo). Los scripts se cargan en orden desde `index.html` y comparten el mismo ámbito global (por eso las funciones y constantes de un archivo se usan en los siguientes).

| Archivo | Qué contiene |
|---|---|
| `js/01-base.js` | Tabla Morse, ayudantes (`$`, `num`), guardado de ajustes en el navegador |
| `js/02-audio.js` | Generador de tono con envolvente suave, codificador Morse con estilos humanos (`enc`) y Farnsworth |
| `js/03-realista.js` | Modo realista: ruido, QSB, filtro, QRM, pileup, shift, errores (`playR`, `sig`, `pileBG`, `realResp`) |
| `js/04-i18n.js` | Todos los textos en español e inglés (objeto `I`; `T('clave')`, `F('clave',{...})`) |
| `js/05-keyer.js` | Keyer iámbico A/B, bug y recto, decodificador adaptativo y teclas configurables (`KEYS`) |
| `js/06-estacion.js` | Perfiles de estaciones (`PR`), frases por idioma (`W`), clima (`WK`) y reconocimiento tolerante de indicativos (`heardCall`, `cdist`) |
| `js/07-motor.js` | Motor de respuesta: tipos de QSO, personalidades, temas, preguntas del usuario (`respond`, `talk`, `afterId`, `asking`) |
| `js/08-flujo.js` | Flujo del QSO: turnos, estación, fin de turno, informe final (`station`, `endTurn`, `finish`) |
| `js/09-progreso.js` | Historial, gráficos y matriz de confusiones (`recConf`, `recSession`, `showProg`) |
| `js/10-modos.js` | Pausa, parada, Nuevo CQ, Práctica libre y su evaluación |
| `js/11-entrenador.js` | Entrenador de copia: generación de contenido y comparación con diferencias |
| `js/12-libreta.js` | Libreta del QSO, lista de registros y validación |
| `js/13-ui.js` | Idioma, botones, diálogo de ajustes, ratón como paddle USB y eventos de la interfaz |
| `js/14-pwa.js` | Registra el service worker (solo con http/https y si la página tiene manifest) |
| `css/style.css` | Estilos (tema oscuro, panel de equipo, diálogo de ajustes) |
| `sw.js` | Service worker: guarda la app en el dispositivo para usarla sin conexión. `build.js` reescribe sus dos primeras constantes |
| `manifest.webmanifest` | Datos para instalarla como app (nombre, colores, íconos) |
| `icons/` | Íconos de la app (`icon.svg`, PNG de 192, 512, maskable y apple-touch) e `og.png` (imagen al compartir el link) |
| `build.js` | Sincroniza versiones, estampa `sw.js` y genera `dist/RagChewLab.html` |

## Cómo modificar cosas comunes

- **Agregar estaciones por defecto:** en `js/06-estacion.js`, agregá un objeto a `PR` (`l: 0` español, `l: 1` inglés).
- **Cambiar o agregar textos:** en `js/04-i18n.js`, cada clave es un arreglo `[español, inglés]`. Para un idioma nuevo, agregá un tercer elemento a cada clave, la opción en el selector de `index.html` y su código en la lista de idiomas de `applyLang` (`js/13-ui.js`) y en los arreglos por idioma de `06-estacion.js` y `07-motor.js`.
- **Nuevos temas de charla:** en `js/07-motor.js`, agregá entradas a `TI` (lo que dice la estación), `TQ` (lo que te pregunta) y `CMT` (cómo comenta lo que le contás), y la clave a la lista `st.tp` dentro de `initSt`.
- **Nuevos tipos de contenido del entrenador:** en `js/11-entrenador.js`, función `genText`, y la opción en `index.html` (`#tc`).
- **Colores:** variables al comienzo de `css/style.css`.

## Publicar una versión nueva

1. Subí la versión en `package.json` y en el pie de página (`· vX.Y.Z` en `js/04-i18n.js`, dos veces: español e inglés), y anotala en `CHANGELOG.md`.
2. Corré `node build.js`. Actualiza el `?v=` de `index.html` (así el navegador no usa archivos viejos), estampa `sw.js` y regenera `dist/RagChewLab.html`.
3. Commiteá todo, incluidos `index.html`, `sw.js` y `dist/`. El workflow `.github/workflows/ci.yml` corre `node build.js` en cada push y pull request y falla si queda algo sin commitear.

`sw.js` usa la caché primero. Su versión incluye una huella del contenido de los archivos, así que cualquier cambio en la app hace que quienes la tienen instalada reciban la actualización en la visita siguiente, aunque no cambies el número de versión. Si agregás un `.js` o `.css`, referencialo en `index.html`: `build.js` lo suma solo a la lista del service worker.

## Datos guardados en el navegador (localStorage)

`cwb_hist` (sesiones), `cwb_conf` (confusiones), `cwb_logbook` (libreta), `cwb_keys` (teclas), `cwb_chk`, `cwb_seen` y los ajustes de la interfaz (`cwb_<id>`). No se envía nada a ningún servidor. Los archivos de la app, en cambio, quedan en la caché del service worker (`ragchew-<versión>`).
