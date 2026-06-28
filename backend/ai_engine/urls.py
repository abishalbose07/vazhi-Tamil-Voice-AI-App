from django.urls import path
from .views import TranscribeView, MatchSchemesView, GenerateListingView

urlpatterns = [
    path('transcribe/', TranscribeView.as_view(), name='transcribe'),
    path('match-schemes/', MatchSchemesView.as_view(), name='match-schemes'),
    path('generate-listing/', GenerateListingView.as_view(), name='generate-listing'),
]