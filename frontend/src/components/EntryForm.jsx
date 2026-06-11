import { ImagePlus, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { animeCategories, movieCategories } from "../data/navigation";

const baseState = {
  title: "",
  type: "Movie",
  genre: "",
  rating: "8.0",
  category: "Amazing",
  watched_date: "",
  review: "",
  poster: null,
  is_favorite: false,
  in_watchlist: false,
};

const allowedFields = [
  "title",
  "type",
  "genre",
  "rating",
  "category",
  "watched_date",
  "review",
  "poster",
  "is_favorite",
  "in_watchlist",
];

function EntryForm({ initialValues, onSubmit, submitting, message }) {
  const [form, setForm] = useState(baseState);
  const [posterPreview, setPosterPreview] = useState("");

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...baseState,
        ...initialValues,
        poster: null,
      });
    }
  }, [initialValues]);

  useEffect(() => {
    if (form.poster instanceof File) {
      const nextUrl = URL.createObjectURL(form.poster);
      setPosterPreview(nextUrl);
      return () => URL.revokeObjectURL(nextUrl);
    }

    setPosterPreview(initialValues?.poster_url || "");
  }, [form.poster, initialValues?.poster_url]);

  const categoryOptions = useMemo(
    () => (form.type === "Movie" ? movieCategories : animeCategories),
    [form.type],
  );

  useEffect(() => {
    const hasCategory = categoryOptions.some((item) => item.name === form.category);
    if (!hasCategory) {
      setForm((current) => ({ ...current, category: categoryOptions[0].name }));
    }
  }, [categoryOptions, form.category]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    allowedFields.forEach((key) => {
      const value = form[key];
      if (key === "poster" && !value) return;
      payload.append(key, value);
    });
    onSubmit(payload);
  };

  return (
    <form className="glass-card entry-form" onSubmit={handleSubmit}>
      <div className="form-ribbon">
        <span className="form-ribbon-icon">
          <Sparkles size={16} />
        </span>
        <span>{form.type === "Movie" ? "Add New Movie" : "Add New Anime"}</span>
      </div>

      <div className="toggle-row">
        {["Movie", "Anime"].map((value) => (
          <button
            type="button"
            key={value}
            className={`toggle-chip ${form.type === value ? "active" : ""}`}
            onClick={() => updateField("type", value)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="form-grid">
        <label>
          <span>Title</span>
          <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
        </label>
        <label>
          <span>Genre</span>
          <input value={form.genre} onChange={(event) => updateField("genre", event.target.value)} required />
        </label>
        <label>
          <span>Rating</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={form.rating}
            onChange={(event) => updateField("rating", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Category / Tier</span>
          <div className="select-shell">
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} required>
              {categoryOptions.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label>
          <span>Date Watched</span>
          <input
            type="date"
            value={form.watched_date}
            onChange={(event) => updateField("watched_date", event.target.value)}
            required
          />
        </label>
        <div className="poster-upload-card">
          <span>Poster Image</span>
          <label className="poster-upload-shell">
            <input type="file" accept="image/*" onChange={(event) => updateField("poster", event.target.files?.[0] || null)} />
            <div className="poster-preview">
              {posterPreview ? <img src={posterPreview} alt="Poster preview" /> : <span className="poster-preview-empty">No poster selected yet</span>}
            </div>
            <div className="poster-upload-copy">
              <span className="poster-upload-icon">
                <ImagePlus size={18} />
              </span>
              <div>
                <strong>Choose Image</strong>
                <p>Drop in a bold poster or select a file to give this entry a cinematic cover.</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <label>
        <span>Experience / Review</span>
        <textarea
          rows="6"
          value={form.review}
          onChange={(event) => updateField("review", event.target.value)}
          placeholder="Capture the vibe, standout moments, and your personal take."
        />
      </label>

      <div className="checkbox-row">
        <label className="checkbox-pill">
          <input type="checkbox" checked={form.is_favorite} onChange={(event) => updateField("is_favorite", event.target.checked)} />
          <span>Favorite</span>
        </label>
        <label className="checkbox-pill">
          <input type="checkbox" checked={form.in_watchlist} onChange={(event) => updateField("in_watchlist", event.target.checked)} />
          <span>Watchlist</span>
        </label>
      </div>

      <div className="form-footer">
        {message ? <p className="success-text">{message}</p> : <span />}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </form>
  );
}

export default EntryForm;
