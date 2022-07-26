from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ChangePasswordView,
    DetailUserView,
    ListUserView,
    RegisterUserView,
    UpdateUserView,
)

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="auth_refresh"),
    path(
        "update_profile/<int:pk>/", UpdateUserView.as_view(), name="auth_update_profile"
    ),
    path("user/", ListUserView.as_view(), name="users"),
    path("user/<int:pk>/", DetailUserView.as_view(), name="user_detail"),
    path(
        "change_password/<int:pk>/",
        ChangePasswordView.as_view(),
        name="auth_change_password",
    ),
]
