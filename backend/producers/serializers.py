from rest_framework import serializers
from .models import Producer


class ProducerSerializer(serializers.ModelSerializer):
    """Used for reading producer data."""

    class Meta:
        model = Producer
        fields = ["id", "name", "craft", "location", "monthly_income", "phone", "caste_category", "language", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProducerCreateSerializer(serializers.ModelSerializer):
    """Used when the mobile app sends POST /api/producers/ to register a new producer."""

    caste_category = serializers.ChoiceField(choices=Producer.CASTE_CHOICES, default="General", required=False)
    language = serializers.CharField(default="tamil", required=False)
    monthly_income = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Producer
        fields = ["name", "craft", "location", "monthly_income", "phone", "caste_category", "language"]

    def validate_phone(self, value):
        cleaned = "".join(filter(str.isdigit, value))
        if len(cleaned) < 10:
            raise serializers.ValidationError("Phone number must have at least 10 digits.")
        return cleaned

    def validate_monthly_income(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Monthly income cannot be negative.")
        return value