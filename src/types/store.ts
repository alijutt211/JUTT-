export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  categoryIds: string[]; // Can be assigned to one or more categories
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'cod' | 'apple_pay';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  active: boolean;
  minSpend?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingFee: number;
  taxRatePercent: number;
}
