# RagChew+ Lab

Compañero virtual y entrenador de telegrafía (CW / Morse) que corre en el navegador. Una estación virtual te llama CQ, conversa con vos, mide cómo manipulás y cómo copiás, y te muestra tu progreso. **Funciona sin conexión a internet** y sin instalar nada.

Hecho por [LU6FHB](https://www.qrz.com/db/LU6FHB).

## Qué hace

- **Nuevo QSO:** la estación llama CQ y conversan (RST, nombre, QTH, equipo, clima, etc.). Responde a tus preguntas (`QTH? QTH? K`, `PSE QTH K`, `WX?`…) y a tus comentarios.
- **Nuevo CQ:** llamás vos y responde la estación (con pileup en modo Realista).
- **Práctica libre:** manipulás lo que quieras y **Evaluar** mide velocidad, espaciado y regularidad.
- **Entrenador de copia:** la estación transmite mensajes de QSO, indicativos, palabras, números, abreviaturas o mezclas; escribís lo que copiás y se resaltan las diferencias.
- **Libreta del QSO:** anotás indicativo, nombre, QTH, RST y notas; se validan contra lo que dijo la estación y se guardan en una lista exportable a CSV.
- **Manipuladores:** iámbico A/B, bug y recto, con teclas configurables, botones táctiles y soporte de paddle USB que el sistema detecta como ratón (clic izquierdo = punto, derecho = raya).
- **Modo realista:** ruido, QSB aleatorio, filtro de CW, interferencias, pileup con shift y errores de la estación. Opción Farnsworth.
- **Progreso:** historial, gráficos y matriz de confusiones por carácter.
- Español e inglés. Sin cuentas, sin servidor, sin IA: todo se calcula en tu navegador y los datos quedan en tu dispositivo.

## Usarlo en tu computadora

1. Descargá o cloná el repositorio.
2. Abrí `index.html` con doble clic. (O, con Python instalado: `python3 -m http.server 8000` y entrá a `http://localhost:8000`.)

## Versión de un solo archivo (para repartir o usar sin conexión)

Requiere [Node.js](https://nodejs.org) solo para este paso:

```bash
node build.js
```

Genera `dist/RagChewLab.html`, un único archivo que se abre con doble clic en cualquier navegador moderno.

## Estructura

```
index.html        página (solo el esqueleto)
css/style.css     estilos
js/               código dividido en módulos numerados (ver docs/ARQUITECTURA.md)
dist/             versión de un solo archivo generada con build.js
docs/             guía de arquitectura y de cómo modificar cosas
build.js          une todo en dist/RagChewLab.html
```

La guía [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) explica qué hace cada archivo y cómo agregar estaciones, textos, idiomas o temas de charla.


## Licencia y privacidad

FREE USE
