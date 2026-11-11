import React from 'react';
import { useStore, AdminTab } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingBag,
  Settings,
  Store,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    adminTab,
    setAdminTab,
    categories,
    products,
    orders,
    settings,
  } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const tabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Tag, count: categories.length },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display text-white tracking-tight">
                  {settings.storeName} Admin
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Catalog & Order Operations Console
              </p>
            </div>
          </div>

          {/* Quick Stats & Return Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 rounded bg-stone-800/80 border border-stone-700/60 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Revenue: <strong className="text-white tabular-nums">{settings.currencySymbol}{totalRevenue.toFixed(2)}</strong></span>
              </div>
              {lowStockCount > 0 && (
                <>
                  <span className="text-stone-600">·</span>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{lowStockCount} Low Stock</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                    isActive ? 'bg-stone-700 text-amber-300' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
