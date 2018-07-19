from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

import workflows.views

urlpatterns = [
    url(_(r'^workflow/$'), workflows.views.WorkflowView.as_view(), name='workflow'),
]
