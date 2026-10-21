import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  Order,
  Customer,
  GalleryPhoto,
  CustomerReview,
  OrderStatus,
  PaymentStatus,
  ServiceCategory
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS
} from '../data/mockData';

export type UserRole = 'customer' | 'admin';
export type AdminTab = 
  | 'dashboard' 
  | 'customers' 
  | 'catalog' 
  | 'orders' 
  | 'schedule' 
  | 'payments' 
  | 'gallery' 
  | 'reviews' 
  | 'reports';

export type CustomerTab = 'home' | 'catalog' | 'gallery' | 'reviews' | 'track';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  activeCustomerTab: CustomerTab;
  setActiveCustomerTab: (tab: CustomerTab) => void;
  
  services: ServiceItem[];
  orders: Order[];
  customers: Customer[];
  gallery: GalleryPhoto[];
  reviews: CustomerReview[];
  
  // Actions
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  uploadPaymentProof: (orderId: string, proofUrl: string) => void;
  
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (serviceId: string, updated: Partial<ServiceItem>) => void;
  
  addGalleryItem: (item: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  addReview: (review: Omit<CustomerReview, 'id' | 'createdAt' | 'isApproved'>) => void;
  toggleReviewApproval: (id: string) => void;
  
  // Modals & UI States
  selectedServiceForBooking: ServiceItem | null;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  showBookingModal: boolean;
  setShowBookingModal: (show: boolean) => void;
  showWorkflowModal: boolean;
  setShowWorkflowModal: (show: boolean) => void;
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  
  // Stats & Computation
  monthlyOrderCount: number;
  monthlyRevenue: number;
  weeklyEventsCount: number;
  averageRating: number;
  unitAvailability: {
    tenda: { total: number; booked: number; available: number; percentage: number };
    plafon: { total: number; booked: number; available: number; percentage: number };
    sound: { total: number; booked: number; available: number; percentage: number };
  };
  
  // Conflict checker
  checkAvailability: (category: ServiceCategory, eventDate: string) => { available: boolean; remaining: number };
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerTab>('home');
  
  // Persisted or mock initialized states
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('sewapro_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sewapro_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sewapro_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('sewapro_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('sewapro_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState<boolean>(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem('sewapro_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sewapro_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sewapro_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sewapro_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('sewapro_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add Order
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): string => {
    const nextNum = orders.length + 1;
    const newId = `ORD-${String(nextNum).padStart(3, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Also update or add customer
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === orderData.customerPhone || c.email === orderData.customerEmail);
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + orderData.totalPrice,
          lastOrderDate: orderData.eventDate
        } : c);
      } else {
        const newCust: Customer = {
          id: `CUST-${String(prev.length + 1).padStart(3, '0')}`,
          name: orderData.customerName,
          phone: orderData.customerPhone,
          email: orderData.customerEmail,
          address: orderData.eventLocation,
          totalOrders: 1,
          totalSpent: orderData.totalPrice,
          lastOrderDate: orderData.eventDate
        };
        return [newCust, ...prev];
      }
    });

    showToast(`Pesanan ${newId} berhasil dibuat!`);
    return newId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Status pesanan ${orderId} diubah menjadi "${status}"`);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let newStatus = o.status;
        if (paymentStatus === 'DP Terverifikasi' && o.status === 'Menunggu') {
          newStatus = 'Dikonfirmasi';
        }
        return { ...o, paymentStatus, status: newStatus };
      }
      return o;
    }));
    showToast(`Status pembayaran ${orderId}: ${paymentStatus}`);
  };

  const uploadPaymentProof = (orderId: string, proofUrl: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      paymentProofUrl: proofUrl,
      paymentStatus: 'Menunggu Verifikasi DP'
    } : o));
    showToast(`Bukti transfer ${orderId} berhasil diunggah! Menunggu verifikasi admin.`);
  };

  const addService = (newSrv: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    setServices(prev => [...prev, { ...newSrv, id }]);
    showToast('Layanan baru berhasil ditambahkan!');
  };

  const updateService = (serviceId: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...updated } : s));
    showToast('Layanan berhasil diperbarui');
  };

  const addGalleryItem = (item: Omit<GalleryPhoto, 'id'>) => {
    const id = `gal-${Date.now()}`;
    setGallery(prev => [{ ...item, id }, ...prev]);
    showToast('Foto dokumentasi berhasil dipublikasikan ke Galeri');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('Foto dokumentasi dihapus dari Galeri');
  };

  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'createdAt' | 'isApproved'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Baru saja',
      isApproved: true,
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Terima kasih! Ulasan & penilaian Anda berhasil dikirim.');
  };

  const toggleReviewApproval = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: !r.isApproved } : r));
    showToast('Status ulasan diperbarui');
  };

  // Availability calculation
  const checkAvailability = (category: ServiceCategory, eventDate: string) => {
    const totalMax = category === 'tenda' ? 10 : category === 'plafon' ? 8 : 10;
    
    // Count active orders for this date
    const bookedCount = orders.filter(o => {
      if (o.status === 'Dibatalkan') return false;
      const isOverlapping = o.eventDate <= eventDate && o.endDate >= eventDate;
      const hasCategory = o.items.some(it => it.category === category || it.category === 'paket');
      return isOverlapping && hasCategory;
    }).length;

    const remaining = Math.max(0, totalMax - bookedCount);
    return {
      available: remaining > 0,
      remaining
    };
  };

  // Dynamic statistics
  const monthlyOrderCount = orders.length;
  const monthlyRevenue = orders.reduce((sum, ord) => {
    if (ord.paymentStatus === 'Lunas') return sum + ord.totalPrice;
    if (ord.paymentStatus === 'DP Terverifikasi') return sum + ord.dpAmount;
    return sum;
  }, 0);

  const weeklyEventsCount = orders.filter(o => o.status === 'Dikonfirmasi' || o.status === 'Berlangsung').length;

  const validReviews = reviews.filter(r => r.isApproved);
  const averageRating = validReviews.length > 0
    ? Number((validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1))
    : 4.9;

  // Active units capacity calculation
  const tendaTotal = 10;
  const tendaBooked = orders.filter(o => o.status !== 'Dibatalkan' && o.status !== 'Selesai' && o.items.some(i => i.category === 'tenda' || i.category === 'paket')).length;
  
  const plafonTotal = 8;
  const plafonBooked = orders.filter(o => o.status !== 'Dibatalkan' && o.status !== 'Selesai' && o.items.some(i => i.category === 'plafon' || i.category === 'paket')).length;
  
  const soundTotal = 10;
  const soundBooked = orders.filter(o => o.status !== 'Dibatalkan' && o.status !== 'Selesai' && o.items.some(i => i.category === 'sound' || i.category === 'paket')).length;

  const unitAvailability = {
    tenda: {
      total: tendaTotal,
      booked: tendaBooked,
      available: Math.max(0, tendaTotal - tendaBooked),
      percentage: Math.min(100, Math.round(((tendaTotal - tendaBooked) / tendaTotal) * 100))
    },
    plafon: {
      total: plafonTotal,
      booked: plafonBooked,
      available: Math.max(0, plafonTotal - plafonBooked),
      percentage: Math.min(100, Math.round(((plafonTotal - plafonBooked) / plafonTotal) * 100))
    },
    sound: {
      total: soundTotal,
      booked: soundBooked,
      available: Math.max(0, soundTotal - soundBooked),
      percentage: Math.min(100, Math.round(((soundTotal - soundBooked) / soundTotal) * 100))
    }
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeAdminTab,
        setActiveAdminTab,
        activeCustomerTab,
        setActiveCustomerTab,
        services,
        orders,
        customers,
        gallery,
        reviews,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        uploadPaymentProof,
        addService,
        updateService,
        addGalleryItem,
        deleteGalleryItem,
        addReview,
        toggleReviewApproval,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        showBookingModal,
        setShowBookingModal,
        showWorkflowModal,
        setShowWorkflowModal,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        monthlyOrderCount,
        monthlyRevenue,
        weeklyEventsCount,
        averageRating,
        unitAvailability,
        checkAvailability,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
