import pytest
from api_server.models import Comment, Post
from api_server.utils import create_admin, create_author, create_comment, create_post
from django.contrib.auth.models import User

"""
For /api/post/ get, post, delete, patch, put methods are available, 
but post, delete, put, patch only after admin is logged in.
"""


@pytest.mark.django_db
def login_admin(client):
    create_admin()
    client.force_login(username="admin", password="!234567890")


@pytest.mark.django_db
def login_author(client):
    create_author("author1")
    client.login(username="author1", password="!234567890")


@pytest.mark.django_db
def login_not_author(client):
    create_author("not_author")
    client.login(username="not_author", password="!234567890")


@pytest.mark.django_db
def test_get_post_list_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    response = client.get("/api/post/", format="json")
    assert response.status_code == 200
    assert Post.objects.count() == response.data["count"]


@pytest.mark.django_db
def test_get_post_list_author_logged_out(client, set_up):
    response = client.get("/api/post/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_get_post_detail_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", {}, format="json")
    assert response.status_code == 200
    for field in ("author", "title", "content", "created", "updated"):
        assert field in response.data
    # The views field should not be available on /api/post
    assert "views" not in response.data


@pytest.mark.django_db
def test_get_post_detail_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", {}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_add_post_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    blog_before = Post.objects.count()
    title, content, views, created = create_post()
    new_post = {
        "title": title,
        "content": content,
        "author": user.username,
    }
    response = client.post("/api/post/", new_post, format="json")
    assert response.status_code == 201
    assert Post.objects.count() == blog_before + 1
    for key, value in new_post.items():
        assert key in response.data
        if isinstance(value, list):
            # Compare contents regardless of their order
            assert len(response.data[key]) == len(value)
        else:
            assert response.data[key] == value


@pytest.mark.django_db
def test_add_post_author_logged_out(client, set_up):
    title, content, views, created = create_post()
    new_post = {
        "title": title,
        "content": content,
        "author": "author1",
    }
    response = client.post("/api/post/", new_post, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_post_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.delete(f"/api/post/{post.id}/", format="json")
    assert response.status_code == 204
    post_ids = [post.id for post in Post.objects.all()]
    assert post.id not in post_ids


@pytest.mark.django_db
def test_delete_post_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.delete(f"/api/post/{post.id}/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_post_not_author_logged(client, set_up):
    create_author("not_author")
    user = User.objects.get(username="not_author")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.delete(f"/api/post/{post.id}/", format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_patch_post_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    post_data = response.data
    old_title = post_data["title"]  # no change
    new_content = "New content"
    post_data["content"] = new_content
    response = client.patch(f"/api/post/{post.id}/", post_data, format="json")
    assert response.status_code == 200
    post_obj = Post.objects.get(id=post.id)
    assert post_obj.title == old_title
    assert post_obj.content == new_content


@pytest.mark.django_db
def test_patch_post_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_patch_post_not_author_logged(client, set_up):
    create_author("not_author")
    user = User.objects.get(username="not_author")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    post_data = response.data
    new_content = "New content"
    post_data["content"] = new_content
    response = client.patch(f"/api/post/{post.id}/", post_data, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_put_post_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    post_data = response.data
    new_title = "New title"
    post_data["title"] = new_title
    new_content = "New content"
    post_data["content"] = new_content
    post_data["author"] = "author1"
    response = client.put(f"/api/post/{post.id}/", post_data, format="json")
    assert response.status_code == 200
    post_obj = Post.objects.get(id=post.id)
    assert post_obj.title == new_title
    assert post_obj.content == new_content


@pytest.mark.django_db
def test_put_post_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_put_post_not_author_logged(client, set_up):
    create_author("not_author")
    user = User.objects.get(username="not_author")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post/{post.id}/", format="json")
    post_data = response.data
    new_title = "New title"
    post_data["title"] = new_title
    new_content = "New content"
    post_data["content"] = new_content
    post_data["author"] = "author1"
    response = client.put(f"/api/post/{post.id}/", post_data, format="json")
    assert response.status_code == 403


"""
For /api/view/ only the get, patch, put methods are available, but put and patch only after admin is logged in
"""


@pytest.mark.django_db
def test_get_view_list_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    response = client.get("/api/view/", {}, format="json")
    assert response.status_code == 200
    assert Post.objects.count() == response.data["count"]


@pytest.mark.django_db
def test_get_view_list_author_logged_out(client, set_up):
    response = client.get("/api/view/", {}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_get_view_detail_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    assert response.status_code == 200
    assert "views" in response.data
    # Only the views and id fields should be available on /api/view
    for field in ("author", "title", "content", "created", "updated"):
        assert field not in response.data


@pytest.mark.django_db
def test_get_view_detail_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_view_author_logged(client, set_up):
    login_author(client)
    post = Post.objects.first()
    response = client.delete(f"/api/view/{post.id}/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_patch_views_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    views_data = response.data
    new_number_of_views = 1111
    views_data["views"] = new_number_of_views
    response = client.patch(f"/api/view/{post.id}/", views_data, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_patch_views_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    views_data = response.data
    new_number_of_views = 1111
    views_data["views"] = new_number_of_views
    response = client.patch(f"/api/view/{post.id}/", views_data, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_put_views_author_logged(client, set_up):
    create_author("not_author")
    user = User.objects.get(username="not_author")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    views_data = response.data
    new_number_of_views = 1111
    views_data["id"] = post.id
    views_data["views"] = new_number_of_views
    response = client.put(f"/api/view/{post.id}/", views_data, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_put_views_admin_logged(client, set_up):
    create_admin()
    user = User.objects.get(username="admin")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    views_data = response.data
    new_number_of_views = 1111
    views_data["id"] = post.id
    views_data["views"] = new_number_of_views
    response = client.put(f"/api/view/{post.id}/", views_data, format="json")
    post_obj = Post.objects.get(id=post.id)
    assert response.status_code == 200
    assert post_obj.views == new_number_of_views


@pytest.mark.django_db
def test_put_views_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/view/{post.id}/", format="json")
    assert response.status_code == 401


"""
For /api/comment/ the get, post. deete methods are available, but delete only for logged admin or author of the comment 
"""


@pytest.mark.django_db
def test_add_comment_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    blog_before = Comment.objects.count()
    content, created = create_comment()
    post = Post.objects.first()
    new_comment = {
        "post": post.id,
        "content": content,
        "comment_author": user.username,
    }
    response = client.post("/api/comment/", new_comment, format="json")
    assert response.status_code == 201
    assert Comment.objects.count() == blog_before + 1
    for key, value in new_comment.items():
        assert key in response.data
        if isinstance(value, list):
            # Compare contents regardless of their order
            assert len(response.data[key]) == len(value)
        else:
            assert response.data[key] == value


@pytest.mark.django_db
def test_add_comment_author_logged_out(client, set_up):
    content, created = create_comment()
    post = Post.objects.first()
    new_post = {"content": content, "author": "author1", "post": post.id}
    response = client.post("/api/comment/", new_post, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_get_comment_list_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    response = client.get("/api/comment/", format="json")
    assert response.status_code == 200
    assert Comment.objects.count() == response.data["count"]


@pytest.mark.django_db
def test_get_comment_list_author_logged_out(client, set_up):
    response = client.get("/api/comment/", format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_get_comment_detail_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    comment = Comment.objects.first()
    response = client.get(f"/api/comment/{comment.id}/", {}, format="json")
    assert response.status_code == 200
    for field in ("post", "content", "comment_author", "created"):
        assert field in response.data


@pytest.mark.django_db
def test_get_comment_detail_logged_out(client, set_up):
    comment = Comment.objects.first()
    response = client.get(f"/api/comment/{comment.id}/", {}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_put_and_patch_comment_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    content, created = create_comment()
    post = Post.objects.first()
    # comment = Comment.objects.first()
    new_comment = {
        "post": post.id,
        "content": content,
        "comment_author": user.username,
    }
    response = client.put("/api/comment/", new_comment)
    assert response.status_code == 405
    new_comment = {
        "content": content,
    }
    response = client.put("/api/comment/", new_comment)
    assert response.status_code == 405


"""
For /api/post_comments/ the get methon only is available for logged in user 
"""


@pytest.mark.django_db
def test_get_comment_list_of_post_author_logged(client, set_up):
    user = User.objects.get(username="author1")
    client.force_authenticate(user=user, token=None)
    post = Post.objects.first()
    response = client.get(f"/api/post_comments/{post.id}/", format="json")
    assert response.status_code == 200
    assert Comment.objects.filter(post=post).count() == response.data["count"]


@pytest.mark.django_db
def test_get_comment_list_of_post_author_logged_out(client, set_up):
    post = Post.objects.first()
    response = client.get(f"/api/post_comments/{post.id}/")
    assert response.status_code == 401
