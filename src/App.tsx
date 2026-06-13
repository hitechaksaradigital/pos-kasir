import { useState, useCallback, useMemo, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";
import PaymentModal from "./components/PaymentModal";
import { Product, CartItem } from "./types";
import { fetchProducts } from "./data/products";

export default function App() {
  const [activeNav, setActiveNav] = useState("checkout");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile-specific state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

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
    setIsMobileCartOpen(false);
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
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="lg:ml-64 flex flex-col h-screen">
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMenu={() => setIsSidebarOpen(true)}
          cartItemCount={totalItems}
          onOpenCart={() => setIsMobileCartOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-on-surface-variant">Loading products...</p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              searchQuery={searchQuery}
              onAddToCart={addToCart}
            />
          )}

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
            isMobileOpen={isMobileCartOpen}
            onMobileClose={() => setIsMobileCartOpen(false)}
          />
        </div>
      </main>

      {/* Mobile Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-[100] bg-primary text-on-primary shadow-2xl rounded-full px-5 py-3 flex items-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="font-semibold text-sm">{totalItems} items</span>
          <span className="font-bold text-sm">· ${total.toFixed(2)}</span>
        </button>
      )}

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
