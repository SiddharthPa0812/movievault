import django_filters

from .models import Entry


class EntryFilter(django_filters.FilterSet):
    min_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="gte")
    max_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="lte")
    watched_after = django_filters.DateFilter(field_name="watched_date", lookup_expr="gte")
    watched_before = django_filters.DateFilter(field_name="watched_date", lookup_expr="lte")

    class Meta:
        model = Entry
        fields = ["type", "category", "genre", "is_favorite", "in_watchlist"]
