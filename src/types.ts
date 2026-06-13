export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type PaymentMethod = "cash" | "qris" | "bank" | "debit";
