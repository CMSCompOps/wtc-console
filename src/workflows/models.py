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
    site = fields.StringField(max_length=400)
    dataset = fields.StringField(max_length=2000)
    success_count = fields.LongField(default=0)
    failed_count = fields.LongField(default=0)


class Workflow(EmbeddedDocument):
    name = fields.StringField(max_length=400, primary_key=True)


class Prep(EmbeddedDocument):
    name = fields.StringField(max_length=400, primary_key=True)
    campaign = fields.StringField(max_length=400)
    priority = fields.LongField(default=0)
    cpus = fields.LongField(default=0)
    memory = fields.LongField(default=0)


class Task(Document):
    name = fields.StringField(max_length=2000, primary_key=True)
    job_type = fields.StringField(max_length=100)
    updated = fields.DateTimeField()
    failures_count = fields.LongField()

    prep = fields.EmbeddedDocumentField(Prep)
    workflow = fields.EmbeddedDocumentField(Workflow)
    statuses = fields.EmbeddedDocumentListField(TaskSiteStatus)


# Actions

class Action(Document):
    action = fields.StringField()
    xrootd = fields.StringField()
    cores = fields.StringField()
    memory = fields.StringField()
    secondary = fields.StringField()
    splitting = fields.StringField()
    group = fields.StringField()

    sites = fields.ListField(fields.StringField)
    reasons = fields.ListField(fields.StringField)


class TaskAction(Document):
    name = fields.StringField()
    acted = fields.IntField()
    timestamp = fields.LongField()

    action = fields.ReferenceField(Action, reverse_delete_rule=DENY)
