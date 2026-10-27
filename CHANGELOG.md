# Cambios

## 1.1.1
- Paddle USB que el sistema detecta como ratón: se activa solo al primer clic derecho (antes había que encontrar la casilla en Ajustes, y en un sitio nuevo como GitHub Pages empieza desactivada, por lo que el QSO parecía no responder).
- Los errores internos ahora se muestran en pantalla y, si falla la respuesta de la estación, esta pide repetir en lugar de quedarse muda.
- Los archivos JS y CSS llevan `?v=1.1.1` para que el navegador no use copias viejas guardadas en caché después de actualizar.

## 1.1.0
- Motor de respuesta más inteligente (sigue siendo 100 % sin IA): entiende más formas de preguntar (`WAT QTH`, `PSE RPT QTH`, `CUAL SU QTH?`, `WX HR?`, `HW CPY?`), reconoce respuestas sueltas (`IC705`, `DIPOLE`, `SUNNY`, `2005`, `5W`), no repite preguntas ya respondidas y comenta lo nuevo que le contás (incluida la potencia QRP).
- Si le mandás tu indicativo pegado (`DELU6FHB`) o con errores de manipulación, lo reconoce; el suyo también.
- Datos ilegibles (caracteres `¿`): no los acepta como si fueran nombre o QTH; pide repetir lo que no entendió. Pide nombre y QTH hasta dos veces antes de seguir.
- Los pedidos de repetición al azar y las pérdidas de señal quedan solo para el modo Realista.
- Varios puntos seguidos (6 o más) se interpretan como corrección y borran la palabra anterior; en Práctica libre se cuentan.
- `QRS` y `QRQ` se responden y cambian la velocidad de la estación.
- Se muestra la versión en el pie de página.

## 1.0.0
- Estación virtual por reglas (sin IA, 100 % sin conexión): tipos de QSO (breve, ragchew, DX rápido), personalidades, temas de charla, respuesta a preguntas y comentarios del usuario.
- Modos: Nuevo QSO, Nuevo CQ (llama el usuario), Práctica libre con evaluación y Entrenador de copia.
- Manipuladores: iámbico A y B, bug y recto, con teclas configurables y soporte de paddle USB que se detecta como ratón.
- La estación también envía con distintos estilos (máquina, iámbico, bug, recto humano).
- Modo realista: ruido, QSB aleatorio, filtro de CW, interferencias, pileup con shift y errores de la estación. Farnsworth.
- Libreta del QSO con lista de registros (guardada en el navegador, exportable a CSV) y validación al cerrar.
- Progreso: historial, gráficos y matriz de confusiones por carácter.
- Interfaz oscura, en español e inglés, adaptada a teléfono.
