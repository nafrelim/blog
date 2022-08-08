from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import F
from django.http import Http404
from rest_framework import mixins
from rest_framework.decorators import api_view
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from .models import Post
from .permissions import (
    IsAuthenticatedAndAuthorPost,
    IsAuthenticatedAndSafeMethodOrAdmin,
)
from .reports import get_report
from .serializers import (
    CountViewsSerializer,
    ParametersSerializer,
    PostSerializer,
    ReportSerializer,
)


class PostViewSet(ModelViewSet):
    """
    View for handling the post endpoint.
    """

    permission_classes = [IsAuthenticatedAndAuthorPost]
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("title",)
    ordering_fields = ("created", "updated", "author")
    serializer_class = PostSerializer
    view_name = "post"

    def get_object(self):
        try:
            post = Post.objects.get(pk=self.kwargs.get("pk"))
            self.check_object_permissions(self.request, post)
            return post
        except Post.DoesNotExist:
            raise Http404

    def get_queryset(self):
        queryset = Post.objects.select_related("author").all().order_by("-created")
        username = self.request.query_params.get("author")
        if username != "all" and username is not None:
            queryset = queryset.filter(author__username=username)
        return queryset


class ViewViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    """
    A view to support the endpoint of the number of views of post.
    """

    permission_classes = [IsAuthenticatedAndSafeMethodOrAdmin]
    filter_backends = (OrderingFilter,)
    ordering_fields = ("views",)
    queryset = Post.objects.all()
    serializer_class = CountViewsSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.author:
            instance.views = F("views") + 1
            instance.save()
        return super().retrieve(request, *args, **kwargs)


class ReportView(APIView):
    """
    Report generation view. The report components are created in the get_report function.
    """

    permission_classes = [IsAdminUser & IsAuthenticated]

    def get(self, request):
        data = get_report()
        serializer = ReportSerializer(instance=data, many=True)
        return Response(data=serializer.data)


class ParametersView(APIView):
    """
    Generating parameters needed in the blog_fe application.
    """

    permission_classes = [IsAuthenticatedAndAuthorPost]

    def get(self, request):
        result = {
            "posts_on_page": settings.REST_FRAMEWORK["PAGE_SIZE"],
            "authors": [author.username for author in User.objects.all()],
        }
        serializer = ParametersSerializer(instance=[result], many=True)
        return Response(data=serializer.data)


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
