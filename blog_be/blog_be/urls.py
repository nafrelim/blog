from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api_server.urls"), name="api"),
    path("auth/", include("authentication.urls")),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
    path(
        "schema/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger",
    ),
]

urlpatterns += [path("silk/", include("silk.urls", namespace="silk"))]
