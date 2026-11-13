# Nimbus

Prototipo de investigación abierto (MIT) que estima la probabilidad de granizo en Mendoza, Argentina, cruzando datos meteorológicos de superficie con imágenes infrarrojas GOES. Autor único: Nahuel Ghilardi. Idioma del proyecto: español (código, commits, UI y docs).

## Arquitectura

| Pieza | Dónde vive | Despliegue |
| --- | --- | --- |
| Frontend (React 18, Vite, Tailwind 3, Leaflet, Recharts) | `frontend/` | Vercel (`nimbusai.com.ar`; también `nimbus-ai-mdz.vercel.app`) |
| Backend (**Flask**, JWT, SQLAlchemy, Alembic) | `src/` (`src/app.py` concentra las rutas) | Space de HF `Nahuelito22/Nimbus-Backend`, desde la rama `deploy-backend` (remote `space`) |
| API del modelo (FastAPI + Keras V3.1) | **No está en este repo**: solo en el Space `Nahuelito22/Nimbus-AI` (`src/api/main.py`) | `nahuelito22-nimbus-ai.hf.space/api/predict` |
| Investigación | `notebooks/01`–`11` (escritos para Colab, rutas de Google Drive) | — |

El backend arma el payload desde Open-Meteo (`src/services/orchestration.py`) y llama a la API del modelo. Esa API descarga sola la imagen GOES-19.

## Datos

- `data/processed/dataset_final_enriquecido.csv`: 37.399 días-estación, 5 estaciones NOAA, 2000–2024; 95 filas con granizo (86 fechas). Las etiquetas salen de noticias y TuTiempo, así que un día sin reporte **no** es un día sin granizo.
- `data/processed/modelo_multimodal/sets_finales/`: train/test en `.npy` y `scaler.pkl` de V3.
- `data/raw/imagenes_satelitales/` (~13 GB) está en `.gitignore`: solo existe en la máquina de Nahuel, no en sesiones en la nube. Hay dos muestras `.nc` en `data/raw/imagenes_satelitales_muestra/`.

## Estado del modelo: no exagerar nunca

V3.0: recall 0,70 y precisión 0,21 (base 10,6 %). V3.1 con el umbral desplegado (0,56): recall 0/10. El test se usó para ajustar ambos modelos, y la división aleatoria por filas mete fuga por fecha. Detalle en el README ("Limitaciones conocidas") y en la sección "Qué sabemos y qué no" de la landing. No escribir "recall 100 %" ni presentar el modelo como sistema de alerta operativo.

## Comandos

```bash
# Backend (venv del proyecto en ./venv)
venv/Scripts/python.exe run.py                      # Flask en :5000
venv/Scripts/python.exe -m pytest                   # tests en src/tests

# Frontend
cd frontend && npm install && npm run dev           # Vite en :5173
cd frontend && npx vite build
cd frontend && npx eslint src/components/landing    # el resto de src tiene errores de lint previos

# Assets de la landing (estadísticas, mapa, imágenes GOES) desde data/
venv/Scripts/python.exe tools/build_landing_assets.py

# Entorno NASA (Space Apps)
pip install -r requirements-hackathon.txt && python tools/check_earthdata.py
```

Jest está configurado pero no instalado (no figura en `package.json`), así que los tests del frontend no corren.

## Forma de trabajo

- Rama de trabajo: `Nahuel_Develop`. Cada cambio va en una rama propia → commit → PR contra `Nahuel_Develop`. Nahuel revisa y mergea; después, un PR de `Nahuel_Develop` a `main` para publicar.
- Pedir autorización antes de commitear o abrir un PR, salvo que Nahuel la dé al empezar la sesión.
- Lo que se instale (skills, MCP, hooks) va a nivel proyecto (`.claude/`, `.mcp.json`); nunca a nivel usuario.
- Nunca commitear secretos. `.env` está ignorado; el remote `space` tiene un token de HF en la URL y no debe copiarse a ningún archivo.
- La landing (`frontend/src/components/landing/`) usa tokens propios en `.landing` (`src/index.css`). Sus datos se generan con `tools/build_landing_assets.py`: no editar `landingData.js` a mano.

## NASA Space Apps 2026 (14–15/11, Mendoza)

Contexto, preguntas y decisiones en `docs/space-apps/contexto.md`. La regla del hackathon es que la solución del desafío se construye **durante el evento**, así que antes solo se preparan herramientas y la base. Todo uso de IA se anota en `docs/space-apps/registro-uso-ia.md`, porque la entrega lo exige.
