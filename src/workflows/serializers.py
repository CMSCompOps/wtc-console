import logging
import time

from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin
from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from workflows.models import Action, TaskAction, Workflow, Prep, Site, Task, TaskSiteStatus, Reason


logger = logging.getLogger(__name__)


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


def get_list_values(key, data):
    return sorted(data.get(key, []))


def get_or_create_action(data):
    action = None

    if 'id' in data:
        # Get action by id (currently frontend does not send id, but it will be used in the future)
        action = Action.objects(id=data['id']).first()
    else:
        # If no action, then try to find equal entry
        action = Action.objects(
            action=data.get('action', ''),
            xrootd=data.get('xrootd', 'disabled'),
            cores=data.get('cores', ''),
            secondary=data.get('secondary', 'disabled'),
            splitting=data.get('splitting', ''),
            group=data.get('group', ''),
            sites=get_list_values('sites', data),
            reasons=get_list_values('reasons', data),
        ).first()

    # If no similar entry exist, then create new one
    if not action:
        action = Action(
            action=data.get('action', ''),
            xrootd=data.get('xrootd', 'disabled'),
            cores=data.get('cores', ''),
            secondary=data.get('secondary', 'disabled'),
            splitting=data.get('splitting', ''),
            group=data.get('group', ''),
            sites=get_list_values('sites', data),
            reasons=get_list_values('reasons', data),
        )
        action.save()

    return action


def save_new_reasons(reasons):
    for text in reasons:
        reason = Reason.objects(text=text)

        if not reason:
            Reason(text=text).save()


class TaskActionSerializer(BulkSerializerMixin, DocumentSerializer):
    action_id = ActionSerializer()

    class Meta:
        model = TaskAction
        fields = '__all__'
        depth = 1
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        action_data = validated_data.pop('action_id')
        action = get_or_create_action(action_data)

        task_action = TaskAction(
            action_id=action.pk,
            acted = 0,
            timestamp = time.time(),
            **validated_data
        )
        task_action.save()
        save_new_reasons(action.reasons)

        return task_action
