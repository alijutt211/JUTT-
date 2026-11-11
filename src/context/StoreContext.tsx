import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Category,
  Product,
  CartItem,
  Order,
  OrderStatus,
  PromoCode,
  StoreSettings,
} from '../types/store';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PROMO_CODES,
  INITIAL_SETTINGS,
} from '../data/initialData';

export type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'settings';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Store Data
  categories: Category[];
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  promoCodes: PromoCode[];
  settings: StoreSettings;
  appliedPromo: PromoCode | null;

  // View Navigation
  currentView: 'storefront' | 'admin';
  setCurrentView: (view: 'storefront' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Category Management (Admin)
  addCategory: (data: Omit<Category, 'id' | 'createdAt'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { affectedProductsCount: number };
  getCategoryById: (id: string) => Category | undefined;
  getProductsByCategory: (categoryId: string) => Product[];

  // Product Management (Admin)
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'slug'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Order Management
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;

  // Promo Code Management
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addPromoCode: (promo: PromoCode) => void;
  togglePromoCode: (code: string) => void;
  deletePromoCode: (code: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;

  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  cartCount: number;

  // Storefront Filtering & Search
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  toggleCategorySelection: (categoryId: string) => void;
  clearCategoryFilter: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filteredProducts: Product[];

  // Modals & UI helpers
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEYS = {
  CATEGORIES: 'aura_store_categories_v2',
  PRODUCTS: 'aura_store_products_v2',
  ORDERS: 'aura_store_orders_v2',
  CART: 'aura_store_cart_v2',
  PROMOS: 'aura_store_promos_v2',
  SETTINGS: 'aura_store_settings_v2',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Categories State with localStorage
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 2. Products State with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 3. Orders State with localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Promo Codes State
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROMOS);
      return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
    } catch {
      return INITIAL_PROMO_CODES;
    }
  });

  // 6. Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // UI States
  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>('storefront');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Filter States
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // CATEGORY OPERATIONS
  const addCategory = (data: Omit<Category, 'id' | 'createdAt'>): Category => {
    const id = `cat-${Date.now().toString(36)}`;
    const newCategory: Category = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${data.name}" created successfully`);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated');
  };

  const deleteCategory = (id: string): { affectedProductsCount: number } => {
    const affected = products.filter((p) => p.categoryIds.includes(id));
    // Remove this category from all products that have it assigned
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        categoryIds: p.categoryIds.filter((cId) => cId !== id),
      }))
    );
    // Remove category
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Remove from active storefront filter if selected
    setSelectedCategoryIds((prev) => prev.filter((cId) => cId !== id));

    showToast(`Category deleted. Detached from ${affected.length} product(s).`, 'info');
    return { affectedProductsCount: affected.length };
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const getProductsByCategory = (categoryId: string) =>
    products.filter((p) => p.categoryIds.includes(categoryId));

  // PRODUCT OPERATIONS
  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'slug'>): Product => {
    const id = `prod-${Date.now().toString(36)}`;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: Product = {
      ...data,
      id,
      slug: slug || id,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${data.name}" added to catalog`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.name && !updates.slug) {
          updated.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        return updated;
      })
    );
    showToast('Product updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (activeProductModal?.id === id) {
      setActiveProductModal(null);
    }
    showToast('Product removed from catalog', 'info');
  };

  const updateProductStock = (id: string, newStock: number) => {
    const cleanStock = Math.max(0, Math.floor(newStock));
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: cleanStock } : p))
    );
    showToast(`Stock updated to ${cleanStock}`);
  };

  // ORDER OPERATIONS
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const item = orderData.items.find((i) => i.productId === prod.id);
        if (item) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - item.quantity),
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setLastPlacedOrder(newOrder);
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order #${id} marked as ${status}`);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showToast('Order record deleted', 'info');
  };

  // CART OPERATIONS
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Item is currently out of stock', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    setIsCartOpen(true);
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock;
          return { ...item, quantity: Math.min(max, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // PROMO CODE LOGIC
  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const formatted = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === formatted && p.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This code requires a minimum spend of ${settings.currencySymbol}${found.minSpend}`,
      };
    }
    setAppliedPromo(found);
    showToast(`Promo ${found.code} applied (${found.discountPercent}% OFF)`);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [...prev, promo]);
    showToast(`Promo code ${promo.code} added`);
  };

  const togglePromoCode = (code: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  const deletePromoCode = (code: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    if (appliedPromo?.code === code) setAppliedPromo(null);
    showToast('Promo code deleted');
  };

  // SETTINGS & BACKUP
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved');
  };

  const resetToDefaults = () => {
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setPromoCodes(INITIAL_PROMO_CODES);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setSelectedCategoryIds([]);
    setSearchQuery('');
    showToast('Reset store data to default catalog');
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        categories,
        products,
        orders,
        promoCodes,
        settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.categories) setCategories(data.categories);
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.promoCodes) setPromoCodes(data.promoCodes);
      if (data.settings) setSettings(data.settings);
      showToast('Store data successfully imported!');
      return true;
    } catch {
      showToast('Invalid JSON file format', 'error');
      return false;
    }
  };

  // CART CALCULATIONS
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    return (cartSubtotal * appliedPromo.discountPercent) / 100;
  }, [cartSubtotal, appliedPromo]);

  const cartShipping = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartSubtotal >= settings.freeShippingThreshold) return 0;
    return settings.shippingFee;
  }, [cartSubtotal, cart.length, settings]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  }, [cartSubtotal, cartDiscount, cartShipping]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // STOREFRONT FILTERING
  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryIds([]);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active status check for storefront
        if (p.status !== 'active') return false;

        // Category filter: If any categories selected, product must have at least one of them
        if (selectedCategoryIds.length > 0) {
          const hasSelectedCategory = selectedCategoryIds.some((catId) =>
            p.categoryIds.includes(catId)
          );
          if (!hasSelectedCategory) return false;
        }

        // Search query filter: Name, description, or SKU
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchSku) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: featured first, then rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [products, selectedCategoryIds, searchQuery, sortBy]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        orders,
        cart,
        promoCodes,
        settings,
        appliedPromo,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getProductsByCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        applyPromoCode,
        removePromoCode,
        addPromoCode,
        togglePromoCode,
        deletePromoCode,
        updateSettings,
        resetToDefaults,
        exportDataJson,
        importDataJson,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        cartCount,
        selectedCategoryIds,
        setSelectedCategoryIds,
        toggleCategorySelection,
        clearCategoryFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredProducts,
        activeProductModal,
        setActiveProductModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
