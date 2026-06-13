// CartSidebar component
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
}: CartSidebarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <section className="w-[400px] min-w-[400px] bg-surface border-l border-outline-variant flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <h3 className="font-semibold text-2xl leading-8 text-on-surface">
          Active Cart
        </h3>
        <span className="bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-medium">
          {totalItems} Items
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto cart-scroll p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[64px]">
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
              className="cart-item-animate bg-surface-container-lowest border border-outline-variant p-3 rounded flex items-center justify-between"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h5 className="font-semibold text-sm tracking-wide text-on-surface truncate">
                  {item.product.name}
                </h5>
                <span className="font-medium text-sm text-primary">
                  ${item.product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container rounded-full p-1">
                <button
                  onClick={() => onUpdateQty(item.product.id, -1)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-outline-variant rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    remove
                  </span>
                </button>
                <span className="w-6 text-center font-semibold text-sm">
                  {item.qty}
                </span>
                <button
                  onClick={() => onUpdateQty(item.product.id, 1)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-outline-variant rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
              <div className="w-20 text-right font-medium text-sm text-on-surface ml-4">
                ${(item.product.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Summary */}
      <div className="p-6 bg-surface-container-low space-y-4 border-t border-outline-variant">
        <div className="space-y-2">
          <div className="flex justify-between text-base text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-medium text-sm">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-base text-on-surface-variant">
            <span>Discount</span>
            <div className="flex items-center gap-2">
              <input
                className="w-16 bg-surface-container border border-outline-variant rounded px-2 py-0 text-right font-medium text-sm"
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
          <div className="flex justify-between text-base text-on-surface-variant">
            <span>Tax (8%)</span>
            <span className="font-medium text-sm">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-outline flex justify-between items-center">
          <span className="font-semibold text-2xl leading-8 text-on-surface">
            Total
          </span>
          <span className="text-5xl leading-[56px] font-bold tracking-tight text-primary">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onOpenPayment}
          className="w-full bg-secondary-container text-on-secondary-container py-8 rounded font-semibold text-2xl leading-8 hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center justify-center gap-4"
        >
          <span className="material-symbols-outlined">payments</span>
          PAY
        </button>
      </div>
    </section>
  );
}
