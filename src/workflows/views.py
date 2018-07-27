from datetime import datetime, timedelta
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication
from django.conf import settings
from django.db.models import Q
import requests

from workflows.models import Workflow
from workflows.serializers import WorkflowSerializer
from workflows.tasks import print_date


class WorkflowView(generics.ListAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        print_date.delay()
        print('Preparing to fetch preps from request manager url {0} and cert at {1}'
                     .format(settings.REQUEST_MANAGER_API_URL, settings.REQUEST_MANAGER_CERT_PATH))

        wfs = Workflow.objects \
            .filter(Q(prep__isnull=True) | Q(updated__lte=datetime.now()-timedelta(hours=2)))
        wfs_count  = wfs.count()
        print('Workflows to update {0}'.format(wfs_count))

        preps_data_response = requests \
            .get(settings.REQUEST_MANAGER_API_URL + '?mask=PrepID&mask=RequestName&status=completed',
                 verify=settings.REQUEST_MANAGER_CA_PATH,
                 cert=(settings.REQUEST_MANAGER_CERT_PATH, settings.REQUEST_MANAGER_CERT_KEY_PATH,))
        preps_data = preps_data_response.json()

        print('Received JSON response from request manager {0}'.format(preps_data))


        return self.list(request, *args, **kwargs)
