import random

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from faker import Factory

from .models import Post


def create_post():
    """
    Create one fake post.
    """
    fake = Factory.create("en_US")
    title = fake.paragraph(nb_sentences=1, variable_nb_sentences=True)
    content = fake.paragraph(nb_sentences=40)
    views = fake.pyint(min_value=0, max_value=100)
    return title, content, views


def create_admin():
    """
    Create admin user.
    """
    try:
        user = User.objects.get(username="admin")
        return user
    except ObjectDoesNotExist:
        fake = Factory.create("en_US")
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        user = User.objects.create_superuser(
            username="admin",
            password="!234567890",
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,
        )
        user.save()
        return user


def create_author(author):
    """
    Create fake author.
    """
    try:
        fake = Factory.create("en_US")
        author = User.objects.get(username=author)
        return author
    except ObjectDoesNotExist:
        fake = Factory.create("en_US")
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        author = User.objects.create(
            username=author,
            is_staff=False,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        author.set_password("!234567890")
        author.save()
        return author


def create_posts(number_of_posts):
    """
    Create number_of_posts fake posts.
    """
    total_posts = 0
    author = create_author("admin")
    posts = int(number_of_posts * 0.1)
    total_posts += posts
    for post in range(0, posts):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)

    author = create_author("author1")
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)

    author = create_author("author2")
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)

    author = create_author("author3")
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)

    author = create_author("author4")
    posts = number_of_posts - total_posts
    for post in range(0, posts):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)
