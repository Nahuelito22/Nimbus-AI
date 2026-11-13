# Nimbus en el NASA Space Apps Challenge 2026 (Mendoza)

Documento vivo. Última actualización: 12/11/2026.
"Dato" = verificado en páginas oficiales o en el repo. "Idea" = no decidido.

## Regla que manda sobre todo

**La solución al desafío se construye durante el evento (14 y 15/11).** Antes solo se preparan herramientas, entorno, cuentas y la base existente de Nimbus. Todo lo específico del desafío queda para el sábado.

## Equipo (dato)

- Nombre: **Nimbus AI Mendoza**. Máximo 6 miembros.
- **Nahuel Ghilardi**: desarrollo, data science, autor de Nimbus.
- **Stefanía Frigole**: comercialización, marketing, investigación de mercado.
- Tomás Pont fue aprobado y se retiró. Quedamos 2: nos faltan perfiles de agronomía y diseño.
- Desafío cargado (provisorio): *Field Shift: Adapting Farms with NASA Data*.

## Evento (dato, confirmar horarios)

- Capacitación: viernes 13/11, Espacio Cultural Julio Le Park.
- Hackathon: sábado 14 y domingo 15, Facultad de Arquitectura, Urbanismo y Diseño, Universidad de Mendoza (Av. Boulogne Sur Mer 649-699).
- El 13/11 se publican los recursos de cada desafío y las guías de entrega y evaluación.
- La entrega debe describir cómo se usaron herramientas de IA → ver `registro-uso-ia.md`.

## Estado real de Nimbus (dato, revisado en el repo el 12/10 y el 12/11)

- Web: React + Vite + Tailwind en Vercel. Backend: **Flask** en un Space de Hugging Face. API del modelo: FastAPI en otro Space.
- Modelo multimodal: 21–22 variables diarias (NOAA + Open-Meteo) + imágenes GOES (NOAA: GOES-16 para entrenar y GOES-19 en producción).
- **Métricas:** V3.0 tuvo recall 0,70 y precisión 0,21 (base 10,6 %). V3.1 con el umbral desplegado (0,56) no detecta ningún granizo del test. El test se usó para ajustar ambos modelos. **No presentar "recall 100 %".**
- Datos NASA usados hoy: **ninguno.** Open-Meteo y NOAA no son NASA.
- Dataset: 37.399 estación-día (5 estaciones, 2000–2024), 95 positivos en 86 fechas, etiquetados a partir de noticias y TuTiempo.

Cómo contarlo: "prototipo multimodal de granizo para Mendoza; encontramos fugas de validación en V3.1 y lo estamos rehaciendo con rigor".

## Ideas de encaje con datos NASA (idea)

1. **Field Shift con una capa de riesgo climático (la preferida por Nahuel).** Herramienta para productores de Mendoza (por ejemplo, viñedos) que compara al menos 3 estrategias. Ejemplos: la actual, sumar malla antigranizo, o cambiar la variedad o la fecha. La evidencia viene de datos NASA:
   - NASA POWER: clima histórico y grados-día.
   - SMAP: humedad del suelo.
   - GPM IMERG: precipitación y tormentas.
   - MODIS/Landsat: NDVI y estado del cultivo.
   - ECOSTRESS: estrés hídrico.

   Nimbus aporta el riesgo de granizo como una de las variables. El enunciado pide **rotación de cultivos**: hay que confirmar con los coordinadores que "estrategias de manejo ante el riesgo" en un cultivo perenne cuenta.
2. **Trend Detective con Mendoza como caso de estudio.** Analizar si aumentan los días propicios para tormentas con GPM IMERG y MERRA-2, usando la prueba de Mann-Kendall. Es el más fácil de terminar en 48 h, pero tiene menos impacto agrícola directo.
3. **Hot Spots:** falta leer el enunciado completo.

## Preguntas para los coordinadores (13/11)

1. ¿Se puede usar Nimbus como base previa si el trabajo del desafío se hace en el evento? ¿Cómo se declara?
2. ¿En Field Shift cuentan las estrategias de manejo de cultivos perennes (viñedo) o tiene que ser estrictamente rotación?
3. ¿Los datos de NOAA (GOES) suman, o el jurado quiere que el núcleo sean misiones NASA?
4. ¿Hay mentores de agronomía o ciencias de la Tierra? ¿Nos pueden sugerir integrantes con ese perfil (somos 2)?
5. ¿Hay que desplegar la solución o alcanza con un demo y un video? ¿Formato y duración del video?
6. ¿A qué hora empieza el domingo y a qué hora cierra la entrega exactamente?
7. ¿Cómo hay internet en la sede? (bajar datos NASA puede pesar varios GB)
8. ¿Hay premios o categorías locales con criterios distintos de los globales?
9. ¿El código tiene que ser público y con qué licencia? (Nimbus es MIT)

## Preparación permitida antes del sábado

- [ ] Crear cuenta de NASA Earthdata (urs.earthdata.nasa.gov) y aprobar las apps GES DISC y LP DAAC.
- [ ] `pip install -r requirements-hackathon.txt` y correr `python tools/check_earthdata.py`.
- [ ] Nimbus presentable: seguridad, README honesto y landing nueva.
- [ ] Repartir roles con Stefanía: ella toma usuario, propuesta de valor, pitch y video.
- [ ] Llevar notebook, cargador, zapatilla y datos de ejemplo bajados de antemano por si falla la conexión.

## Decisiones pendientes

- Desafío final (se decide después de leer los recursos del 13/11).
- Qué modelo se muestra: V3.0 (no está en el repo; buscar `multimodal_v3_best.keras` en Drive) o un modelo de referencia simple y honesto.
- Plan de las 48 h.
