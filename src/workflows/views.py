import logging
from rest_framework.response import Response
from rest_framework_mongoengine import viewsets
from rest_framework_bulk.mixins import BulkCreateModelMixin
from mongoengine.queryset.visitor import Q

from workflows.models import Action, Prep, Site, Task, TaskAction, Reason
from workflows.serializers import SiteSerializer, TaskActionSerializer, PrepSerializer

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Prep.objects.all()
    serializer_class = PrepSerializer
    lookup_field = 'name'

    def list(self, request, *args, **kwargs):
        order_key = self.request.query_params.get('order_key', None)
        order_desc = self.request.query_params.get('order_desc', None)
        filter_query = self.request.query_params.get('filter', None)

        order_by = '-prep__priority'
        if order_key:
            order_by = '-' if order_desc == 'true' else ''
            order_by += order_key.replace('.', '__')

        tasks = self.queryset.order_by(order_by)

        if filter_query:
            tasks = tasks.filter(
                Q(name__icontains=filter_query)
                | Q(campaign__icontains=filter_query)
                # | Q(workflow__icontains=filter_query)
                # | Q(prep__name__icontains=filter_query)
                # | Q(prep__campaign__icontains=filter_query)
            )

        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)


class SiteViewSet(viewsets.GenericViewSet):
    queryset = Site.objects.all().order_by('+name')
    serializer_class = SiteSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TaskActionViewSet(BulkCreateModelMixin,
                        viewsets.GenericViewSet):
    queryset = TaskAction.objects.all()
    serializer_class = TaskActionSerializer
