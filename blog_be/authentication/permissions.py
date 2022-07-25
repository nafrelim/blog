from rest_framework import permissions


class IsAdminUserOrLoggedIn(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Access permissions are only allowed to the logged in author or admin
        return obj.id == request.user.id or request.user.is_staff
