from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Entry(models.Model):
    class EntryType(models.TextChoices):
        MOVIE = "Movie", "Movie"
        ANIME = "Anime", "Anime"

    class CategoryChoices(models.TextChoices):
        LEGENDARY = "Legendary", "Legendary"
        MASTERPIECE = "Masterpiece", "Masterpiece"
        AMAZING = "Amazing", "Amazing"
        GOOD = "Good", "Good"
        AVERAGE = "Average", "Average"
        BAD = "Bad", "Bad"
        S_TIER = "S Tier", "S Tier"
        A_TIER = "A Tier", "A Tier"
        B_TIER = "B Tier", "B Tier"
        C_TIER = "C Tier", "C Tier"
        D_TIER = "D Tier", "D Tier"
        DROPPED = "Dropped", "Dropped"

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=EntryType.choices)
    genre = models.CharField(max_length=120)
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(10)])
    category = models.CharField(max_length=30, choices=CategoryChoices.choices)
    review = models.TextField(blank=True)
    poster = models.ImageField(upload_to="posters/", blank=True, null=True)
    watched_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_favorite = models.BooleanField(default=False)
    in_watchlist = models.BooleanField(default=False)

    class Meta:
        ordering = ["-watched_date", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.type})"
