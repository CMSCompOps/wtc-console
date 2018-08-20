from rest_framework.routers import DefaultRouter
from workflows.views import PrepsViewSet, WorkflowsViewSet

router = DefaultRouter()
router.register(r'workflows', WorkflowsViewSet, base_name='workflow')
router.register(r'preps', PrepsViewSet, base_name='preps')
urlpatterns = router.urls
