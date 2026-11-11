import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/store';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, settings, updateOrderStatus, deleteOrder } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: `All (${orders.length})` },
    { id: 'pending', label: `Pending (${orders.filter((o) => o.status === 'pending').length})` },
    { id: 'processing', label: `Processing (${orders.filter((o) => o.status === 'processing').length})` },
    { id: 'shipped', label: `Shipped (${orders.filter((o) => o.status === 'shipped').length})` },
    { id: 'delivered', label: `Delivered (${orders.filter((o) => o.status === 'delivered').length})` },
    { id: 'cancelled', label: `Cancelled (${orders.filter((o) => o.status === 'cancelled').length})` },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method === 'credit_card') return <CreditCard className="w-3.5 h-3.5 text-stone-600" />;
    if (method === 'apple_pay') return <Smartphone className="w-3.5 h-3.5 text-stone-600" />;
    return <Banknote className="w-3.5 h-3.5 text-stone-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Orders Management
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
              {orders.length} Total Orders
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track customer shipments, process invoices, and manage fulfillment statuses.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-stone-200 focus:outline-none focus:border-stone-900"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStatus(s.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStatus === s.id
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Reference</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {order.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500">{order.customerEmail}</div>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      <span className="font-medium text-stone-800">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                      </span>
                      <span className="text-stone-400 text-[11px] block truncate max-w-xs">
                        {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                      {settings.currencySymbol}{order.total.toFixed(2)}
                      {order.promoCode && (
                        <span className="block text-[10px] text-emerald-700 font-normal">
                          Promo: {order.promoCode}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        {getPaymentIcon(order.paymentMethod)}
                        <span className="capitalize text-[11px]">
                          {order.paymentMethod === 'credit_card'
                            ? 'Card'
                            : order.paymentMethod === 'apple_pay'
                            ? 'Apple Pay'
                            : 'COD'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status Select dropdown for instant updating */}
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-stone-50 text-stone-800 border-stone-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="View order details and invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & INVOICE MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase">
                  Order Invoice
                </span>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Order {viewingOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {/* Status and Date */}
              <div className="flex flex-wrap items-center justify-between p-3 rounded bg-stone-50 border border-stone-200 gap-2">
                <div>
                  <span className="text-stone-500 block text-[11px]">Current Status:</span>
                  <div className="mt-0.5">{getStatusBadge(viewingOrder.status)}</div>
                </div>

                <div className="text-right">
                  <span className="text-stone-500 block text-[11px]">Placed on:</span>
                  <span className="font-medium text-stone-800">
                    {new Date(viewingOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block mb-1">
                    Customer Info
                  </span>
                  <p className="font-medium text-stone-800">{viewingOrder.customerName}</p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{viewingOrder.customerEmail}</span>
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{viewingOrder.customerPhone}</span>
                  </p>
                </div>

                <div className="p-3 rounded border border-stone-200 space-y-1.5">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block mb-1">
                    Delivery Address
                  </span>
                  <p className="text-stone-700 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>
                      {viewingOrder.shippingAddress.street}
                      <br />
                      {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.postalCode}
                      <br />
                      {viewingOrder.shippingAddress.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block mb-2">
                  Line Items
                </span>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            SKU: {item.sku} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-stone-900 tabular-nums">
                        {settings.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Calculations */}
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">
                    {settings.currencySymbol}{viewingOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({viewingOrder.promoCode})</span>
                    <span className="tabular-nums">
                      -{settings.currencySymbol}{viewingOrder.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-medium">
                    {viewingOrder.shipping === 0 ? 'Free' : `${settings.currencySymbol}${viewingOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    {settings.currencySymbol}{viewingOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                {viewingOrder.status !== 'shipped' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(viewingOrder.id, 'shipped');
                      setViewingOrder({ ...viewingOrder, status: 'shipped' });
                    }}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded text-xs transition-colors"
                  >
                    Mark as Shipped
                  </button>
                )}
                {viewingOrder.status !== 'delivered' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(viewingOrder.id, 'delivered');
                      setViewingOrder({ ...viewingOrder, status: 'delivered' });
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition-colors"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
