import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, PackageCheck } from 'lucide-react';

export const StoreNavbar: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    categories,
    selectedCategoryIds,
    setSelectedCategoryIds,
    setIsOrderTrackerOpen,
    searchQuery,
    setSearchQuery,
  } = useStore();

  // Top 4 categories for the top bar
  const mainCategories = categories.slice(0, 4);

  const handleCategoryClick = (catId?: string) => {
    if (!catId) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds([catId]);
    }
    // Scroll to catalog section if needed
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAllActive = selectedCategoryIds.length === 0;

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleCategoryClick()}
            className="text-2xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
          >
            {settings.storeName || 'AURA'}
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleCategoryClick()}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                isAllActive ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              All Goods
            </button>
            {mainCategories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    isSelected ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Search, Track Orders, and Shopping Bag */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100 hover:bg-stone-200/70 focus:bg-white text-xs pl-8 pr-3 py-1.5 rounded border border-transparent focus:border-stone-300 focus:outline-none transition-colors"
              />
            </div>

            {/* Track Order Button */}
            <button
              onClick={() => setIsOrderTrackerOpen(true)}
              className="p-2 text-stone-600 hover:text-stone-900 transition-colors rounded hover:bg-stone-100 flex items-center gap-1.5 text-xs font-medium"
              title="Track your order"
            >
              <PackageCheck className="w-4 h-4" />
              <span className="hidden lg:inline">Orders</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 rounded hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
              aria-label={`Shopping Bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-stone-950 text-[11px] font-bold rounded-full min-w-4 text-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
