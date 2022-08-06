FROM python:3
ENV PYTHONUNBUFFERED=1

WORKDIR .

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
#ADD manage.py /blog-be
#ADD /authentication /blog-be
#ADD /api_server /blog-be
#ADD /blog_be /blog-be
#RUN python manage.py makemigrations
#RUN python manage.py migrate
#RUN python manage.py populateblog 100
EXPOSE ${DOCKER_BE_PORT}
CMD ["python", "manage.py", "runserver", "0.0.0.0:8888"]
#RUN python manage.py runserver

