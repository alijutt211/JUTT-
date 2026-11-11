import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { PRESET_IMAGE_OPTIONS } from '../../data/initialData';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Filter,
  Check,
  Star,
  ExternalLink,
  Tag,
  AlertTriangle,
  Minus,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const {
    products,
    categories,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    setAdminTab,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: 49,
    originalPrice: 0,
    stock: 10,
    imageUrl: PRESET_IMAGE_OPTIONS[0].url,
    categoryIds: [] as string[],
    featured: false,
    status: 'active' as 'active' | 'draft',
    rating: 4.8,
    reviewCount: 12,
  });

  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `AUR-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      price: 65,
      originalPrice: 0,
      stock: 15,
      imageUrl: PRESET_IMAGE_OPTIONS[0].url,
      // Default to first category if available
      categoryIds: categories.length > 0 ? [categories[0].id] : [],
      featured: false,
      status: 'active',
      rating: 4.9,
      reviewCount: 8,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stock: p.stock,
      imageUrl: p.imageUrl,
      categoryIds: [...p.categoryIds],
      featured: !!p.featured,
      status: p.status === 'archived' ? 'draft' : p.status,
      rating: p.rating,
      reviewCount: p.reviewCount,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.categoryIds.includes(catId);
      if (exists) {
        return { ...prev, categoryIds: prev.categoryIds.filter((id) => id !== catId) };
      } else {
        return { ...prev, categoryIds: [...prev.categoryIds, catId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product title is required');
      return;
    }
    if (formData.price <= 0) {
      setFormError('Price must be greater than zero');
      return;
    }
    if (formData.categoryIds.length === 0) {
      setFormError('Please assign at least one category to this product');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice > 0 ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl.trim(),
        categoryIds: formData.categoryIds,
        featured: formData.featured,
        status: formData.status,
      });
    } else {
      addProduct({
        name: formData.name.trim(),
        sku: formData.sku.trim() || `AUR-${Date.now().toString(36).toUpperCase()}`,
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice > 0 ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl.trim() || PRESET_IMAGE_OPTIONS[0].url,
        categoryIds: formData.categoryIds,
        featured: formData.featured,
        status: formData.status,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
      });
    }

    setIsModalOpen(false);
  };

  // Filter products for admin table
  const displayedProducts = products.filter((p) => {
    if (selectedFilterCategory !== 'all' && !p.categoryIds.includes(selectedFilterCategory)) {
      return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Product Catalog Management
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage product titles, prices, multi-category tags, imagery, and inventory counts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Filter by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-stone-200 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none text-stone-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Showing {displayedProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Assigned Categories</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold text-center">Stock Level</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedProducts.map((p) => {
                const assignedCats = categories.filter((c) =>
                  p.categoryIds.includes(c.id)
                );

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900 font-display text-sm truncate">
                              {p.name}
                            </span>
                            {p.featured && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Multi-assigned categories */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {assignedCats.length > 0 ? (
                          assignedCats.map((c) => (
                            <span
                              key={c.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200"
                            >
                              <Tag className="w-2.5 h-2.5 text-stone-400" />
                              <span>{c.name}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 italic">No category assigned</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 tabular-nums">
                        {settings.currencySymbol}{p.price.toFixed(2)}
                      </div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[11px] text-stone-400 line-through tabular-nums">
                          {settings.currencySymbol}{p.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Stock with quick +/- buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 border border-stone-200 rounded px-2 py-1 bg-stone-50">
                        <button
                          onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 1))}
                          className="p-0.5 text-stone-400 hover:text-stone-800 disabled:opacity-30"
                          disabled={p.stock <= 0}
                          title="Decrease stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className={`font-mono font-bold tabular-nums min-w-8 text-center text-xs ${
                            p.stock === 0
                              ? 'text-rose-600'
                              : p.stock <= 5
                              ? 'text-amber-600'
                              : 'text-stone-900'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                          className="p-0.5 text-stone-400 hover:text-stone-800"
                          title="Increase stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updateProduct(p.id, {
                            status: p.status === 'active' ? 'draft' : 'active',
                          })
                        }
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {p.status === 'active' ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Edit product"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-900" />
                <h3 className="text-base font-bold text-stone-900 font-display">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs">
                  {formError}
                </div>
              )}

              {/* Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architectural Ceramic Pitcher"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="AUR-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                  />
                </div>
              </div>

              {/* MULTI-CATEGORY ASSIGNMENT SELECTOR (CORE REQUIREMENT) */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold">
                    Assign Categories (Select one or more) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setAdminTab('categories');
                    }}
                    className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create new category</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Products can appear in multiple collections (e.g. both 'Home & Living' and 'Best Sellers').
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((c) => {
                    const isSelected = formData.categoryIds.includes(c.id);

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleToggleCategory(c.id)}
                        className={`px-3 py-1.5 rounded text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-stone-300'}`} />
                        <span>{c.name}</span>
                        {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {formData.categoryIds.length > 0 && (
                  <div className="text-[11px] text-stone-500 pt-1">
                    {formData.categoryIds.length} categories assigned
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Price ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 85.00"
                    value={formData.originalPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Product Image
                </label>

                {/* Preset image buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {PRESET_IMAGE_OPTIONS.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: opt.url })}
                      className={`relative aspect-[4/3] rounded overflow-hidden border transition-all ${
                        formData.imageUrl === opt.url
                          ? 'border-stone-900 ring-2 ring-stone-900'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={opt.url}
                        alt={opt.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] bg-stone-950/80 text-white truncate px-1 rounded">
                        {opt.categorySuggestion}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or enter custom image URL (https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Material breakdown, craftsmanship notes, origin..."
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                />
              </div>

              {/* Status and Featured Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Featured on storefront</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">Catalog Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-medium"
                  >
                    <option value="active">Active (Visible in store)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold transition-colors"
                >
                  {editingProduct ? 'Save Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Delete "{deletingProduct.name}"?
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  This product will be permanently removed from the catalog. This action cannot be undone.
                </p>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 py-2 px-4 rounded border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProduct(deletingProduct.id);
                    setDeletingProduct(null);
                  }}
                  className="flex-1 py-2 px-4 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
