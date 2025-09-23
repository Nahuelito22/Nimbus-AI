# Usamos la imagen base oficial de Python 3.12
FROM python:3.12-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /code

# Copiamos nuestro archivo de requerimientos
COPY ./requirements.txt /code/requirements.txt

# Instalamos las librerías
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiamos todo el código de nuestro proyecto al contenedor
# (src, data, models, etc.)
COPY . /code/

# Le decimos al servidor en qué puerto debe correr la aplicación
EXPOSE 7860

# El comando final para iniciar el servidor Uvicorn
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "7860"]