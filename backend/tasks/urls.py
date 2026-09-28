from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from . import auth_views

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("auth/register/", auth_views.register),
    path("auth/login/", auth_views.login),
    path("auth/logout/", auth_views.logout),
] + router.urls
