# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import JsonResponse

from requests import get

def SiteStatusViewSet(request):
    r = get(
        'http://dashb-ssb.cern.ch/dashboard/request.py/getplotdata',
        params = { 
            'batch' : 1,
            'lastdata' : 1
        });
    r = r.json()['csvdata']
    return JsonResponse(r,safe=False)
