import pytest
from api_server.utils import create_posts
from rest_framework.test import APIClient


@pytest.fixture
def client():
    client = APIClient()
    return client


@pytest.fixture
def set_up():
    create_posts(3)
