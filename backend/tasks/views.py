from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    Full CRUD API for tasks.

    GET    /api/tasks/          -> list tasks
    POST   /api/tasks/          -> create a task
    GET    /api/tasks/{id}/     -> retrieve one task
    PUT    /api/tasks/{id}/     -> update a task (full)
    PATCH  /api/tasks/{id}/     -> update a task (partial)
    DELETE /api/tasks/{id}/     -> delete a task
    PATCH  /api/tasks/{id}/toggle/ -> toggle completed state
    """

    serializer_class = TaskSerializer

    def get_queryset(self):
        # Authorization: users only ever see their own tasks
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "title", "completed"]

    @action(detail=True, methods=["patch"])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.save(update_fields=["completed", "updated_at"])
        return Response(self.get_serializer(task).data)
