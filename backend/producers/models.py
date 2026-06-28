from django.db import models


class Producer(models.Model):

    CASTE_CHOICES = [
        ("SC", "Scheduled Caste"),
        ("ST", "Scheduled Tribe"),
        ("OBC", "Other Backward Class"),
        ("BC", "Backward Class"),
        ("General", "General"),
    ]

    name = models.CharField(max_length=255)
    craft = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    monthly_income = models.PositiveIntegerField(null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True)
    caste_category = models.CharField(max_length=10, choices=CASTE_CHOICES, default="General")
    language = models.CharField(max_length=50, default="tamil")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "producers"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.craft} ({self.location})"