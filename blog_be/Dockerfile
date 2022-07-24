FROM python:3
WORKDIR /blog-be

COPY requirements_docker.txt .
RUN pip install -r requirements_docker.txt
COPY . .
#ADD manage.py /blog-be
#ADD /accounts /blog-be
#ADD /api_server /blog-be
#ADD /blog_be /blog-be
RUN python manage.py migrate
RUN python manage.py populateblog 20
EXPOSE 8000
#RUN python manage.py runserver 0.0.0.0:8000

