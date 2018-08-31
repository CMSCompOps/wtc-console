from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from knox.auth import TokenAuthentication
from django.db.models import Q, Count, Sum

from workflows.models import Prep, Site, Workflow
from workflows.serializers import PrepSerializer, PrepDetailsSerializer, WorkflowSerializer, WorkflowDetailsSerializer, \
    SiteSerializer


class PrepsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Prep.objects.all()
    serializer_class = PrepSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field = 'name'

    def list(self, request, *args, **kwargs):
        filter = self.request.query_params.get('filter', None)
        order_key = self.request.query_params.get('order_key', None)
        order_desc = self.request.query_params.get('order_desc', None)
        queryset = self.queryset.annotate(Count('workflows'))

        order_by = '-priority'
        if order_key:
            order_by = '-' if order_desc == 'true' else ''
            order_by += order_key.replace('.', '__')

        preps = queryset.order_by(order_by, '-updated')

        if filter:
            preps = preps.filter(
                Q(name__icontains=filter) |
                Q(campaign__icontains=filter)
            )

        page = self.paginate_queryset(preps)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(preps, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = PrepDetailsSerializer(user)
        return Response(serializer.data)


class WorkflowsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    lookup_field = 'name'

    def list(self, request, *args, **kwargs):
        filter = self.request.query_params.get('filter', None)
        order_key = self.request.query_params.get('order_key', None)
        order_desc = self.request.query_params.get('order_desc', None)

        order_by = '-updated'
        if order_key:
            order_by = '-' if order_desc == 'true' else ''
            order_by += order_key.replace('.', '__')

        workflows = Workflow.objects.all().order_by(order_by)

        if filter:
            workflows = workflows.filter(
                Q(name__icontains=filter) |
                Q(prep__name__icontains=filter) |
                Q(prep__campaign__icontains=filter)
            )

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


class SitesViewSet(viewsets.GenericViewSet):
    queryset = Site.objects.all().order_by('name')
    serializer_class = SiteSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
