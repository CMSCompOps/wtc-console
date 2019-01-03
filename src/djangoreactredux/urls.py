from django.conf import settings
from django.conf.urls import include, url
from django.views.decorators.cache import cache_page

from base import views as base_views

urlpatterns = [
    url(r'^api/v1/workflows/', include('workflows.urls', namespace='workflows')),
    url(r'^api/v1/cmsweb/', include('cmsweb.urls', namespace='cmsweb')),

    # catch all others because of how history is handled by react router - cache this page because it will never change
    url(r'', cache_page(settings.PAGE_CACHE_SECONDS)(base_views.IndexView.as_view()), name='index'),
]
