from django.db import models
from producers.models import Producer


class Scheme(models.Model):

    CASTE_ELIGIBILITY_CHOICES = [
        ("all", "All Categories"),
        ("SC", "Scheduled Caste"),
        ("ST", "Scheduled Tribe"),
        ("SC_ST", "SC / ST"),
        ("OBC", "Other Backward Class"),
    ]

    name = models.CharField(max_length=255, unique=True)
    benefit = models.TextField()
    eligibility = models.TextField()
    how_to_apply = models.TextField()
    documents_required = models.TextField(blank=True)
    applicable_crafts = models.TextField(blank=True)
    applicable_districts = models.TextField(blank=True)
    caste_eligibility = models.CharField(max_length=10, choices=CASTE_ELIGIBILITY_CHOICES, default="all")
    min_income = models.PositiveIntegerField(null=True, blank=True)
    max_income = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "schemes"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Session(models.Model):

    STATUS_CHOICES = [
        ("transcribed", "Transcribed"),
        ("matched", "Schemes Matched"),
        ("listing_generated", "Listing Generated"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    producer = models.ForeignKey(Producer, on_delete=models.SET_NULL, null=True, blank=True, related_name="sessions")
    audio_file_path = models.CharField(max_length=500, blank=True)
    transcript = models.TextField(blank=True)
    detected_language = models.CharField(max_length=50, default="tamil")
    matched_schemes = models.JSONField(default=list, blank=True)
    recommended_platforms = models.JSONField(default=list, blank=True)
    listing_tamil = models.TextField(blank=True)
    listing_english = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="transcribed")
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sessions"
        ordering = ["-created_at"]

    def __str__(self):
        producer_name = self.producer.name if self.producer else "Anonymous"
        return f"Session #{self.pk} — {producer_name} [{self.status}]"