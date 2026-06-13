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

export const categories = [
  "All Products",
  "Apparel",
  "Footwear",
  "Accessories",
  "Electronics",
];
