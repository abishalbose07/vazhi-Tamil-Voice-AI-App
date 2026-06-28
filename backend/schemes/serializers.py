from rest_framework import serializers
from .models import Scheme, Session


class SchemeListSerializer(serializers.ModelSerializer):
    """Used for GET /api/schemes/ — returns all schemes in simple format."""

    class Meta:
        model = Scheme
        fields = ["id", "name", "benefit", "eligibility"]


class SchemeDetailSerializer(serializers.ModelSerializer):
    """Full scheme data — used internally by ai_engine for matching."""

    class Meta:
        model = Scheme
        fields = ["id", "name", "benefit", "eligibility", "how_to_apply", "documents_required",
                  "applicable_crafts", "applicable_districts", "caste_eligibility", "min_income", "max_income", "is_active"]


class MatchedSchemeSerializer(serializers.Serializer):
    """Represents one matched scheme in the POST /api/match-schemes/ response."""

    name = serializers.CharField()
    benefit = serializers.CharField()
    how_to_apply = serializers.CharField()


class MatchSchemesResponseSerializer(serializers.Serializer):
    """Full response shape for POST /api/match-schemes/."""

    matched_schemes = MatchedSchemeSerializer(many=True)
    recommended_platforms = serializers.ListField(child=serializers.CharField())


class SessionSerializer(serializers.ModelSerializer):
    """Tracks a full user session — used for logging and debugging."""

    class Meta:
        model = Session
        fields = ["id", "producer", "transcript", "detected_language", "matched_schemes",
                  "recommended_platforms", "listing_tamil", "listing_english", "status", "error_message", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class TranscribeResponseSerializer(serializers.Serializer):
    """Response shape for POST /api/transcribe/."""

    transcript = serializers.CharField()
    language = serializers.CharField()


class GenerateListingResponseSerializer(serializers.Serializer):
    """Response shape for POST /api/generate-listing/."""

    listing_tamil = serializers.CharField()
    listing_english = serializers.CharField()