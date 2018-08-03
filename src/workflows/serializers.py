from rest_framework import serializers
from workflows.models import Workflow, Prep

class PrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prep
        fields = '__all__'

class WorkflowSerializer(serializers.ModelSerializer):
    prep = PrepSerializer()

    class Meta:
        model = Workflow
        fields = ['name', 'prep', 'updated']
