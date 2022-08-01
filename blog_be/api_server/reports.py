from math import ceil

from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max, Min, Sum

from .models import Post


def post_report():
    """
    Preparation of data for the report.

    max_views: Maximum number of views for any post
    min_views: Manimum number of views for any post
    avg_views: Average number of post views
    sum_views: Total number of post views
    max_sub_15: List of posts with 15% less views than max_views at most
    min_add_15: List of posts with 15% more views than min_views at most
    number_of_posts_views User: list, count their posts and total views of their posts

    """
    posts = Post.objects.all()

    result = posts.aggregate(
        max_views=Max("views"),
        min_views=Min("views"),
        avg_views=Avg("views"),
        sum_views=Sum("views"),
    )

    result["top_5"] = list(
        posts.order_by("views").reverse().values("id", "title", "views")[0:5]
    )
    result["last_5"] = list(posts.order_by("views").values("id", "title", "views")[0:5])

    max_sub_15 = list(
        posts.filter(views__gte=(0.85 * result["max_views"]))
        .order_by("-views")
        .values("id", "title", "views")
    )
    result["max_sub_15"] = max_sub_15

    min_add_15 = list(
        posts.filter(views__lte=(1.15 * result["min_views"]))
        .order_by("-views")
        .values("id", "title", "views")
    )
    result["min_add_15"] = min_add_15

    number_of_posts_views = list(
        User.objects.annotate(post_count=Count("post"))
        .annotate(total_views=Sum("post__views"))
        .order_by("-total_views")
        .values("id", "username", "post_count", "total_views")
    )
    result["number_of_posts_views"] = number_of_posts_views

    number_of_posts = posts.count()
    posts_on_page = settings.REST_FRAMEWORK["PAGE_SIZE"]
    result["number_of_posts"] = number_of_posts
    result["posts_on_page"] = posts_on_page

    data = [result]

    return data
