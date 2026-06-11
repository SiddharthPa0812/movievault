from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class AppUser(models.Model):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    name = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(default=timezone.now)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username


class AuthToken(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name="tokens")
    key = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token for {self.user.username}"


class EmailOTP(models.Model):
    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} ({self.code})"


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

    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name="entries")
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
