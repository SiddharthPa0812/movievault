import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import EmptyState from "../components/EmptyState";
import EntryCard from "../components/EntryCard";
import FilterBar from "../components/FilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEntries } from "../hooks/useEntries";

function EntriesPage({ title, type, query, categories, extraFilters = {} }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type,
    search: query,
    category: "",
    genre: "",
    ordering: "-watched_date",
    ...extraFilters,
  });
  const { entries, loading, error, refetch } = useEntries(filters);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: query }));
  }, [query]);

  const changeFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  const updateEntry = async (entry, field) => {
    await api.patch(`/entries/${entry.id}/`, { [field]: !entry[field] });
    window.dispatchEvent(new Event("entries:changed"));
    refetch(filters);
  };

  const deleteEntry = async (id) => {
    await api.delete(`/entries/${id}/`);
    window.dispatchEvent(new Event("entries:changed"));
    refetch(filters);
  };

  if (loading) return <LoadingSpinner label={`Loading ${title.toLowerCase()}...`} />;
  if (error) return <EmptyState title="Could not load entries" description={error} />;

  return (
    <div className="page-stack">
      <FilterBar filters={filters} categories={categories} onChange={changeFilter} typeLabel={title} />
      {entries.length ? (
        <section className="entry-grid">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={(id) => navigate(`/entries/${id}/edit`)}
              onDelete={deleteEntry}
              onToggleFavorite={(item) => updateEntry(item, "is_favorite")}
              onToggleWatchlist={(item) => updateEntry(item, "in_watchlist")}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()} found`}
          description="Try a different search or add a fresh entry to fill this section."
        />
      )}
    </div>
  );
}

export default EntriesPage;
