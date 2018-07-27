class DbRouter:

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'unified':
            return 'unified'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'unified':
            return None
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'unified' or obj2._meta.app_label == 'unified':
            return False
        return True


    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'unified' or db == 'unified':
            return False
        return True
