from django.db.models import Sum
from rest_framework.serializers import SerializerMethodField
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from workflows.models import Workflow, Prep, Site, Task, TaskSiteStatus


# class PrepSerializer(serializers.ModelSerializer):
#     workflows__count = serializers.SerializerMethodField()
#
#     def get_workflows__count(self, obj):
#         return obj.workflows__count
#
#     class Meta:
#         model = Prep
#         fields = ['name', 'campaign', 'priority', 'workflows__count', 'updated']
#
#
# class TaskSiteStatusSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = TaskSiteStatus
#         fields = '__all__'
#
#
# class TaskSerializer(serializers.ModelSerializer):
#     statuses = TaskSiteStatusSerializer(many=True, read_only=True)
#     failures_count = serializers.SerializerMethodField()
#
#     def get_failures_count(self, obj):
#         return obj.statuses.aggregate(Sum('failed_count'))['failed_count__sum']
#
#     class Meta:
#         model = Task
#         fields = '__all__'
#
#
# class WorkflowPrepSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Prep
#         fields = ['name', 'campaign', 'priority']
#
#
# class WorkflowSerializer(serializers.ModelSerializer):
#     prep = WorkflowPrepSerializer()
#
#     class Meta:
#         model = Workflow
#         fields = ['name', 'prep', 'updated']
#
#
# class WorkflowDetailsSerializer(serializers.ModelSerializer):
#     prep = WorkflowPrepSerializer()
#     tasks = TaskSerializer(many=True, read_only=True)
#
#     class Meta:
#         model = Workflow
#         fields = '__all__'
#
#
# class WorkflowListSerializer(serializers.ModelSerializer):
#     tasks_count = serializers.SerializerMethodField()
#
#     def get_tasks_count(self, obj):
#         return obj.tasks.count()
#
#     class Meta:
#         model = Workflow
#         fields = ['name', 'tasks_count', 'created', 'updated']
#
#
# class PrepDetailsSerializer(serializers.ModelSerializer):
#     workflows = WorkflowListSerializer(many=True, read_only=True)
#
#     class Meta:
#         model = Prep
#         fields = '__all__'

class TaskSiteStatusSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = TaskSiteStatus
        fields = '__all__'


class PrepSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = Prep
        fields = '__all__'


class WorkflowSerializer(EmbeddedDocumentSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'


class TaskSerializer(DocumentSerializer):
    prep = PrepSerializer()
    workflow = WorkflowSerializer()
    statuses = TaskSiteStatusSerializer(many=True)

    class Meta:
        model = Task
        fields = '__all__'


class SiteSerializer(DocumentSerializer):
    class Meta:
        model = Site
        fields = '__all__'

