function EmptyState({ title, description }) {
  return (
    <div className="glass-card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
