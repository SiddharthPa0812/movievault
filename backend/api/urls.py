from django.urls import path
from rest_framework.routers import DefaultRouter

from .auth_views import check_username, login, logout, me, register
from .views import EntryViewSet

router = DefaultRouter()
router.register("entries", EntryViewSet, basename="entry")

urlpatterns = [
    path("auth/check-username/", check_username, name="check-username"),
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/me/", me, name="me"),
    path("auth/logout/", logout, name="logout"),
    *router.urls,
]
