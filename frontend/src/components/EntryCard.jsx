import { Heart, ListPlus, Pencil, Star, Trash2 } from "lucide-react";
import { buildMediaUrl } from "../api/client";

function EntryCard({ entry, onEdit, onDelete, onToggleFavorite, onToggleWatchlist }) {
  return (
    <article className="glass-card entry-card">
      <div className="entry-poster">
        {entry.poster_url ? (
          <img src={buildMediaUrl(entry.poster_url)} alt={entry.title} />
        ) : (
          <div className="poster-fallback">{entry.title.slice(0, 1)}</div>
        )}
      </div>
      <div className="entry-content">
        <div className="entry-header">
          <div>
            <span className="pill">{entry.type}</span>
            <h4>{entry.title}</h4>
            <p>{entry.genre}</p>
          </div>
          <strong className="rating-badge">{entry.rating}</strong>
        </div>

        <div className="entry-tags">
          <span>{entry.category}</span>
          <span>{entry.watched_date}</span>
        </div>

        <p className="entry-review">{entry.review || "No review added yet."}</p>

        <div className="entry-actions">
          <button className={`icon-button ${entry.is_favorite ? "active" : ""}`} onClick={() => onToggleFavorite(entry)}>
            <Heart size={16} />
          </button>
          <button className={`icon-button ${entry.in_watchlist ? "active" : ""}`} onClick={() => onToggleWatchlist(entry)}>
            <ListPlus size={16} />
          </button>
          <button className="icon-button" onClick={() => onEdit(entry.id)}>
            <Pencil size={16} />
          </button>
          <button className="icon-button danger" onClick={() => onDelete(entry.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default EntryCard;
