import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Tag,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    settings,
    setAdminTab,
    updateProductStock,
    updateOrderStatus,
  } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const activeProducts = products.filter((p) => p.status === 'active');

  return (
    <div className="space-y-8">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums font-display">
            {settings.currencySymbol}{totalRevenue.toFixed(2)}
          </div>
          <div className="mt-1 text-[11px] text-stone-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{orders.length} orders placed</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums font-display">
            {orders.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            {totalItemsSold} items fulfilled/pending
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Catalog Products</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums font-display">
            {activeProducts.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            {products.length - activeProducts.length} draft/archived
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Product Categories</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums font-display">
            {categories.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Multi-assignment supported
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-5 rounded-lg border shadow-2xs ${
          lowStockProducts.length > 0
            ? 'bg-amber-50/60 border-amber-200'
            : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Low Stock Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${
              lowStockProducts.length > 0 ? 'text-amber-600' : 'text-stone-400'
            }`} />
          </div>
          <div className={`text-2xl font-bold tabular-nums font-display ${
            lowStockProducts.length > 0 ? 'text-amber-900' : 'text-stone-900'
          }`}>
            {lowStockProducts.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            Items with $\le$ 5 units in stock
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Distribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Category Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Products can belong to multiple categories
              </p>
            </div>
            <button
              onClick={() => setAdminTab('categories')}
              className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1"
            >
              <span>Manage Categories</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const assignedCount = products.filter((p) =>
                p.categoryIds.includes(cat.id)
              ).length;
              const percentage = products.length > 0 ? (assignedCount / products.length) * 100 : 0;

              return (
                <div key={cat.id} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-stone-800">{cat.name}</span>
                    <span className="text-stone-500 font-mono tabular-nums">
                      {assignedCount} {assignedCount === 1 ? 'product' : 'products'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-800 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Inventory Watchlist
              </h3>
              <p className="text-xs text-stone-500">
                Quick stock adjustments
              </p>
            </div>
            <button
              onClick={() => setAdminTab('products')}
              className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded border border-stone-100">
              All inventory levels are healthy ($&gt;$ 5 units).
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded bg-stone-50 border border-stone-200 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded object-cover bg-stone-200 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-medium text-stone-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-stone-500 font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold tabular-nums ${
                      p.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </span>

                    <button
                      onClick={() => updateProductStock(p.id, p.stock + 10)}
                      className="px-2 py-1 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1 text-[11px] font-medium"
                      title="Add 10 units of stock"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+10</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Recent Store Orders
            </h3>
            <p className="text-xs text-stone-500">
              Latest incoming customer checkouts
            </p>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1"
          >
            <span>All Orders ({orders.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-y border-stone-200">
              <tr>
                <th className="py-2.5 px-3 font-medium">Order ID</th>
                <th className="py-2.5 px-3 font-medium">Customer</th>
                <th className="py-2.5 px-3 font-medium">Items</th>
                <th className="py-2.5 px-3 font-medium">Total</th>
                <th className="py-2.5 px-3 font-medium">Payment</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-stone-900">{order.customerName}</div>
                    <div className="text-[11px] text-stone-500">{order.customerEmail}</div>
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-900 tabular-nums">
                    {settings.currencySymbol}{order.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 uppercase text-[11px] text-stone-600">
                    {order.paymentMethod === 'credit_card'
                      ? 'Credit Card'
                      : order.paymentMethod === 'apple_pay'
                      ? 'Apple Pay'
                      : 'COD'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-2 py-1 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800 transition-colors"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-2 py-1 bg-emerald-800 text-white rounded text-[11px] font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Deliver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
