import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { settings, categories, setSelectedCategoryIds, setCurrentView, setAdminTab } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryIds([catId]);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      {/* Values Strip */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Complimentary Delivery</h4>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Orders over {settings.currencySymbol}{settings.freeShippingThreshold} ship free worldwide.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Authentic Craftsmanship</h4>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Small-batch artisan productions with lifetime guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Mindful Returns</h4>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  30-day hassle-free return and exchange policy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Managed Store Backoffice</h4>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Full admin CRUD for categories, stock, and orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              {settings.storeName}
            </h3>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              {settings.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-stone-400">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Customer Services
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>Shipping & Freight Policies</li>
              <li>Care & Maintenance Guides</li>
              <li>Order Status Tracking</li>
              <li>Artisan Workshop Collaborations</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Store Administrator
            </h4>
            <p className="text-stone-400 text-[11px] mb-3">
              Authorized staff can manage the product catalog, add new categories, and fulfill orders.
            </p>
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('dashboard');
              }}
              className="px-3.5 py-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold transition-colors flex items-center gap-2 border border-stone-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Admin Dashboard</span>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-3">
          <div>
            © {new Date().getFullYear()} {settings.storeName} Studio Goods. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
