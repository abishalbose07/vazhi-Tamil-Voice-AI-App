from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producer
from .serializers import ProducerCreateSerializer, ProducerSerializer


class ProducerCreateView(APIView):
    """
    Handles POST /api/producers/
    Saves a new artisan profile to the database.
    """

    def post(self, request):
        serializer = ProducerCreateSerializer(data=request.data)

        if serializer.is_valid():
            producer = serializer.save()
            return Response(
                {"id": producer.id, "message": "Profile saved successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProducerListView(APIView):
    """
    Handles GET /api/producers/
    Returns all saved producer profiles.
    """

    def get(self, request):
        producers = Producer.objects.all()
        serializer = ProducerSerializer(producers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)