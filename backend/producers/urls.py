from django.urls import path
from .views import ProducerCreateView, ProducerListView

urlpatterns = [
    path('producers/', ProducerCreateView.as_view(), name='producer-create'),
    path('producers/list/', ProducerListView.as_view(), name='producer-list'),
]