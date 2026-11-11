import React, { useState } from 'react';
import { useStore, SortOption } from '../../context/StoreContext';
import { Filter, X, ArrowUpDown, Layers, ShieldCheck } from 'lucide-react';

export const CategoryFilterBar: React.FC = () => {
  const {
    categories,
    products,
    selectedCategoryIds,
    setSelectedCategoryIds,
    toggleCategorySelection,
    clearCategoryFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setCurrentView,
    setAdminTab,
  } = useStore();

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Helper to count active products in a category
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.status === 'active' && p.categoryIds.includes(categoryId)).length;
  };

  const totalActiveProducts = products.filter((p) => p.status === 'active').length;

  const handleCategoryClick = (catId: string) => {
    if (isMultiSelectMode) {
      toggleCategorySelection(catId);
    } else {
      if (selectedCategoryIds.length === 1 && selectedCategoryIds[0] === catId) {
        clearCategoryFilter();
      } else {
        setSelectedCategoryIds([catId]);
      }
    }
  };

  const handleOpenCategoriesAdmin = () => {
    setCurrentView('admin');
    setAdminTab('categories');
  };

  return (
    <div id="catalog-section" className="py-6 border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display">
                Curated Catalog
              </h2>
              <span className="text-xs text-stone-400 font-mono tabular-nums">
                ({totalActiveProducts} pieces)
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter by product categories or search by object name, material, or SKU.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Multi-category filter mode toggle */}
            <button
              onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors border ${
                isMultiSelectMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title="Filter by multiple categories simultaneously"
            >
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>Multi-select: {isMultiSelectMode ? 'On' : 'Off'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            {/* Admin shortcut */}
            <button
              onClick={handleOpenCategoriesAdmin}
              className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-800 transition-colors px-2 py-1.5 rounded hover:bg-stone-100"
              title="Manage product categories in Admin Panel"
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        {/* Categories Tab Strip (§1.A: clean functional interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={clearCategoryFilter}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategoryIds.length === 0
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            All Categories <span className="ml-1 opacity-75 tabular-nums">({totalActiveProducts})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id);
            const count = getProductCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] tabular-nums font-mono px-1 rounded ${
                  isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary row if filters are applied */}
        {(selectedCategoryIds.length > 0 || searchQuery.trim()) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-stone-600 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Active Filters:</span>
              </span>

              {selectedCategoryIds.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                if (!cat) return null;
                return (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200"
                  >
                    <span>{cat.name}</span>
                    <button
                      onClick={() => toggleCategorySelection(catId)}
                      className="hover:text-stone-950 p-0.5"
                      aria-label={`Remove filter ${cat.name}`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}

              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200">
                  <span>Search: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-stone-950 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                clearCategoryFilter();
                setSearchQuery('');
              }}
              className="text-stone-500 hover:text-stone-900 underline text-[11px] font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
