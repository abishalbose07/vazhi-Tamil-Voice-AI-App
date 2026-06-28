from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .whisper_service import transcribe_audio
from .claude_service import match_schemes, generate_listing


class TranscribeView(APIView):
    def post(self, request):
        audio_file = request.FILES.get("audio_file")
        if not audio_file:
            return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)
        result = transcribe_audio(audio_file)
        return Response(result, status=status.HTTP_200_OK)


class MatchSchemesView(APIView):
    def post(self, request):
        data = request.data
        transcript = data.get("transcript", "")
        craft = data.get("craft", "")
        location = data.get("location", "")
        monthly_income = data.get("monthly_income", 0)
        caste_category = data.get("caste_category", "General")
        language = data.get("language", "Tamil")

        if not craft or not location:
            return Response({"error": "craft and location are required"}, status=status.HTTP_400_BAD_REQUEST)

        result = match_schemes(transcript, craft, location, monthly_income, caste_category, language)
        return Response(result, status=status.HTTP_200_OK)


class GenerateListingView(APIView):
    def post(self, request):
        data = request.data
        craft = data.get("craft", "")
        description = data.get("description", "")
        price = data.get("price", 0)
        location = data.get("location", "")
        language = data.get("language", "Tamil")

        if not craft or not description:
            return Response({"error": "craft and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        result = generate_listing(craft, description, price, location, language)
        return Response(result, status=status.HTTP_200_OK)