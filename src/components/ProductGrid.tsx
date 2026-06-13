import { useState } from "react";
import { Product } from "../types";
import { categories } from "../data/products";

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({
  products,
  searchQuery,
  onAddToCart,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All Products");

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All Products" || p.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="flex-1 flex flex-col bg-background">
      {/* Category Tabs */}
      <div className="flex border-b border-outline-variant px-6 bg-surface">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-4 font-semibold text-sm tracking-wide transition-colors ${
              activeCategory === cat
                ? "text-primary active-tab"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 content-start">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="bg-surface-container-lowest border border-outline-variant p-4 rounded cursor-pointer hover:border-primary hover:bg-secondary-fixed transition-all group active:scale-95"
          >
            <div className="aspect-square bg-surface-container rounded mb-4 overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                src={product.image}
              />
            </div>
            <h4 className="font-semibold text-sm tracking-wide text-on-surface truncate">
              {product.name}
            </h4>
            <p className="text-primary font-medium text-sm mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl">
              search_off
            </span>
            <p className="mt-4 font-semibold text-sm">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
