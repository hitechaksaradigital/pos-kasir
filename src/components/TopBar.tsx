// TopBar component

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  return (
    <header className="h-16 w-full flex justify-between items-center px-6 bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded text-base focus:outline-none focus:border-primary"
            placeholder="Search product or scan barcode..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-secondary font-semibold text-sm tracking-wide border-l border-outline-variant pl-6">
          <span className="material-symbols-outlined">barcode_scanner</span>
          <span>Scanner Active</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">wifi</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">schedule</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-outline-variant overflow-hidden">
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
