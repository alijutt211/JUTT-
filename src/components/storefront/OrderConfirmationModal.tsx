import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, X, ShieldCheck, ArrowRight, Package } from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, settings, setCurrentView, setAdminTab } = useStore();

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const handleViewInAdmin = () => {
    setLastPlacedOrder(null);
    setCurrentView('admin');
    setAdminTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 rounded transition-colors"
          aria-label="Close confirmation"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Order Confirmed
          </span>
          <h2 className="text-xl font-bold text-stone-900 font-display mt-1">
            Thank you, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Order Reference: <strong className="text-stone-900 font-mono">{order.id}</strong>
          </p>

          {/* Delivery & Items Summary */}
          <div className="mt-6 text-left bg-stone-50 rounded-lg p-4 border border-stone-200 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-stone-500">Shipping to:</span>
              <span className="font-medium text-stone-800 text-right truncate max-w-[200px]">
                {order.shippingAddress.street}, {order.shippingAddress.city}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block mb-2">Ordered Items:</span>
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-700">
                    <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                    <span className="tabular-nums font-medium shrink-0">
                      {settings.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
              <span>Total Paid</span>
              <span className="tabular-nums">{settings.currencySymbol}{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Admin notification hint */}
          <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Store Manager Real-time Update:</span>
              <span>This order is now live in your Admin Orders dashboard. Product stock has been updated accordingly.</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setLastPlacedOrder(null)}
              className="flex-1 py-2 px-4 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>

            <button
              onClick={handleViewInAdmin}
              className="flex-1 py-2 px-4 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View in Admin Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
