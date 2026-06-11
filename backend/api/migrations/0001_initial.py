from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Entry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("type", models.CharField(choices=[("Movie", "Movie"), ("Anime", "Anime")], max_length=10)),
                ("genre", models.CharField(max_length=120)),
                (
                    "rating",
                    models.DecimalField(
                        decimal_places=1,
                        max_digits=3,
                        validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)],
                    ),
                ),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("Legendary", "Legendary"),
                            ("Masterpiece", "Masterpiece"),
                            ("Amazing", "Amazing"),
                            ("Good", "Good"),
                            ("Average", "Average"),
                            ("Bad", "Bad"),
                            ("S Tier", "S Tier"),
                            ("A Tier", "A Tier"),
                            ("B Tier", "B Tier"),
                            ("C Tier", "C Tier"),
                            ("D Tier", "D Tier"),
                            ("Dropped", "Dropped"),
                        ],
                        max_length=30,
                    ),
                ),
                ("review", models.TextField(blank=True)),
                ("poster", models.ImageField(blank=True, null=True, upload_to="posters/")),
                ("watched_date", models.DateField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("is_favorite", models.BooleanField(default=False)),
                ("in_watchlist", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-watched_date", "-created_at"]},
        ),
    ]
