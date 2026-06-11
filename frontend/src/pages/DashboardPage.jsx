import { useEffect, useState } from "react";
import { api } from "../api/client";
import CategoryGrid from "../components/CategoryGrid";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsGrid from "../components/StatsGrid";

function DashboardPage({ query }) {
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState({ movie_categories: [], anime_categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [{ data: dashboardData }, { data: categoriesData }] = await Promise.all([
          api.get("/entries/dashboard/", { params: { search: query } }),
          api.get("/entries/categories/"),
        ]);
        setDashboard(dashboardData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [query]);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;

  if (!dashboard) {
    return <EmptyState title="Dashboard unavailable" description="The archive metrics could not be loaded." />;
  }

  const stats = {
    movies: dashboard.totals.movies,
    anime: dashboard.totals.anime,
    highestMovieRating: dashboard.highest_movie_rating || "-",
    topAnimeTier: dashboard.top_anime_tier?.category || "-",
    daysActive: dashboard.days_active,
  };

  return (
    <div className="page-stack">
      <section className="hero-panel glass-card">
        <div>
          <p className="eyebrow">Archive Overview</p>
          <h3>Track every unforgettable watch in one cinematic command center.</h3>
          <p className="hero-copy">
            Browse your latest reviews, spotlight favorites, and keep movie scores and anime tiers synchronized in real time.
          </p>
        </div>
        <div className="recent-list">
          {(dashboard.recent_entries || []).length ? (
            dashboard.recent_entries.map((entry) => (
              <div className="recent-item" key={entry.id}>
                <span>{entry.title}</span>
                <small>
                  {entry.type} • {entry.category}
                </small>
              </div>
            ))
          ) : (
            <small>No entries yet. Add your first title to bring the dashboard to life.</small>
          )}
        </div>
      </section>

      <StatsGrid stats={stats} />
      <CategoryGrid title="Movie Categories" items={categories.movie_categories} variant="movie" />
      <CategoryGrid title="Anime Tiers" items={categories.anime_categories} variant="anime" />
    </div>
  );
}

export default DashboardPage;
