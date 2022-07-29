from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max, Min, Sum

from .models import Post


def post_report():
    posts = Post.objects.all()
    max_views = posts.aggregate(max_views=Max("views"))["max_views"]
    min_views = posts.aggregate(min_views=Min("views"))["min_views"]
    avg_views = posts.aggregate(avg_views=Avg("views"))["avg_views"]
    sum_views = posts.aggregate(sum_views=Sum("views"))["sum_views"]

    max_sub_15 = list(
        posts.filter(views__gte=(0.85 * max_views))
        .order_by("-views")
        .values("id", "title", "views")
    )
    min_add_15 = list(
        posts.filter(views__lte=(0.15 * max_views))
        .order_by("-views")
        .values("id", "title", "views")
    )

    number_of_posts_views = list(
        User.objects.annotate(post_count=Count("post"))
        .annotate(total_views=Sum("post__views"))
        .order_by("-total_views")
        .values("id", "username", "post_count", "total_views")
    )

    data = [
        {
            "max_views": max_views,
            "min_views": min_views,
            "avg_views": avg_views,
            "sum_views": sum_views,
            "number_of_posts_views": number_of_posts_views,
            "max_sub_15": max_sub_15,
            "min_add_15": min_add_15,
        }
    ]

    return data
