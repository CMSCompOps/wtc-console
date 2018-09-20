from rest_framework_mongoengine.routers import DefaultRouter
from workflows.views import TaskActionViewSet, TaskViewSet, SiteViewSet

router = DefaultRouter()
router.register(r'tasks-actions', TaskActionViewSet, base_name='tasks-actions')
router.register(r'tasks', TaskViewSet, base_name='tasks')
router.register(r'sites', SiteViewSet, base_name='sites')
urlpatterns = router.urls
