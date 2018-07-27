import datetime
from django.db import models


class Prep(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    campaign = models.CharField(max_length=400, editable=False)


class Workflow(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    prep = models.ForeignKey(Prep, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(editable=False, default=datetime.datetime.utcnow)
    updated = models.DateTimeField(null=False, blank=False, default=datetime.datetime.utcnow)
