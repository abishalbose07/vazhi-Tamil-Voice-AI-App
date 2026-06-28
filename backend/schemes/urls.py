from django.urls import path
from .views import SchemeListView

urlpatterns = [
    path('schemes/', SchemeListView.as_view(), name='scheme-list'),
]