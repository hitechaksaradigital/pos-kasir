import { supabase } from "../lib/supabase";
import { Product } from "../types";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    image: data.image,
    category: data.category,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    image: data.image,
    category: data.category,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export const categories = [
  "All Products",
  "Apparel",
  "Footwear",
  "Accessories",
  "Electronics",
];
