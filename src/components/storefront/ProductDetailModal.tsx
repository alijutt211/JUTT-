import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Minus, Plus, ShoppingBag, Check, Star, ShieldCheck, Truck } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    categories,
    settings,
    addToCart,
    setSelectedCategoryIds,
    setCurrentView,
    setAdminTab,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const assignedCategories = categories.filter((c) =>
    product.categoryIds.includes(c.id)
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setActiveProductModal(null);
    }, 900);
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryIds([catId]);
    setActiveProductModal(null);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto bg-stone-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-wider bg-stone-900 text-white px-2.5 py-1 rounded">
                Featured Selection
              </span>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category assignment list */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-2">
                <span className="text-stone-400 font-mono text-[11px] mr-1">
                  SKU: {product.sku}
                </span>
                <span className="text-stone-300">·</span>
                {assignedCategories.map((cat, idx) => (
                  <React.Fragment key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="text-stone-600 hover:text-stone-900 underline font-medium"
                    >
                      {cat.name}
                    </button>
                    {idx < assignedCategories.length - 1 && (
                      <span className="text-stone-300">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 font-display">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-semibold text-stone-800 tabular-nums">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500 tabular-nums">
                  {product.reviewCount} verified reviews
                </span>
              </div>

              {/* Price & Savings */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  {settings.currencySymbol}{product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {settings.currencySymbol}{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs md:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Stock status indicator */}
              <div className="mt-4 py-2 border-y border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Inventory Status:</span>
                {isOutOfStock ? (
                  <span className="font-semibold text-rose-600">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="font-semibold text-amber-600">Only {product.stock} units remaining</span>
                ) : (
                  <span className="font-medium text-emerald-700">In Stock ({product.stock} available)</span>
                )}
              </div>
            </div>

            {/* Purchase Action Section */}
            <div className="mt-6 pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded bg-stone-50 text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 font-semibold text-stone-800 tabular-nums min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-2.5 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : justAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · {settings.currencySymbol}{(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Free shipping &gt; {settings.currencySymbol}{settings.freeShippingThreshold}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Lifetime studio guarantee</span>
                </div>
              </div>

              {/* Admin quick edit shortcut */}
              <div className="text-right pt-2 border-t border-stone-100">
                <button
                  onClick={() => {
                    setActiveProductModal(null);
                    setCurrentView('admin');
                    setAdminTab('products');
                  }}
                  className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                >
                  Edit product in Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
