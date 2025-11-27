# Usamos una imagen base oficial de Python 3.12
FROM python:3.12-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /code

# =======================================================================
# Instalamos las dependencias del sistema necesarias para OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
# =======================================================================

# Copiamos nuestro archivo de requerimientos
COPY ./requirements.txt /code/requirements.txt

# Instalamos las librerías de Python
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiamos todo el código de nuestro proyecto al contenedor
COPY . /code/

# Comando para iniciar la aplicación en Railway/Render
CMD gunicorn src.app:app