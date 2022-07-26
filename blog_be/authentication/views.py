from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken

from .permissions import IsAuthenticatedAndAuthorOrAdmin
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

    permission_classes = (IsAuthenticatedAndAuthorOrAdmin,)
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer

    def patch(self, request, *args, **kwargs):
        return Response(
            data={"detail": 'Method "PATCH" not allowed.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class ListUserView(generics.ListAPIView):
    """
    This view is used to get the list of all users.
    """

    permission_classes = (IsAdminUser,)  # only for admin users
    queryset = User.objects.all()
    serializer_class = UserSerializer


class DetailUserView(generics.RetrieveAPIView):
    """
    This view is used to get the details of a user.
    """

    permission_classes = (
        IsAuthenticatedAndAuthorOrAdmin,
    )  # only logged in author or admin
    queryset = User.objects.all()
    lookup_field = "username"
    serializer_class = UserSerializer


class ChangePasswordView(generics.UpdateAPIView):
    """
    This view is used to change the password of a user.
    """

    permission_classes = (IsAuthenticatedAndAuthorOrAdmin,)
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer


class LogoutView(APIView):
    """
    This view is used to log out a user.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class LogoutAllView(APIView):
    """
    This view is used to log out all users.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        tokens = OutstandingToken.objects.filter(user_id=request.user.id)
        for token in tokens:
            t, _ = BlacklistedToken.objects.get_or_create(token=token)
        return Response(status=status.HTTP_205_RESET_CONTENT)
