from django.contrib import admin

from .models import Entry


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "category", "rating", "watched_date", "is_favorite", "in_watchlist")
    list_filter = ("type", "category", "is_favorite", "in_watchlist")
    search_fields = ("title", "genre", "review")
