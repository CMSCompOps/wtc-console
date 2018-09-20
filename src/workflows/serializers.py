from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from rest_framework_mongoengine import fields
from workflows.models import Action, TaskAction, Workflow, Prep, Site, Task, TaskSiteStatus


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


def get_or_create_action(data):

    if 'id' in data:
        action = Action.objects(id=id).first()
    else:
        action = Action.objects(
            action=data['action'],
            xrootd=data['xrootd'],
            cores=data['cores'],
            secondary=data['secondary'],
            splitting=data['splitting'],
            group=data['group'],
            sites=data.get('sites', []).sort(),
            reasons=data.get('reasons', []).sort(),
        ).first()

    if not action:
        action = Action(
            action=data['action'],
            xrootd=data['xrootd'],
            cores=data['cores'],
            secondary=data['secondary'],
            splitting=data['splitting'],
            group=data['group'],
            sites=data.get('sites', []).sort(),
            reasons=data.get('reasons', []).sort(),
        )
        action.save()

    return action


class TaskActionSerializer(DocumentSerializer):
    action_id = ActionSerializer()

    class Meta:
        model = TaskAction
        fields = '__all__'
        depth = 1

    def create(self, validated_data):
        action_data = validated_data.pop('action_id')
        action = get_or_create_action(action_data)

        task_action = TaskAction(action_id=action.pk, **validated_data)
        task_action.save()

        return task_action
