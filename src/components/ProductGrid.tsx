import { useState, useRef } from "react";
import { Product } from "../types";
import { categories } from "../data/categories";

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
  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All Products" || p.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="flex-1 flex flex-col bg-background min-w-0">
      {/* Category Tabs - horizontally scrollable on mobile */}
      <div
        ref={tabsRef}
        className="flex border-b border-outline-variant px-3 lg:px-6 bg-surface overflow-x-auto hide-scrollbar"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 lg:px-6 py-3 lg:py-4 font-semibold text-xs lg:text-sm tracking-wide transition-colors whitespace-nowrap flex-shrink-0 ${
              activeCategory === cat
                ? "text-primary active-tab"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid - 2 cols on mobile, scales up */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-4 content-start">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="bg-surface-container-lowest border border-outline-variant p-2 lg:p-4 rounded cursor-pointer hover:border-primary hover:bg-secondary-fixed transition-all group active:scale-95"
          >
            <div className="aspect-square bg-surface-container rounded mb-2 lg:mb-4 overflow-hidden">
              <img
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                src={product.image}
                loading="lazy"
              />
            </div>
            <h4 className="font-semibold text-xs lg:text-sm tracking-wide text-on-surface truncate">
              {product.name}
            </h4>
            <p className="text-primary font-medium text-xs lg:text-sm mt-1 lg:mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
            <span className="material-symbols-outlined text-5xl lg:text-6xl">
              search_off
            </span>
            <p className="mt-4 font-semibold text-sm">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}
