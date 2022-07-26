from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.views import get_swagger_view

swagger_schema_view = get_swagger_view(title="CTV BLOG API")
schema_view = get_schema_view(title="CTV BLOG API")

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
