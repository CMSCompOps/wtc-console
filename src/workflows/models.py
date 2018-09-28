from mongoengine import Document, EmbeddedDocument, fields, DENY


# Workflows from Unified

class WorkflowToUpdate(Document):
    name = fields.StringField(max_length=400, primary_key=True)
    updated = fields.DateTimeField()


# Sites

class Site(Document):
    name = fields.StringField(max_length=400, primary_key=True)


# Tasks

class TaskSiteStatus(EmbeddedDocument):
    site = fields.StringField()
    dataset = fields.StringField()
    success_count = fields.LongField(default=0)
    failed_count = fields.LongField(default=0)


class TaskPrep(EmbeddedDocument):
    name = fields.StringField()
    campaign = fields.StringField()
    priority = fields.LongField(default=0)


class Task(EmbeddedDocument):
    name = fields.StringField(primary_key=True)
    workflow = fields.StringField()
    parent_workflow = fields.StringField()
    job_type = fields.StringField()
    failures_count = fields.LongField()

    prep = fields.EmbeddedDocumentField(TaskPrep)
    statuses = fields.EmbeddedDocumentListField(TaskSiteStatus)


class Workflow(EmbeddedDocument):
    name=fields.StringField()
    parent_workflow = fields.StringField()

    tasks=fields.EmbeddedDocumentListField(Task)


class Prep(Document):
    name=fields.StringField(primary_key=True)
    campaign = fields.StringField()
    priority = fields.LongField(default=0)
    updated = fields.DateTimeField()

    workflows=fields.EmbeddedDocumentListField(Workflow)


# Actions

class Action(Document):
    action = fields.StringField()
    xrootd = fields.StringField()
    cores = fields.StringField()
    memory = fields.StringField()
    secondary = fields.StringField()
    splitting = fields.StringField()
    group = fields.StringField()

    sites = fields.ListField(fields.StringField())
    reasons = fields.ListField(fields.StringField())


class Reason(Document):
    text = fields.StringField()


class TaskAction(Document):
    name = fields.StringField()
    workflow = fields.StringField()
    acted = fields.IntField()
    timestamp = fields.LongField()

    action_id = fields.ReferenceField(Action, reverse_delete_rule=DENY)
