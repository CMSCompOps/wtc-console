from rest_framework.routers import DefaultRouter
from workflows.views import WorkflowsViewSet

router = DefaultRouter()
router.register(r'workflows', WorkflowsViewSet, base_name='workflow')
urlpatterns = router.urls
