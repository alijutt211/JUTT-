import React, { useState } from 'react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { Plus, Check, Star, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { categories, settings, addToCart, setActiveProductModal, setSelectedCategoryIds } = useStore();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Retrieve assigned categories
  const assignedCategories = categories.filter((c) =>
    product.categoryIds.includes(c.id)
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      className="group flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-stone-300 hover:shadow-sm cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-400 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1 stroke-[1.5]" />
            <span className="text-xs">{product.name}</span>
          </div>
        )}

        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-2.5 right-2.5 transition-opacity duration-150">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2 rounded-md shadow-xs text-xs font-medium flex items-center gap-1 transition-all ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-900/90 hover:bg-stone-900 text-white backdrop-blur-xs'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Quick add to cart'}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Added</span>
              </>
            ) : isOutOfStock ? (
              <span className="text-[11px]">Sold out</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Single stock status tag if low or out of stock (§1.A clean metadata) */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-stone-900/80 text-white text-[11px] font-medium backdrop-blur-xs">
            Sold out
          </span>
        ) : isLowStock ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-900/80 text-amber-100 text-[11px] font-medium backdrop-blur-xs">
            Only {product.stock} left
          </span>
        ) : product.originalPrice && product.originalPrice > product.price ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-stone-900/80 text-white text-[11px] font-medium backdrop-blur-xs tabular-nums">
            Save {settings.currencySymbol}{Math.round(product.originalPrice - product.price)}
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Assigned Categories (Clean unboxed metadata separated by middot) */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-500 mb-1">
            {assignedCategories.length > 0 ? (
              assignedCategories.map((cat, idx) => (
                <React.Fragment key={cat.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryIds([cat.id]);
                    }}
                    className="hover:text-stone-900 hover:underline transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                  {idx < assignedCategories.length - 1 && (
                    <span className="text-stone-300" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <span>Uncategorized</span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-stone-900 font-display line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Rating Baseline */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-stone-900 tabular-nums">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {settings.currencySymbol}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-stone-700 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 tabular-nums">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
