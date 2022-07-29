from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max, Min, Sum

from .models import Post


def post_report():
    posts = Post.objects.all()
    result = posts.aggregate(
        max_views=Max("views"),
        min_views=Min("views"),
        avg_views=Avg("views"),
        sum_views=Sum("views"),
    )

    max_sub_15 = list(
        posts.filter(views__gte=(0.85 * result["max_views"]))
        .order_by("-views")
        .values("id", "title", "views")
    )
    result["max_sub_15"] = max_sub_15

    min_add_15 = list(
        posts.filter(views__lte=(0.15 * result["max_views"]))
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
    result["number_of_posts_views"] = (number_of_posts_views,)
    data = [result]

    return data
