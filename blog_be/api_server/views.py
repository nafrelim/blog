from django.db.models import F
from rest_framework import mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
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
