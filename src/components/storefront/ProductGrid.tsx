import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { PackageOpen, RotateCcw, ShieldCheck } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    clearCategoryFilter,
    setSearchQuery,
    setCurrentView,
    setAdminTab,
  } = useStore();

  if (filteredProducts.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
          <PackageOpen className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-stone-900 font-display">
          No products found
        </h3>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          There are no products matching your selected category filters or search query.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              clearCategoryFilter();
              setSearchQuery('');
            }}
            className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Clear filters & search</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('admin');
              setAdminTab('products');
            }}
            className="px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Products in Admin</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
