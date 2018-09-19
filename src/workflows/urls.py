from rest_framework_mongoengine.routers import DefaultRouter
from workflows.views import ActionViewSet, TaskViewSet, SiteViewSet

router = DefaultRouter()
router.register(r'actions', ActionViewSet, base_name='actions')
router.register(r'tasks', TaskViewSet, base_name='tasks')
router.register(r'sites', SiteViewSet, base_name='sites')
urlpatterns = router.urls
