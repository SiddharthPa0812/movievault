import CategoryGrid from "../components/CategoryGrid";

function CategoriesPage({ title, items, variant }) {
  return (
    <div className="page-stack">
      <CategoryGrid title={title} items={items} variant={variant} />
    </div>
  );
}

export default CategoriesPage;
