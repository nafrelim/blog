FROM python:3.14
ENV PYTHONUNBUFFERED=1

WORKDIR /blog

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN SECRET_KEY=build-only DEBUG=False DB_HOST=localhost DOCKER_DB_PORT=5432 \
    DB_NAME=build DB_USER=build DB_PASSWORD=build \
    python manage.py collectstatic --noinput
#ADD manage.py /blog-be
#ADD /authentication /blog-be
#ADD /api_server /blog-be
#ADD /blog_be /blog-be
#RUN python manage.py makemigrations
#RUN python manage.py migrate
#RUN python manage.py populateblog 100

EXPOSE ${BE_PORT}
#CMD ["python", "manage.py", "runserver", "0.0.0.0:${BE_PORT}", "pytest"]
#RUN python manage.py runserver
