from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated

from .permissions import IsAdminUserOrLoggedIn
from .serializers import (
    ChangePasswordSerializer,
    RegisterUserSerializer,
    UpdateUserSerializer,
    UserSerializer,
)


class RegisterUserView(generics.CreateAPIView):
    """
    Register a new user.
    """

    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterUserSerializer


class UpdateUserView(generics.UpdateAPIView):
    """
    Update the user.
    """

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserSerializer


class ListUserView(generics.ListAPIView):
    """
    This view is used to get the list of all users.
    """

    permission_classes = [IsAdminUser]  # only for admin users
    queryset = User.objects.all()
    serializer_class = UserSerializer


class DetailUserView(generics.RetrieveAPIView):
    """
    This view is used to get the details of a user.
    """

    permission_classes = [IsAdminUserOrLoggedIn]  # only logged in author or admin
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ChangePasswordView(generics.UpdateAPIView):
    """
    This view is used to change the password of a user.
    """

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
