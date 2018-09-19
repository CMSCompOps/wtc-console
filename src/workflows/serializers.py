from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from workflows.models import Workflow, Prep, Site, Task, TaskSiteStatus


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

