from rest_framework import serializers

from .models import Entry


MOVIE_CATEGORIES = {"Legendary", "Masterpiece", "Amazing", "Good", "Average", "Bad"}
ANIME_CATEGORIES = {"S Tier", "A Tier", "B Tier", "C Tier", "D Tier", "Dropped"}


class EntrySerializer(serializers.ModelSerializer):
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = [
            "id",
            "title",
            "type",
            "genre",
            "rating",
            "category",
            "review",
            "poster",
            "poster_url",
            "watched_date",
            "created_at",
            "is_favorite",
            "in_watchlist",
        ]
        read_only_fields = ["id", "created_at", "poster_url"]

    def get_poster_url(self, obj):
        request = self.context.get("request")
        if not obj.poster:
            return ""
        url = obj.poster.url
        return request.build_absolute_uri(url) if request else url

    def validate(self, attrs):
        entry_type = attrs.get("type", getattr(self.instance, "type", None))
        category = attrs.get("category", getattr(self.instance, "category", None))
        if entry_type == Entry.EntryType.MOVIE and category not in MOVIE_CATEGORIES:
            raise serializers.ValidationError({"category": "Choose a movie category for movie entries."})
        if entry_type == Entry.EntryType.ANIME and category not in ANIME_CATEGORIES:
            raise serializers.ValidationError({"category": "Choose an anime tier for anime entries."})
        return attrs
