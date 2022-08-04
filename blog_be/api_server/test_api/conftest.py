import pytest
from api_server.models import Post
from api_server.utils import create_author, create_post
from rest_framework.test import APIClient


@pytest.fixture
def client():
    client = APIClient()
    return client


@pytest.fixture
def set_up():
    create_author("admin")
    author = create_author("author1")
    for _ in range(0, 10):
        title, content, views = create_post()
        Post.objects.create(title=title, content=content, views=views, author=author)
