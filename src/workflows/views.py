from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication

from workflows.models import Workflow
from workflows.serializers import WorkflowSerializer


class WorkflowView(generics.ListAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
