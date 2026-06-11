import { Clapperboard, Sparkles, Star, Trophy, CalendarDays } from "lucide-react";

const statConfig = [
  { key: "movies", label: "Total Movies", icon: Clapperboard },
  { key: "anime", label: "Total Anime", icon: Sparkles },
  { key: "highestMovieRating", label: "Highest Movie Rating", icon: Trophy },
  { key: "topAnimeTier", label: "Top Anime Tier", icon: Star },
  { key: "daysActive", label: "Days Active", icon: CalendarDays },
];

function StatsGrid({ stats }) {
  return (
    <section className="stats-grid">
      {statConfig.map(({ key, label, icon: Icon }) => (
        <article className="glass-card stat-card" key={key}>
          <div className="stat-icon">
            <Icon size={20} />
          </div>
          <span>{label}</span>
          <strong>{stats[key]}</strong>
        </article>
      ))}
    </section>
  );
}

export default StatsGrid;
