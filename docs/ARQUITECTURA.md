# Arquitectura

La app es HTML + CSS + JavaScript puro, sin librerías ni pasos de compilación. Los scripts se cargan en orden desde `index.html` y comparten el mismo ámbito global (por eso las funciones y constantes de un archivo se usan en los siguientes).

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
| `css/style.css` | Estilos (tema oscuro, panel de equipo, diálogo de ajustes) |

## Cómo modificar cosas comunes

- **Agregar estaciones por defecto:** en `js/06-estacion.js`, agregá un objeto a `PR` (`l: 0` español, `l: 1` inglés).
- **Cambiar o agregar textos:** en `js/04-i18n.js`, cada clave es un arreglo `[español, inglés]`. Para un idioma nuevo, agregá un tercer elemento a cada clave, la opción en el selector de `index.html` y su código en la lista de idiomas de `applyLang` (`js/13-ui.js`) y en los arreglos por idioma de `06-estacion.js` y `07-motor.js`.
- **Nuevos temas de charla:** en `js/07-motor.js`, agregá entradas a `TI` (lo que dice la estación), `TQ` (lo que te pregunta) y `CMT` (cómo comenta lo que le contás), y la clave a la lista `st.tp` dentro de `initSt`.
- **Nuevos tipos de contenido del entrenador:** en `js/11-entrenador.js`, función `genText`, y la opción en `index.html` (`#tc`).
- **Colores:** variables al comienzo de `css/style.css`.

## Datos guardados en el navegador (localStorage)

`cwb_hist` (sesiones), `cwb_conf` (confusiones), `cwb_logbook` (libreta), `cwb_keys` (teclas), `cwb_chk`, `cwb_seen` y los ajustes de la interfaz (`cwb_<id>`). No se envía nada a ningún servidor.
