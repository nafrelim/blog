from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularSwaggerView  # new
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.views import get_swagger_view

swagger_schema_view = get_swagger_view(title="CTV BLOG API")
schema_view = get_schema_view(title="CTV BLOG API")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api_server.urls"), name="api"),
    path("auth/", include("authentication.urls")),
    # path('rest-auth/', include('dj_rest_auth.urls')),
    # path('rest-auth/password/reset/confirm/<str:uidb64>/<str:token>', PasswordResetConfirmView.as_view(),
    #      name='password_reset_confirm'),  # musi być na górze
    # path('rest-auth/registration/', include('dj_rest_auth.registration.urls')),
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
