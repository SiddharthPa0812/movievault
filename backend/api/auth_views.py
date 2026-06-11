from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .auth_service import (
    is_username_available,
    login_user,
    register_user,
    revoke_auth_token,
    serialize_user,
    validate_username,
)
from .authentication import AppUserTokenAuthentication
from .permissions import IsAuthenticatedAppUser


class AuthRateThrottle(AnonRateThrottle):
    scope = "auth"
    rate = "20/minute"


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def check_username(request):
    username = request.query_params.get("username", "")
    valid, cleaned, error = validate_username(username)

    if not valid:
        return Response({"available": False, "error": error})

    if is_username_available(cleaned):
        return Response({"available": True})

    return Response({"available": False, "error": "This username already exists."})


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def register(request):
    username = request.data.get("username", "")
    email = request.data.get("email", "")
    password = request.data.get("password", "")

    result = register_user(username, email, password)
    if not result.get("ok"):
        return Response({"error": result["error"]}, status=status.HTTP_400_BAD_REQUEST)

    return Response(result, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([AuthRateThrottle])
def login(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")

    result = login_user(username, password)
    if not result.get("ok"):
        return Response({"error": result["error"]}, status=status.HTTP_400_BAD_REQUEST)

    return Response(result)


@api_view(["GET"])
@authentication_classes([AppUserTokenAuthentication])
@permission_classes([IsAuthenticatedAppUser])
def me(request):
    return Response({"user": serialize_user(request.user)})


@api_view(["POST"])
@authentication_classes([AppUserTokenAuthentication])
@permission_classes([IsAuthenticatedAppUser])
def logout(request):
    token = getattr(request.auth, "key", None)
    if token:
        revoke_auth_token(token)
    return Response({"ok": True})
