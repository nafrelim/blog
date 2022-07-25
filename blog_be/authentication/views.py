from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .permissions import IsAdminUserOrLoggedIn
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer


class RegisterView(generics.CreateAPIView):
    """
    Register a new user.
    """

    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer


class UserListView(generics.ListAPIView):
    """
    This view is used to get the list of all users.
    """

    permission_classes = [IsAdminUser]  # only for admin users
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveAPIView):
    """
    This view is used to get the details of a user.
    """

    permission_classes = [IsAdminUserOrLoggedIn]  # only logged in author or admin
    queryset = User.objects.all()
    serializer_class = UserSerializer
