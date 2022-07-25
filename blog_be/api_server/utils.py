from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from faker import Factory

from .models import Post


def create_post():
    fake = Factory.create("en_US")
    title = fake.paragraph(nb_sentences=1, variable_nb_sentences=True)
    content = fake.paragraph(nb_sentences=40)
    views = fake.pyint(min_value=0, max_value=100)
    return title, content, views


def create_admin():
    try:
        user = User.objects.get(username="admin")
        return user
    except ObjectDoesNotExist:
        user = User.objects.create_superuser(username="admin", password="!234567890")
        user.save()
        return user


def create_author(author):
    try:
        author = User.objects.get(username=author)
        return author
    except ObjectDoesNotExist:
        author = User.objects.create(username=author, is_staff=False)
        author.set_password("!234567890")
        author.save()
        return author


def create_posts(number_of_posts):
    author = create_author("author1")
    for post in range(0, int(number_of_posts / 2)):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)
    author = create_author("author2")
    for post in range(0, number_of_posts - int(number_of_posts / 2)):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)
