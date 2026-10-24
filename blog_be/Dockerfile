FROM python:3.14
ENV PYTHONUNBUFFERED=1

WORKDIR /blog

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN SECRET_KEY=build-only DEBUG=False DB_HOST=localhost DB_PORT=5432 \
    DB_NAME=build DB_USER=build DB_PASSWORD=build \
    python manage.py collectstatic --noinput

EXPOSE 8000
