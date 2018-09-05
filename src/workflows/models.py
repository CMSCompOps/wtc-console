from mongoengine import Document, EmbeddedDocument, fields


class WorkflowToUpdate(Document):
    name = fields.StringField(max_length=400, primary_key=True)
    updated = fields.DateTimeField()


class Site(Document):
    name = fields.StringField(max_length=400, primary_key=True)


class TaskSiteStatus(EmbeddedDocument):
    site = fields.StringField(max_length=400)
    dataset = fields.StringField(max_length=2000)
    success_count = fields.IntField(default=0)
    failed_count = fields.IntField(default=0)


class Workflow(EmbeddedDocument):
    name = fields.StringField(max_length=400, primary_key=True)


class Prep(EmbeddedDocument):
    name = fields.StringField(max_length=400, primary_key=True)
    campaign = fields.StringField(max_length=400)
    priority = fields.IntField(default=0)
    cpus = fields.IntField(default=0)
    memory = fields.IntField(default=0)


class Task(Document):
    name = fields.StringField(max_length=2000, primary_key=True)
    job_type = fields.StringField(max_length=100)
    updated = fields.DateTimeField()
    failures_count = fields.IntField()

    prep = fields.EmbeddedDocumentField(Prep)
    workflow = fields.EmbeddedDocumentField(Workflow)
    statuses = fields.EmbeddedDocumentListField(TaskSiteStatus)
