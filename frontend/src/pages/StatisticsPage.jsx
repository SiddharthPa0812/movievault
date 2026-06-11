import { useEffect, useState } from "react";
import { api } from "../api/client";
import CategoryGrid from "../components/CategoryGrid";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsGrid from "../components/StatsGrid";

function StatisticsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState({ movie_categories: [], anime_categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: dashboardData }, { data: categoriesData }] = await Promise.all([
          api.get("/entries/dashboard/"),
          api.get("/entries/categories/"),
        ]);
        setDashboard(dashboardData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading statistics..." />;
  if (!dashboard) return <EmptyState title="Statistics unavailable" description="Metrics could not be retrieved." />;

  return (
    <div className="page-stack">
      <StatsGrid
        stats={{
          movies: dashboard.totals.movies,
          anime: dashboard.totals.anime,
          highestMovieRating: dashboard.highest_movie_rating || "-",
          topAnimeTier: dashboard.top_anime_tier?.category || "-",
          daysActive: dashboard.days_active,
        }}
      />
      <CategoryGrid title="Movie Category Breakdown" items={categories.movie_categories} variant="movie" />
      <CategoryGrid title="Anime Tier Breakdown" items={categories.anime_categories} variant="anime" />
    </div>
  );
}

export default StatisticsPage;
