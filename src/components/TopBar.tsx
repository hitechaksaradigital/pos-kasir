import { useState } from "react";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMenu: () => void;
  cartItemCount: number;
  onOpenCart: () => void;
  activeNav?: string;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  onOpenMenu,
  cartItemCount,
  onOpenCart,
  activeNav = "checkout",
}: TopBarProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const isProductManagement = activeNav === "products";

  return (
    <header className="h-14 lg:h-16 w-full flex justify-between items-center px-3 lg:px-6 bg-surface border-b border-outline-variant sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-2 lg:gap-6 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMenu}
          className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Mobile: App title (hidden when search expanded) */}
        {!searchExpanded && (
          <span className="lg:hidden font-semibold text-base text-primary truncate">
            Enterprise POS
          </span>
        )}

        {/* Search - Hidden on product management page */}
        {!isProductManagement && (
          <div
            className={`relative ${
              searchExpanded
                ? "flex-1"
                : "hidden lg:block"
            } lg:w-96`}
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded text-sm lg:text-base focus:outline-none focus:border-primary"
              placeholder="Search product or scan barcode..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setSearchExpanded(false);
              }}
              autoFocus={searchExpanded}
            />
            {/* Close search on mobile */}
            {searchExpanded && (
              <button
                onClick={() => {
                  setSearchExpanded(false);
                  onSearchChange("");
                }}
                className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        )}

        {/* Scanner badge - desktop only, hidden on product management */}
        {!isProductManagement && (
          <div className="hidden lg:flex items-center gap-2 text-secondary font-semibold text-sm tracking-wide border-l border-outline-variant pl-6">
            <span className="material-symbols-outlined">barcode_scanner</span>
            <span>Scanner Active</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 lg:gap-4 flex-shrink-0">
        {/* Mobile search toggle - hidden on product management */}
        {!isProductManagement && !searchExpanded && (
          <button
            onClick={() => setSearchExpanded(true)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        )}

        {/* Mobile cart button - hidden on product management */}
        {!isProductManagement && (
          <button
            onClick={onOpenCart}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors relative"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        {!isProductManagement && (
          <>
            <button className="hidden lg:block p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">wifi</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hidden lg:block p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">schedule</span>
            </button>
          </>
        )}
        <div className="h-8 w-8 rounded-full bg-outline-variant overflow-hidden flex-shrink-0">
          <img
            alt="Manager Avatar"
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          />
        </div>
      </div>
    </header>
  );
}
