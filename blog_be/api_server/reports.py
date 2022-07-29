from django.contrib.auth.models import User
from django.db.models import Avg, Count, Max, Min, Sum

from .models import Post


def post_report():
    data = []
    max_views = Post.objects.all().aggregate(max_views=Max("views"))["max_views"]
    min_views = Post.objects.all().aggregate(min_views=Min("views"))["min_views"]
    avg_views = Post.objects.all().aggregate(avg_views=Avg("views"))["avg_views"]
    sum_views = Post.objects.all().aggregate(sum_views=Sum("views"))["sum_views"]
    views = Post.objects.all()
    max_sub_15 = list(
        views.filter(views__gte=(0.85 * max_views))
        .order_by("-views")
        .values("id", "title", "views")
    )
    min_add_15 = list(
        views.filter(views__lte=(0.15 * max_views))
        .order_by("-views")
        .values("id", "title", "views")
    )

    number_of_posts_views = list(
        User.objects.annotate(post_count=Count("post"))
        .annotate(total_views=Sum("post__views"))
        .order_by("-total_views")
        .values("id", "username", "post_count", "total_views")
    )

    # result_max_15 = []
    # for item in max_sub_15:
    #     result_max_15.append(
    #         {
    #             'id': item.pk,
    #             'title': item.title,
    #             'views': item.views,
    #         }
    #     )
    # result_min_15 = []
    # for item in min_add_15:
    #     result_min_15.append(
    #         {
    #             'id': item.pk,
    #             'title': item.title,
    #             'views': item.views,
    #         }
    #     )
    data.append(
        {
            "max_views": max_views,
            "min_views": min_views,
            "avg_views": avg_views,
            "sum_views": sum_views,
            "number_of_posts_views": number_of_posts_views,
            "max_sub_15": max_sub_15,
            "min_add_15": min_add_15,
        }
    )

    return data
