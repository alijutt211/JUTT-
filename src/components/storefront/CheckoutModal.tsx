import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, OrderItem } from '../../types/store';
import { X, ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedPromo,
    settings,
    createOrder,
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('841');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      }));

      createOrder({
        customerName: formData.fullName || 'Valued Customer',
        customerEmail: formData.email || 'customer@example.com',
        customerPhone: formData.phone || '+1 (555) 019-2831',
        shippingAddress: {
          fullName: formData.fullName || 'Valued Customer',
          email: formData.email || 'customer@example.com',
          phone: formData.phone || '+1 (555) 019-2831',
          street: formData.street || '742 Evergreen Terrace',
          city: formData.city || 'Springfield',
          postalCode: formData.postalCode || '97477',
          country: formData.country || 'United States',
        },
        items: orderItems,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping: cartShipping,
        total: cartTotal,
        promoCode: appliedPromo?.code,
        paymentMethod,
        status: 'processing',
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900 font-display">
              Express Checkout
            </h2>
            <span className="text-xs text-stone-400">· 256-bit Encrypted</span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Julian Thorne"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              2. Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-600 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="Apt, Suite, Street name"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Postal / ZIP Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="10001"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              3. Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded border text-left text-xs transition-colors flex flex-col justify-between h-20 ${
                  paymentMethod === 'credit_card'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span className="font-semibold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded border text-left text-xs transition-colors flex flex-col justify-between h-20 ${
                  paymentMethod === 'cod'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-stone-700" />
                <span className="font-semibold">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded border text-left text-xs transition-colors flex flex-col justify-between h-20 ${
                  paymentMethod === 'apple_pay'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-stone-700" />
                <span className="font-semibold">Instant Pay</span>
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-2 text-xs">
                <div>
                  <label className="block text-stone-500 text-[11px] mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-mono text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-stone-300 bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
                You will pay cash when your parcel is delivered to your doorstep.
              </div>
            )}
          </div>

          {/* Order Summary breakdown */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              4. Order Summary
            </h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items ({cart.length})</span>
                <span className="tabular-nums font-medium text-stone-800">
                  {settings.currencySymbol}{cartSubtotal.toFixed(2)}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span className="tabular-nums">-{settings.currencySymbol}{cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="tabular-nums font-medium text-stone-800">
                  {cartShipping === 0 ? 'Free' : `${settings.currencySymbol}${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span className="tabular-nums">{settings.currencySymbol}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <span>Confirming your order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Place Order · {settings.currencySymbol}{cartTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
