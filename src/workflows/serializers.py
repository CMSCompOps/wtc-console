from rest_framework import serializers
from workflows.models import Workflow, Prep, Site, WorkflowSiteStatus


class PrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prep
        fields = '__all__'


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'


class WorkflowSiteStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowSiteStatus
        fields = '__all__'


class WorkflowSerializer(serializers.ModelSerializer):
    prep = PrepSerializer()

    class Meta:
        model = Workflow
        fields = ['name', 'prep', 'updated']


class WorkflowDetailsSerializer(serializers.ModelSerializer):
    prep = PrepSerializer()
    statuses = WorkflowSiteStatusSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ['name', 'prep', 'created', 'updated', 'statuses']


class WorkflowListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = ['name', 'created', 'updated']


class PrepDetailsSerializer(serializers.ModelSerializer):
    workflows = WorkflowListSerializer(many=True, read_only=True)

    class Meta:
        model = Prep
        fields = ['name', 'campaign', 'created', 'updated', 'workflows']
