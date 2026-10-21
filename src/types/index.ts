export type ServiceCategory = 'tenda' | 'plafon' | 'sound' | 'paket';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  pricePerDay: number;
  unitLabel: string;
  totalStock: number;
  availableStock: number;
  features: string[];
  imageUrl: string;
  popular?: boolean;
}

export type OrderStatus = 'Menunggu' | 'Dikonfirmasi' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';
export type PaymentStatus = 'Belum Bayar' | 'Menunggu Verifikasi DP' | 'DP Terverifikasi' | 'Lunas';

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // e.g. ORD-001
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
  eventLocation: string;
  notes?: string;
  items: OrderItem[];
  totalPrice: number;
  dpAmount: number; // 30% or 50%
  remainingAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: ServiceCategory;
  imageUrl: string;
  eventDate: string;
  location: string;
  description: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  orderId?: string;
  serviceCategory: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface UnitAvailability {
  category: ServiceCategory;
  label: string;
  totalUnits: number;
  rentedUnits: number;
  availableUnits: number;
}
