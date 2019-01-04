# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse

from cmstoolbox.workflowinfo import WorkflowInfo


def workflow_sites(request, workflow_id):

    wf = WorkflowInfo( workflow = workflow_id)

    return JsonResponse(wf.get_recovery_info())
