// Sidebar component

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onNewTransaction: () => void;
}

const navItems = [
  { id: "products", icon: "inventory_2", label: "Product Management" },
  { id: "checkout", icon: "point_of_sale", label: "Checkout" },
  { id: "receipts", icon: "receipt_long", label: "Receipts" },
];

export default function Sidebar({
  activeNav,
  onNavChange,
  onNewTransaction,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-surface-container-lowest border-r border-outline-variant z-50">
      <div className="p-6 flex flex-col gap-2">
        <span className="font-semibold text-2xl leading-8 text-primary">
          Enterprise POS
        </span>
        <span className="text-xs font-medium text-on-surface-variant">
          Terminal #01
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded transition-all duration-150 ${
              activeNav === item.id
                ? "text-primary bg-secondary-fixed font-semibold scale-[0.98]"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-outline-variant">
        <button
          onClick={onNewTransaction}
          className="w-full bg-primary text-on-primary py-4 rounded font-semibold text-sm tracking-wide mb-6 hover:opacity-90 active:scale-95 transition-all"
        >
          New Transaction
        </button>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-4 p-4 rounded hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-base">Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-base">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
