import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types/store';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'blue', label: 'Cobalt', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-100 text-violet-800 border-violet-300' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'slate', label: 'Slate', bg: 'bg-stone-200 text-stone-800 border-stone-300' },
];

export const CategoriesManager: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    setAdminTab,
    setSelectedCategoryIds,
    setCurrentView,
  } = useStore();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [viewingCategoryProducts, setViewingCategoryProducts] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'emerald',
  });

  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: 'emerald',
    });
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color || 'emerald',
    });
    setFormError('');
  };

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required');
      return;
    }

    const finalSlug =
      formData.slug.trim() ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check duplicate slug
    if (categories.some((c) => c.slug === finalSlug)) {
      setFormError('A category with this identifier or slug already exists');
      return;
    }

    addCategory({
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      color: formData.color,
    });

    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formData.name.trim()) {
      setFormError('Category name is required');
      return;
    }

    const finalSlug =
      formData.slug.trim() ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check duplicate slug (excluding self)
    if (categories.some((c) => c.id !== editingCategory.id && c.slug === finalSlug)) {
      setFormError('A category with this identifier already exists');
      return;
    }

    updateCategory(editingCategory.id, {
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      color: formData.color,
    });

    setEditingCategory(null);
  };

  const confirmDelete = () => {
    if (!deletingCategory) return;
    deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  const handleFilterStorefrontByCat = (catId: string) => {
    setSelectedCategoryIds([catId]);
    setCurrentView('storefront');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Product Categories System
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Create, edit, and organize product categories. Products can be tagged with one or multiple categories simultaneously.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-500" />
            <span>Configured Categories</span>
          </div>
          <span className="text-xs text-stone-500">
            Click on product counts to view assigned items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Category Name</th>
                <th className="py-3 px-4 font-semibold">Slug / Key</th>
                <th className="py-3 px-4 font-semibold">Description</th>
                <th className="py-3 px-4 font-semibold text-center">Assigned Products</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat) => {
                const assignedProducts = products.filter((p) =>
                  p.categoryIds.includes(cat.id)
                );
                const colorDef =
                  COLOR_OPTIONS.find((c) => c.id === cat.color) || COLOR_OPTIONS[0];

                return (
                  <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 border ${colorDef.bg}`}
                        />
                        <span className="font-semibold text-stone-900 font-display text-sm">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                      {cat.slug}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setViewingCategoryProducts(cat)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                        title="View products assigned to this category"
                      >
                        <Package className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-mono tabular-nums">{assignedProducts.length}</span>
                        <span className="text-[10px] text-stone-500">
                          {assignedProducts.length === 1 ? 'item' : 'items'}
                        </span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleFilterStorefrontByCat(cat.id)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="View in storefront catalog"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete category"
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

      {/* CREATE CATEGORY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Create Product Category
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Footwear & Shoes"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Identifier / Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. footwear-shoes"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                  }
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                />
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Used internally for routing and filtering.
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of products in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Color Tag Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.id })}
                      className={`px-2.5 py-1 rounded text-xs border font-medium flex items-center gap-1.5 transition-all ${
                        formData.color === c.id
                          ? `${c.bg} ring-2 ring-stone-900`
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-stone-900" />
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Edit Category: {editingCategory.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Identifier / Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                  }
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Color Tag Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.id })}
                      className={`px-2.5 py-1 rounded text-xs border font-medium flex items-center gap-1.5 transition-all ${
                        formData.color === c.id
                          ? `${c.bg} ring-2 ring-stone-900`
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${c.bg}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCategory && (
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
                  Delete Category "{deletingCategory.name}"?
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {products.filter((p) => p.categoryIds.includes(deletingCategory.id)).length > 0 ? (
                    <>
                      This category is currently assigned to{' '}
                      <strong>
                        {products.filter((p) => p.categoryIds.includes(deletingCategory.id)).length} product(s)
                      </strong>
                      . Deleting it will safely remove this category assignment from those products. The products themselves will <strong>NOT</strong> be deleted.
                    </>
                  ) : (
                    <>No products are currently assigned to this category. It will be removed permanently.</>
                  )}
                </p>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 py-2 px-4 rounded border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 px-4 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PRODUCTS IN CATEGORY MODAL */}
      {viewingCategoryProducts && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  Category Filter
                </span>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Products in "{viewingCategoryProducts.name}"
                </h3>
              </div>
              <button
                onClick={() => setViewingCategoryProducts(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-stone-100">
              {products.filter((p) => p.categoryIds.includes(viewingCategoryProducts.id)).length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-500">
                  No products are currently assigned to this category.
                </div>
              ) : (
                products
                  .filter((p) => p.categoryIds.includes(viewingCategoryProducts.id))
                  .map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover bg-stone-100 shrink-0 border border-stone-200"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-stone-900">${p.price.toFixed(2)}</div>
                        <div className="text-[11px] text-stone-500">{p.stock} in stock</div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  setViewingCategoryProducts(null);
                  setAdminTab('products');
                }}
                className="text-stone-700 hover:text-stone-950 font-medium underline"
              >
                Go to Products Manager
              </button>
              <button
                onClick={() => setViewingCategoryProducts(null)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
