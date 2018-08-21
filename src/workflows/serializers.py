from rest_framework import serializers
from workflows.models import Workflow, Prep, Site, Task, TaskSiteStatus


class PrepSerializer(serializers.ModelSerializer):
    workflows_count = serializers.SerializerMethodField()

    def get_workflows_count(self, obj):
        return obj.workflows.count()

    class Meta:
        model = Prep
        fields = '__all__'


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'


class TaskSiteStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskSiteStatus
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    statuses = TaskSiteStatusSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'


class WorkflowSerializer(serializers.ModelSerializer):
    prep = PrepSerializer()

    class Meta:
        model = Workflow
        fields = ['name', 'prep', 'updated']


class WorkflowDetailsSerializer(serializers.ModelSerializer):
    prep = PrepSerializer()
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = '__all__'


class WorkflowListSerializer(serializers.ModelSerializer):
    tasks_count = serializers.SerializerMethodField()

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    class Meta:
        model = Workflow
        fields = ['name', 'tasks_count', 'created', 'updated']


class PrepDetailsSerializer(serializers.ModelSerializer):
    workflows = WorkflowListSerializer(many=True, read_only=True)

    class Meta:
        model = Prep
        fields = ['name', 'campaign', 'created', 'updated', 'workflows']
