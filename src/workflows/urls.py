from rest_framework.routers import DefaultRouter
from workflows.views import PrepsViewSet, WorkflowsViewSet, SitesViewSet

router = DefaultRouter()
router.register(r'workflows', WorkflowsViewSet, base_name='workflow')
router.register(r'preps', PrepsViewSet, base_name='preps')
router.register(r'sites', SitesViewSet, base_name='sites')
urlpatterns = router.urls
