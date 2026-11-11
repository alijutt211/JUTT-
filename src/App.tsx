/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ModeSwitcherBar } from './components/common/ModeSwitcherBar';
import { ToastContainer } from './components/common/ToastContainer';

// Storefront components
import { StoreNavbar } from './components/storefront/StoreNavbar';
import { HeroBanner } from './components/storefront/HeroBanner';
import { CategoryFilterBar } from './components/storefront/CategoryFilterBar';
import { ProductGrid } from './components/storefront/ProductGrid';
import { StoreFooter } from './components/storefront/StoreFooter';
import { CartDrawer } from './components/storefront/CartDrawer';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderConfirmationModal } from './components/storefront/OrderConfirmationModal';
import { OrderTrackerModal } from './components/storefront/OrderTrackerModal';

// Admin components
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CategoriesManager } from './components/admin/CategoriesManager';
import { ProductsManager } from './components/admin/ProductsManager';
import { OrdersManager } from './components/admin/OrdersManager';
import { StoreSettingsView } from './components/admin/StoreSettingsView';

const StoreContent: React.FC = () => {
  const { currentView, adminTab } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Mode Bar (Toggle between Storefront and Admin Panel anytime) */}
      <ModeSwitcherBar />

      {currentView === 'storefront' ? (
        <>
          <StoreNavbar />
          <main className="flex-1">
            <HeroBanner />
            <CategoryFilterBar />
            <ProductGrid />
          </main>
          <StoreFooter />
        </>
      ) : (
        <div className="flex-1 flex flex-col bg-stone-100/70">
          <AdminHeader />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'categories' && <CategoriesManager />}
            {adminTab === 'products' && <ProductsManager />}
            {adminTab === 'orders' && <OrdersManager />}
            {adminTab === 'settings' && <StoreSettingsView />}
          </main>
        </div>
      )}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
