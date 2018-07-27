from django.db import models


class UnifiedWorkflow(models.Model):
    name = models.CharField(max_length=400)
    status = models.CharField(max_length=100)
    wm_status = models.CharField(max_length=100)

    class Meta:
        db_table = '"CMS_UNIFIED_ADMIN"."WORKFLOW"'
