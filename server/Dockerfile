# Dockerfile para el backend
FROM python:3.6

ENV PYTHONUNBUFFERED 1

WORKDIR /server

# Copiar los archivos de requerimientos y luego instalarlos
# COPY requirements.txt /server/


# Copiar el resto del código del proyecto
COPY . /server/

# Ejecutar comandos de Django
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
RUN python manage.py collectstatic --no-input
# RUN python manage.py makemigrations
# RUN python manage.py migrate
# RUN python build.py

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]





