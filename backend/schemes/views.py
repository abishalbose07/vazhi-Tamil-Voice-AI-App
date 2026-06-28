from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Scheme
from .serializers import SchemeListSerializer


class SchemeListView(APIView):
    """
    Handles GET /api/schemes/
    Returns all active government schemes.
    """

    def get(self, request):
        schemes = Scheme.objects.filter(is_active=True)
        serializer = SchemeListSerializer(schemes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)