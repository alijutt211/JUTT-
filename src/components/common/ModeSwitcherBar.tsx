import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Store, ShieldCheck, Tag, Package, ShoppingBag, ArrowRight } from 'lucide-react';

export const ModeSwitcherBar: React.FC = () => {
  const { currentView, setCurrentView, categories, products, orders } = useStore();

  const isStore = currentView === 'storefront';

  return (
    <div className="bg-stone-900 text-stone-300 text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            {isStore ? (
              <>
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-100">Storefront Mode</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400 hidden sm:inline">Browsing as customer</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-stone-100">Admin Control Panel</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400 hidden sm:inline">Store management active</span>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 text-stone-400 pl-3 border-l border-stone-800">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-stone-500" />
              <span>{categories.length} Categories</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-stone-500" />
              <span>{products.length} Products</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-stone-500" />
              <span>{orders.length} Orders</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isStore ? (
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium transition-colors border border-stone-700 hover:border-stone-600"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Admin Panel</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium transition-colors border border-stone-700 hover:border-stone-600"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Customer Storefront</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
