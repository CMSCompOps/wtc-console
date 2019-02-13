from django.conf.urls import url

from misc.views import SiteStatusViewSet

urlpatterns = [
    url(r'^sites/status/$', SiteStatusViewSet),
]
