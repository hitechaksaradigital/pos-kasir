import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../data/products";

interface ProductManagementProps {
  onProductsChange: (products: Product[]) => void;
}

export default function ProductManagement({
  onProductsChange,
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      onProductsChange(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onProductsChange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = [
    "Apparel",
    "Footwear",
    "Accessories",
    "Electronics",
  ];

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", image: "", category: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image || "https://via.placeholder.com/150",
        category: formData.category,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-on-surface-variant">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-xl font-semibold text-on-surface">Product Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-primary text-on-primary px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
        >
          Add Product
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left p-3 text-on-surface-variant font-medium text-sm">
                Image
              </th>
              <th className="text-left p-3 text-on-surface-variant font-medium text-sm">
                Name
              </th>
              <th className="text-left p-3 text-on-surface-variant font-medium text-sm">
                Category
              </th>
              <th className="text-left p-3 text-on-surface-variant font-medium text-sm">
                Price
              </th>
              <th className="text-right p-3 text-on-surface-variant font-medium text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-outline-variant">
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3 text-on-surface">{product.name}</td>
                <td className="p-3 text-on-surface">{product.category}</td>
                <td className="p-3 text-primary font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-primary hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-error hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span className="material-symbols-outlined text-5xl">
              inventory_2
            </span>
            <p className="mt-4 font-semibold text-sm">No products found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-surface-container-lowest rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full p-2 rounded border border-outline-variant bg-surface text-on-surface"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full p-2 rounded border border-outline-variant bg-surface text-on-surface"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="w-full p-2 rounded border border-outline-variant bg-surface text-on-surface"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://via.placeholder.com/150"
                  className="w-full p-2 rounded border border-outline-variant bg-surface text-on-surface"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded border border-outline-variant text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded bg-primary text-on-primary font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}