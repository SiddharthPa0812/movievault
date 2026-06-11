function FilterBar({ filters, categories, onChange, typeLabel }) {
  return (
    <section className="glass-card filter-bar">
      <div className="filter-field">
        <label>Category</label>
        <select value={filters.category} onChange={(event) => onChange("category", event.target.value)}>
          <option value="">All {typeLabel}</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label>Genre</label>
        <input
          type="text"
          value={filters.genre}
          onChange={(event) => onChange("genre", event.target.value)}
          placeholder="Filter by genre"
        />
      </div>
      <div className="filter-field">
        <label>Sort</label>
        <select value={filters.ordering} onChange={(event) => onChange("ordering", event.target.value)}>
          <option value="-watched_date">Latest watched</option>
          <option value="-rating">Highest rating</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </section>
  );
}

export default FilterBar;
