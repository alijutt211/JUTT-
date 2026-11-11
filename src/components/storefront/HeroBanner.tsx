import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowDown, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { settings, categories, setSelectedCategoryIds } = useStore();

  const handleExplore = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickCategory = (catId: string) => {
    setSelectedCategoryIds([catId]);
    handleExplore();
  };

  return (
    <section className="relative overflow-hidden bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-3 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Studio Collection · 2026 Edition</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 font-display leading-[1.15] text-balance">
              Design for conscious living & intentional spaces.
            </h1>

            <p className="mt-4 text-base text-stone-600 leading-relaxed max-w-xl">
              {settings.tagline ||
                'Meticulously crafted objects spanning tactile homeware, artisanal leather goods, and precision studio audio. Governed by raw materiality and timeless form.'}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleExplore}
                className="px-5 py-2.5 text-sm font-medium text-white bg-stone-900 rounded hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <div className="text-xs text-stone-500 py-1 px-3 border-l border-stone-300">
                Free shipping on orders over {settings.currencySymbol}{settings.freeShippingThreshold}
              </div>
            </div>

            {/* Quick Category shortcuts */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                Popular Collections:
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleQuickCategory(cat.id)}
                    className="text-xs px-2.5 py-1 rounded bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 hover:text-stone-900 font-medium transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 shadow-sm border border-stone-200">
              <img
                src="/src/assets/images/hero_minimalist_storefront_1794370675578.jpg"
                alt="AURA minimalist showroom gallery"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                <span>Handcrafted & small-batch manufactured</span>
                <span className="tabular-nums">Curated 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
