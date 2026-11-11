import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Search, PackageCheck, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const OrderTrackerModal: React.FC = () => {
  const { isOrderTrackerOpen, setIsOrderTrackerOpen, orders, settings } = useStore();
  const [lookupId, setLookupId] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOrderTrackerOpen) return null;

  const matchedOrder = orders.find(
    (o) => o.id.toLowerCase() === lookupId.trim().toLowerCase()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" /> Shipped & In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Processing Order
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-stone-600 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-stone-900" />
            <h2 className="text-base font-bold text-stone-900 font-display">
              Track Your Order
            </h2>
          </div>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded transition-colors"
            aria-label="Close tracker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Lookup Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Enter order reference (e.g. ORD-8921)"
                value={lookupId}
                onChange={(e) => {
                  setLookupId(e.target.value);
                  setSearched(false);
                }}
                className="w-full text-xs pl-9 pr-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors"
            >
              Lookup
            </button>
          </form>

          {/* Result */}
          {matchedOrder ? (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <div>
                  <span className="text-[11px] text-stone-500 font-mono">Order {matchedOrder.id}</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{matchedOrder.customerName}</p>
                </div>
                <div>{getStatusBadge(matchedOrder.status)}</div>
              </div>

              <div>
                <span className="text-stone-500 block mb-1">Items:</span>
                <div className="space-y-1">
                  {matchedOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-stone-700">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="tabular-nums font-medium">
                        {settings.currencySymbol}{(i.price * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span className="tabular-nums">{settings.currencySymbol}{matchedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          ) : searched ? (
            <div className="p-4 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>No order found matching "{lookupId}". Please verify your order number.</span>
            </div>
          ) : (
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Recent Orders on this store:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {orders.slice(0, 3).map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setLookupId(ord.id);
                      setSearched(true);
                    }}
                    className="w-full text-left p-3 rounded border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-900">{ord.id}</span>
                      <span className="text-stone-500 ml-2">· {ord.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-semibold text-stone-800">
                        {settings.currencySymbol}{ord.total.toFixed(2)}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
