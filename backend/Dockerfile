# Dockerfile para TaskMaster (Django + React)

# Etapa 1: Build del frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Backend y producción
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev gcc curl && \
    rm -rf /var/lib/apt/lists/*

# Copiar y preparar el backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --upgrade pip && pip install -r backend/requirements.txt
COPY backend/ ./backend/

# Copiar el build del frontend al backend (si usas Django para servir archivos estáticos)
COPY --from=frontend-build /app/frontend/build ./backend/static/

# Variables de entorno para Django
ENV DJANGO_SETTINGS_MODULE=config.settings

# Comando por defecto (puedes cambiarlo por gunicorn para producción real)
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]
