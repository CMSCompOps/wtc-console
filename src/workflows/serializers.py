from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from rest_framework_mongoengine.fields import ReferenceField
from workflows.models import Action, ActionParameter, ActionTask, Workflow, Prep, Site, Task, TaskSiteStatus


# Tasks

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


# Sites

class SiteSerializer(DocumentSerializer):
    class Meta:
        model = Site
        fields = '__all__'


# Actions

class ActionSerializer(DocumentSerializer):
    class Meta:
        model = Action
        fields = '__all__'


class TaskActionSerializer(DocumentSerializer):
    # action = ActionSerializer()
    # action = ReferenceField(Action)

    class Meta:
        model = ActionTask
        fields = '__all__'
        depth = 1
