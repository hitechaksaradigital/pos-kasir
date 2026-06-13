import { useState, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";
import PaymentModal from "./components/PaymentModal";
import { products } from "./data/products";
import { Product, CartItem } from "./types";

export default function App() {
  const [activeNav, setActiveNav] = useState("checkout");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId
          ? { ...item, qty: item.qty + delta }
          : item
      );
      return updated.filter((item) => item.qty > 0);
    });
  }, []);

  const { subtotal, tax, total } = useMemo(() => {
    const sub = cart.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );
    const discountVal = sub * (discount / 100);
    const taxVal = (sub - discountVal) * 0.08;
    const totalVal = sub - discountVal + taxVal;
    return { subtotal: sub, tax: taxVal, total: totalVal };
  }, [cart, discount]);

  const handleOpenPayment = useCallback(() => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    setIsPaymentOpen(true);
  }, [cart.length]);

  const handleCompleteTransaction = useCallback(() => {
    alert("Transaction Completed Successfully!");
    setCart([]);
    setDiscount(0);
    setIsPaymentOpen(false);
  }, []);

  const handleNewTransaction = useCallback(() => {
    setCart([]);
    setDiscount(0);
    setSearchQuery("");
  }, []);

  return (
    <div className="bg-background text-on-surface font-inter overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onNewTransaction={handleNewTransaction}
      />

      {/* Main Content Area */}
      <main className="ml-64 flex flex-col h-screen">
        {/* Top Bar */}
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="flex flex-1 overflow-hidden">
          {/* Product Grid */}
          <ProductGrid
            products={products}
            searchQuery={searchQuery}
            onAddToCart={addToCart}
          />

          {/* Cart Sidebar */}
          <CartSidebar
            cart={cart}
            onUpdateQty={updateQty}
            onOpenPayment={handleOpenPayment}
            discount={discount}
            onDiscountChange={setDiscount}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        total={total}
        onClose={() => setIsPaymentOpen(false)}
        onComplete={handleCompleteTransaction}
      />
    </div>
  );
}
