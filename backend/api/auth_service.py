import re
import secrets

from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from .models import AppUser, AuthToken

GMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$", re.IGNORECASE)
USERNAME_PATTERN = re.compile(r"^[a-zA-Z0-9_]{3,30}$")
MIN_PASSWORD_LENGTH = 8


def is_gmail_address(email: str) -> bool:
    return bool(email and GMAIL_PATTERN.match(email.strip()))


def normalize_username(username: str) -> str:
    return username.strip().lower()


def validate_username(username: str) -> tuple[bool, str, str]:
    cleaned = normalize_username(username)
    if not cleaned:
        return False, "", "Username is required."
    if not USERNAME_PATTERN.match(cleaned):
        return False, "", "Username must be 3-30 characters and use only letters, numbers, or underscores."
    return True, cleaned, ""


def is_username_available(username: str) -> bool:
    valid, cleaned, _ = validate_username(username)
    if not valid:
        return False
    return not AppUser.objects.filter(username__iexact=cleaned).exists()


def validate_password(password: str) -> tuple[bool, str]:
    if not password or len(password) < MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {MIN_PASSWORD_LENGTH} characters."
    return True, ""


def create_auth_token(user: AppUser) -> str:
    AuthToken.objects.filter(user=user).delete()
    token = AuthToken.objects.create(user=user, key=secrets.token_hex(32))
    return token.key


def serialize_user(user: AppUser, token: str | None = None) -> dict:
    payload = {
        "name": user.name or user.username,
        "username": user.username,
        "email": user.email,
        "picture": "",
    }
    if token:
        payload["token"] = token
    return payload


def register_user(username: str, email: str, password: str) -> dict:
    valid_username, cleaned_username, username_error = validate_username(username)
    if not valid_username:
        return {"ok": False, "error": username_error}

    if not is_username_available(cleaned_username):
        return {"ok": False, "error": "This username already exists."}

    email = email.strip().lower()
    if not is_gmail_address(email):
        return {"ok": False, "error": "Enter a valid Gmail address (example@gmail.com)."}

    if AppUser.objects.filter(email__iexact=email).exists():
        return {"ok": False, "error": "This email is already registered."}

    valid_password, password_error = validate_password(password)
    if not valid_password:
        return {"ok": False, "error": password_error}

    user = AppUser.objects.create(
        username=cleaned_username,
        email=email,
        name=cleaned_username,
        password=make_password(password),
        last_login=timezone.now(),
    )

    token = create_auth_token(user)
    return {"ok": True, "user": serialize_user(user, token)}


def login_user(username: str, password: str) -> dict:
    valid_username, cleaned_username, username_error = validate_username(username)
    if not valid_username:
        return {"ok": False, "error": "Invalid username or password."}

    valid_password, _ = validate_password(password)
    if not valid_password:
        return {"ok": False, "error": "Invalid username or password."}

    user = AppUser.objects.filter(username__iexact=cleaned_username).first()
    if not user or not check_password(password, user.password):
        return {"ok": False, "error": "Invalid username or password."}

    user.last_login = timezone.now()
    user.save(update_fields=["last_login"])

    token = create_auth_token(user)
    return {"ok": True, "user": serialize_user(user, token)}


def revoke_auth_token(token_key: str) -> None:
    AuthToken.objects.filter(key=token_key).delete()
