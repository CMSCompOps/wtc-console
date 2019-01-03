from django.conf.urls import url

from cmsweb import views

urlpatterns = [
    url(r'^workflow/(?P<workflow_id>\S+)/sites/$', views.workflow_sites),
]
