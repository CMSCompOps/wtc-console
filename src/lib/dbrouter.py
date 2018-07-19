class DbRouter:

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'workflows':
            return 'workflows'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'workflows':
            return None
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'workflows' or obj2._meta.app_label == 'workflows':
            return False
        return True


    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'workflows' or db == 'workflows':
            return False
        return True
