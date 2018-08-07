from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from knox.auth import TokenAuthentication

from workflows.models import Prep, Site, Workflow, WorkflowSiteStatus
from workflows.serializers import WorkflowSerializer, WorkflowDetailsSerializer


class WorkflowsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field = 'name'

    def list(self, request, *args, **kwargs):
        order_key = self.request.query_params.get('order_key', None)
        order_desc = self.request.query_params.get('order_desc', None)

        order_by = '-updated'
        if order_key:
            order_by = '-' if order_desc == 'true' else ''
            order_by += order_key.replace('.', '__')

        workflows = Workflow.objects.all().order_by(order_by)

        page = self.paginate_queryset(workflows)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(workflows, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = WorkflowDetailsSerializer(user)
        return Response(serializer.data)
