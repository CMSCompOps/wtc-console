from rest_framework_mongoengine.routers import DefaultRouter
# from workflows.views import PrepsViewSet, WorkflowsViewSet
from workflows.views import TasksViewSet

router = DefaultRouter()
# router.register(r'workflows', WorkflowsViewSet, base_name='workflow')
# router.register(r'preps', PrepsViewSet, base_name='preps')
router.register(r'tasks', TasksViewSet, base_name='tasks')
urlpatterns = router.urls
