from django.db.models import Avg, F, Max, Min, Sum
from rest_framework import mixins
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from .models import Post
from .permissions import IsAuthenticatedAndAuthorPost
from .serializers import CountViewsSerializer, PostSerializer


class PostViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedAndAuthorPost]
    serializer_class = PostSerializer
    view_name = "post"

    def get_queryset(self):
        return Post.objects.select_related("author").all()


class ViewViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    permission_classes = [IsAuthenticatedAndAuthorPost]
    queryset = Post.objects.all()
    serializer_class = CountViewsSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Post.objects.filter(id=instance.id).update(views=F("views") + 1)
        return super().retrieve(request, *args, **kwargs)


class ReportView(APIView):
    permission_classes = (IsAdminUser,)
    max_views = Post.objects.all().aggregate(max_views=Max("views"))["max_views"]
    min_views = Post.objects.all().aggregate(min_views=Min("views"))["min_views"]
    avg_views = Post.objects.all().aggregate(avg_views=Avg("views"))["avg_views"]
    sum_views = Post.objects.all().aggregate(sum_views=Sum("views"))["sum_views"]

    def get(self, request):

        return Response(
            {
                "max": self.max_views,
                "min": self.min_views,
                "avg": self.avg_views,
                "sum": self.sum_views,
            }
        )


# View "collecting" ulrs for post and views in DJANGO REST API app
@api_view(["GET"])
def api_root(request, format=None):
    return Response(
        {
            "post list": reverse("post-list", request=request, format=format),
            "view count list": reverse("view-list", request=request, format=format),
            "user list": reverse("user-list", request=request, format=format),
            "schema": reverse("schema", request=request, format=format),
            "redoc": reverse("redoc", request=request, format=format),
            "swagger": reverse("swagger", request=request, format=format),
        }
    )
