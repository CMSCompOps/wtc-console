from django.db import models


class Prep(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    campaign = models.CharField(max_length=400, editable=False)
    created = models.DateTimeField(editable=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Workflow(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    prep = models.ForeignKey(Prep, related_name='workflows', on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(editable=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Site(models.Model):
    name = models.CharField(max_length=400, primary_key=True)


class WorkflowSiteStatus(models.Model):
    workflow = models.ForeignKey(Workflow, related_name='statuses', on_delete=models.CASCADE, null=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, null=True)
    site_workflow_name = models.CharField(max_length=400, null=True)
    success_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
