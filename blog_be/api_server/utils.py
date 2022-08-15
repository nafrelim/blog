import random

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from faker import Factory

from .models import Comment, Post

authors = ["admin", "author1", "author2", "author3", "author4"]


def create_post():
    """
    Create one fake post.
    """
    fake = Factory.create("en_US")
    title = fake.paragraph(nb_sentences=1, variable_nb_sentences=True)
    content = fake.paragraph(nb_sentences=40)
    views = fake.pyint(min_value=0, max_value=100)
    created = fake.date_time_between(start_date="-30d", end_date="now")
    return title, content, views, created


def create_comment():
    """
    Create one fake post.
    """
    fake = Factory.create("en_US")
    content = fake.paragraph(nb_sentences=5)
    created = fake.date_time_between(start_date="-30d", end_date="now")
    return content, created


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

    author_list = authors.copy()

    author_name = random.choice(author_list)
    author_list.remove(author_name)
    total_posts = 0
    author = create_author(author_name)
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views, created = create_post()
        Post.objects.create(
            title=title, content=content, views=views, author=author, created=created
        )

    author_name = random.choice(author_list)
    author_list.remove(author_name)
    author = create_author(author_name)
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views, created = create_post()
        Post.objects.create(
            title=title, content=content, views=views, author=author, created=created
        )

    author_name = random.choice(author_list)
    author_list.remove(author_name)
    author = create_author(author_name)
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views, created = create_post()
        Post.objects.create(
            title=title, content=content, views=views, author=author, created=created
        )

    author_name = random.choice(author_list)
    author_list.remove(author_name)
    author = create_author(author_name)
    posts = random.randrange(10, int(number_of_posts / 3))
    total_posts += posts
    for post in range(0, posts):
        title, content, views, created = create_post()
        Post.objects.create(
            title=title, content=content, views=views, author=author, created=created
        )

    author = create_author(author_list[0])
    posts = number_of_posts - total_posts
    for post in range(0, posts):
        title, content, views, created = create_post()
        Post.objects.create(
            title=title, content=content, views=views, author=author, created=created
        )


def create_comments():
    posts = Post.objects.all()
    user = User.objects.all()
    for post in posts:
        for comment in range(0, random.randrange(0, 20)):
            content, created = create_comment()
            Comment.objects.create(
                content=content,
                post=post,
                comment_author=user[random.randrange(0, len(user))],
                created=created,
            )
