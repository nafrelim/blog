import pytest
from api_server.models import Comment, Post
from api_server.utils import create_admin, create_author, create_comment, create_post
from rest_framework.test import APIClient


@pytest.fixture
def client():
    client = APIClient()
    return client


@pytest.fixture
def set_up():
    """
    Set up test data: 1 admin, 1 author, 10 posts.
    """
    admin = create_admin()
    author1 = create_author("author1")
    author2 = create_author("author2")
    for _ in range(0, 10):
        title, post_content, views, post_created = create_post()
        post = Post.objects.create(
            title=title,
            content=post_content,
            views=views,
            author=author1,
            created=post_created,
        )
        comment_content, comment_created = create_comment()
        Comment.objects.create(
            post=post,
            content=comment_content,
            created=comment_created,
            comment_author=admin,
        )
        comment_content, comment_created = create_comment()
        Comment.objects.create(
            post=post,
            content=comment_content,
            created=comment_created,
            comment_author=author2,
        )
