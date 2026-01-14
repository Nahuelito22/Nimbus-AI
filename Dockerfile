# 1. Usamos tu versión original (Python 3.12)
FROM python:3.12-slim

# 2. Instalamos dependencias de sistema (OpenCV necesita esto, igual que antes)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 3. --- SECCIÓN NUEVA OBLIGATORIA PARA HUGGING FACE ---
# Creamos un usuario no-root (ID 1000)
RUN useradd -m -u 1000 user

# Cambiamos al usuario 'user'
USER user

# Agregamos las rutas de Python del usuario al PATH
ENV PATH="/home/user/.local/bin:$PATH"

# 4. Directorio de trabajo (Cambiamos /code a /app que es estándar HF, pero da igual)
WORKDIR /app

# 5. Copiamos requirements CON permisos de usuario
# (Si no ponemos --chown, los archivos serán de root y el usuario no podrá leerlos)
COPY --chown=user ./requirements.txt requirements.txt

# 6. Instalamos dependencias
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Aseguramos que gunicorn y gevent estén instalados
RUN pip install gunicorn gevent

# 7. Copiamos el resto del código CON permisos
COPY --chown=user . .

# 8. Exponemos el puerto 7860 (Estándar HF)
EXPOSE 7860

# 9. Comando de arranque
# Ajustado para usar el puerto 7860 explícitamente en lugar de $PORT
CMD ["gunicorn", "--worker-class", "gevent", "--workers", "4", "--bind", "0.0.0.0:7860", "src.app:app"]