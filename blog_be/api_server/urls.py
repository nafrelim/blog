from django.contrib import admin
from django.urls import path

from .views import ParametersView, PostViewSet, ReportView, ViewViewSet

# Determining what methods are available on each endpoint
post_list = PostViewSet.as_view({"get": "list", "post": "create"})

post_detail = PostViewSet.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

view_list = ViewViewSet.as_view(
    {
        "get": "list",
    }
)

view_detail = ViewViewSet.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
    }
)

admin.autodiscover()

urlpatterns = [
    # path("", api_root),
    path("post/", post_list, name="post-list"),
    path("post/<int:pk>/", post_detail, name="post-detail"),
    path("view/", view_list, name="view-list"),
    path("view/<int:pk>/", view_detail, name="view-detail"),
    path("report/", ReportView.as_view(), name="report"),
    path("parameters/", ParametersView.as_view(), name="report"),
]
