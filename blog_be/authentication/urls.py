from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, ChangePasswordView, UserListView, UserDetailView


urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="auth_refresh"),
    path('change_password/<int:pk>/', ChangePasswordView.as_view(), name='auth_change_password'),
    path("user/", UserListView.as_view(), name="users"),
    path("user/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
]
