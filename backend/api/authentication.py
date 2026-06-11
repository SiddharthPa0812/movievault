from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import AppUser, AuthToken


class AppUserTokenAuthentication(BaseAuthentication):
    keyword = "Token"

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith(f"{self.keyword} "):
            return None

        key = auth_header[len(self.keyword) + 1 :].strip()
        if not key:
            return None

        token = AuthToken.objects.select_related("user").filter(key=key).first()
        if not token:
            raise AuthenticationFailed("Invalid or expired token.")

        return (token.user, token)
