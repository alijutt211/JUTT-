import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoCode } from '../../types/store';
import {
  Settings,
  Tag,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
  Save,
} from 'lucide-react';

export const StoreSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    promoCodes,
    addPromoCode,
    togglePromoCode,
    deletePromoCode,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    showToast,
  } = useStore();

  const [formSettings, setFormSettings] = useState({ ...settings });
  const [newPromo, setNewPromo] = useState<PromoCode>({
    code: '',
    discountPercent: 15,
    active: true,
  });

  const [importJsonText, setImportJsonText] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code.trim()) return;
    addPromoCode({
      code: newPromo.code.trim().toUpperCase(),
      discountPercent: Number(newPromo.discountPercent),
      active: true,
    });
    setNewPromo({ code: '', discountPercent: 15, active: true });
  };

  const handleExportDownload = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-store-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog & orders exported as JSON');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = importDataJson(importJsonText);
    if (success) setImportJsonText('');
  };

  return (
    <div className="space-y-8">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: General Configuration */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Settings className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-bold text-stone-900 font-display">
              General Store Configuration
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Store Brand Name
                </label>
                <input
                  type="text"
                  value={formSettings.storeName}
                  onChange={(e) => setFormSettings({ ...formSettings, storeName: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formSettings.currencySymbol}
                  onChange={(e) => setFormSettings({ ...formSettings, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Storefront Tagline / Editorial Ethos
              </label>
              <textarea
                rows={2}
                value={formSettings.tagline}
                onChange={(e) => setFormSettings({ ...formSettings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Free Shipping Minimum ({formSettings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={formSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      freeShippingThreshold: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Standard Flat Rate Shipping ({formSettings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={formSettings.shippingFee}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      shippingFee: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Store Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Promotional Codes */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Discount & Promo Codes
              </h3>
            </div>
            <span className="text-[11px] text-stone-400 font-mono">
              {promoCodes.filter((p) => p.active).length} Active
            </span>
          </div>

          {/* Add Promo Code Form */}
          <form onSubmit={handleAddPromo} className="flex gap-2 text-xs">
            <input
              type="text"
              placeholder="CODE (e.g. SUMMER15)"
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
              className="flex-1 px-3 py-1.5 rounded border border-stone-300 uppercase font-mono text-xs focus:outline-none focus:border-stone-900"
            />
            <input
              type="number"
              min="1"
              max="90"
              placeholder="%"
              value={newPromo.discountPercent}
              onChange={(e) =>
                setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) || 0 })
              }
              className="w-16 px-2 py-1.5 rounded border border-stone-300 font-mono text-xs focus:outline-none focus:border-stone-900 text-center"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-stone-900 text-white rounded font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </form>

          {/* Promo Codes List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {promoCodes.map((promo) => (
              <div
                key={promo.code}
                className="flex items-center justify-between p-2.5 rounded bg-stone-50 border border-stone-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900 uppercase">
                    {promo.code}
                  </span>
                  <span className="text-stone-500 font-mono tabular-nums">
                    ({promo.discountPercent}% off)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePromoCode(promo.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      promo.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {promo.active ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => deletePromoCode(promo.code)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Delete promo code"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-2xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 font-display">
            Data Backup & Demo Catalog Reset
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Export your store configuration, categories, products, and orders as JSON, or reset to original sample catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          {/* Export */}
          <div className="p-4 rounded border border-stone-200 bg-stone-50 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Export Store Data</span>
              <p className="text-stone-500 text-[11px]">
                Download all products, categories, orders, and promo codes as a single JSON file.
              </p>
            </div>
            <button
              onClick={handleExportDownload}
              className="py-2 px-3 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded border border-stone-200 bg-stone-50 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Import Store JSON</span>
              <textarea
                rows={2}
                placeholder="Paste store JSON here..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-2 bg-white rounded border border-stone-300 font-mono text-[10px]"
              />
            </div>
            <button
              onClick={handleImportSubmit}
              disabled={!importJsonText.trim()}
              className="py-2 px-3 bg-stone-800 text-white rounded font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore from JSON</span>
            </button>
          </div>

          {/* Reset */}
          <div className="p-4 rounded border border-rose-200 bg-rose-50/50 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-rose-900 block mb-1">Reset to Default Catalog</span>
              <p className="text-stone-600 text-[11px]">
                Reverts categories, products, and orders to the initial studio demo data.
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Store Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-stone-200 p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-stone-900 font-display">
                Reset all store data?
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                This will overwrite any newly created categories, products, and placed orders with the original starter catalog.
              </p>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 px-3 rounded border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
