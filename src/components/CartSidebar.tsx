import { CartItem } from "../types";

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onOpenPayment: () => void;
  discount: number;
  onDiscountChange: (discount: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function CartSidebar({
  cart,
  onUpdateQty,
  onOpenPayment,
  discount,
  onDiscountChange,
  subtotal,
  tax,
  total,
  isMobileOpen,
  onMobileClose,
}: CartSidebarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartContent = (
    <>
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <div className="flex items-center gap-3">
          {/* Mobile close / drag handle */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="font-semibold text-xl lg:text-2xl leading-8 text-on-surface">
            Active Cart
          </h3>
        </div>
        <span className="bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-medium">
          {totalItems} Items
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto cart-scroll p-3 lg:p-4 space-y-3 lg:space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 select-none pointer-events-none py-10">
            <span className="material-symbols-outlined text-[56px] lg:text-[64px]">
              shopping_cart_off
            </span>
            <p className="mt-4 font-semibold text-sm">
              Cart is currently empty
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className="cart-item-animate bg-surface-container-lowest border border-outline-variant p-2 lg:p-3 rounded flex items-center justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs lg:text-sm tracking-wide text-on-surface truncate">
                  {item.product.name}
                </h5>
                <span className="font-medium text-xs lg:text-sm text-primary">
                  ${item.product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1 lg:gap-2 bg-surface-container rounded-full p-1 flex-shrink-0">
                <button
                  onClick={() => onUpdateQty(item.product.id, -1)}
                  className="h-7 w-7 lg:h-8 lg:w-8 flex items-center justify-center hover:bg-outline-variant rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                    remove
                  </span>
                </button>
                <span className="w-5 lg:w-6 text-center font-semibold text-xs lg:text-sm">
                  {item.qty}
                </span>
                <button
                  onClick={() => onUpdateQty(item.product.id, 1)}
                  className="h-7 w-7 lg:h-8 lg:w-8 flex items-center justify-center hover:bg-outline-variant rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                    add
                  </span>
                </button>
              </div>
              <div className="w-16 lg:w-20 text-right font-medium text-xs lg:text-sm text-on-surface flex-shrink-0">
                ${(item.product.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Summary */}
      <div className="p-4 lg:p-6 bg-surface-container-low space-y-3 lg:space-y-4 border-t border-outline-variant">
        <div className="space-y-2">
          <div className="flex justify-between text-sm lg:text-base text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-medium text-sm">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm lg:text-base text-on-surface-variant">
            <span>Discount</span>
            <div className="flex items-center gap-2">
              <input
                className="w-14 lg:w-16 bg-surface-container border border-outline-variant rounded px-2 py-0 text-right font-medium text-sm"
                type="number"
                value={discount}
                onChange={(e) =>
                  onDiscountChange(parseFloat(e.target.value) || 0)
                }
                min={0}
                max={100}
              />
              <span>%</span>
            </div>
          </div>
          <div className="flex justify-between text-sm lg:text-base text-on-surface-variant">
            <span>Tax (8%)</span>
            <span className="font-medium text-sm">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-3 lg:pt-4 border-t border-outline flex justify-between items-center">
          <span className="font-semibold text-lg lg:text-2xl leading-8 text-on-surface">
            Total
          </span>
          <span className="text-3xl lg:text-5xl leading-[44px] lg:leading-[56px] font-bold tracking-tight text-primary">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onOpenPayment}
          className="w-full bg-secondary-container text-on-secondary-container py-4 lg:py-8 rounded font-semibold text-xl lg:text-2xl leading-8 hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center justify-center gap-3 lg:gap-4"
        >
          <span className="material-symbols-outlined">payments</span>
          PAY
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Cart Sidebar - always visible on lg+ */}
      <section className="hidden lg:flex w-[400px] min-w-[400px] bg-surface border-l border-outline-variant flex-col">
        {cartContent}
      </section>

      {/* Mobile Cart - Bottom Sheet Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] slide-up">
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-0">
              <div className="w-10 h-1 bg-outline-variant rounded-full" />
            </div>
            {cartContent}
          </div>
        </div>
      )}
    </>
  );
}
