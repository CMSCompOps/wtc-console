from django.db import models


class Prep(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    campaign = models.CharField(max_length=400, editable=False)
    priority = models.IntegerField(default=0)
    cpus = models.IntegerField(default=0)
    memory = models.IntegerField(default=0)

    created = models.DateTimeField(editable=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Workflow(models.Model):
    name = models.CharField(max_length=400, primary_key=True)
    prep = models.ForeignKey(Prep, related_name='workflows', on_delete=models.CASCADE, null=True)

    created = models.DateTimeField(editable=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Site(models.Model):
    name = models.CharField(max_length=400, primary_key=True)


class Task(models.Model):
    name = models.CharField(max_length=2000, primary_key=True)
    workflow = models.ForeignKey(Workflow, related_name='tasks', on_delete=models.CASCADE)
    job_type = models.CharField(max_length=100)

    created = models.DateTimeField(editable=False, auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class TaskSiteStatus(models.Model):
    task = models.ForeignKey(Task, related_name='statuses', on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    dataset = models.CharField(max_length=2000)
    success_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
