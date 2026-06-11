from django.db.models import Count, Max
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import EntryFilter
from .models import Entry
from .serializers import EntrySerializer

MOVIE_CATEGORY_META = [
    {"name": "Legendary", "range": "10/10", "icon": "Sparkles"},
    {"name": "Masterpiece", "range": "9-9.9", "icon": "Award"},
    {"name": "Amazing", "range": "8-8.9", "icon": "Star"},
    {"name": "Good", "range": "6-7.9", "icon": "ThumbsUp"},
    {"name": "Average", "range": "4-5.9", "icon": "Gauge"},
    {"name": "Bad", "range": "0-3.9", "icon": "TriangleAlert"},
]

ANIME_CATEGORY_META = [
    {"name": "S Tier", "description": "All-time elite picks", "icon": "Crown"},
    {"name": "A Tier", "description": "Highly recommended favorites", "icon": "Medal"},
    {"name": "B Tier", "description": "Strong and memorable", "icon": "Shield"},
    {"name": "C Tier", "description": "Solid casual watches", "icon": "Layers3"},
    {"name": "D Tier", "description": "Only for completists", "icon": "BadgeMinus"},
    {"name": "Dropped", "description": "Left unfinished", "icon": "CircleOff"},
]


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    filterset_class = EntryFilter
    search_fields = ["title", "genre", "review", "category"]
    ordering_fields = ["watched_date", "created_at", "rating", "title"]
    ordering = ["-watched_date", "-created_at"]

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        entries = self.filter_queryset(self.get_queryset())
        movie_entries = entries.filter(type=Entry.EntryType.MOVIE)
        anime_entries = entries.filter(type=Entry.EntryType.ANIME)
        first_entry = entries.order_by("created_at").first()
        days_active = 0
        if first_entry:
            days_active = (timezone.now().date() - first_entry.created_at.date()).days + 1

        tier_priority = ["S Tier", "A Tier", "B Tier", "C Tier", "D Tier", "Dropped"]
        top_anime_tier = next((tier for tier in tier_priority if anime_entries.filter(category=tier).exists()), None)

        payload = {
            "totals": {
                "movies": movie_entries.count(),
                "anime": anime_entries.count(),
                "favorites": entries.filter(is_favorite=True).count(),
                "watchlist": entries.filter(in_watchlist=True).count(),
            },
            "highest_movie_rating": movie_entries.aggregate(value=Max("rating"))["value"] or 0,
            "top_anime_tier": {"category": top_anime_tier} if top_anime_tier else None,
            "days_active": days_active,
            "recent_entries": EntrySerializer(entries[:5], many=True, context={"request": request}).data,
        }
        return Response(payload)

    @action(detail=False, methods=["get"])
    def categories(self, request):
        movie_counts = {
            row["category"]: row["total"]
            for row in Entry.objects.filter(type=Entry.EntryType.MOVIE).values("category").annotate(total=Count("id"))
        }
        anime_counts = {
            row["category"]: row["total"]
            for row in Entry.objects.filter(type=Entry.EntryType.ANIME).values("category").annotate(total=Count("id"))
        }
        data = {
            "movie_categories": [
                {**meta, "count": movie_counts.get(meta["name"], 0)} for meta in MOVIE_CATEGORY_META
            ],
            "anime_categories": [
                {**meta, "count": anime_counts.get(meta["name"], 0)} for meta in ANIME_CATEGORY_META
            ],
        }
        return Response(data)

    @action(detail=False, methods=["post"], url_path="bulk-toggle")
    def bulk_toggle(self, request):
        ids = request.data.get("ids", [])
        field = request.data.get("field")
        if field not in {"is_favorite", "in_watchlist"}:
            return Response({"detail": "Invalid field."}, status=status.HTTP_400_BAD_REQUEST)
        updated = Entry.objects.filter(id__in=ids).update(**{field: request.data.get("value", False)})
        return Response({"updated": updated})
