import { DynamicIcon } from "../utils/icons";

function CategoryGrid({ title, items, variant = "movie" }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{variant === "movie" ? "Rated Collections" : "Tier Breakdown"}</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="category-grid">
        {items.map((item) => (
          <article className="glass-card category-card" key={item.name}>
            <div className="category-meta">
              <div className="category-icon">
                <DynamicIcon name={item.icon} size={20} />
              </div>
              <div>
                <h4>{item.name}</h4>
                <p>{variant === "movie" ? item.range : item.description}</p>
              </div>
            </div>
            <div className="category-count">
              <span>{variant === "movie" ? "Movies" : "Anime"}</span>
              <strong>{item.count}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
