from rest_framework.permissions import BasePermission

from .models import AppUser


class IsAuthenticatedAppUser(BasePermission):
    def has_permission(self, request, view):
        return isinstance(getattr(request, "user", None), AppUser)
