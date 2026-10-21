import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Customer Components
import { HeroSection } from './components/customer/HeroSection';
import { CatalogSection } from './components/customer/CatalogSection';
import { GallerySection } from './components/customer/GallerySection';
import { ReviewSection } from './components/customer/ReviewSection';
import { BookingModal } from './components/customer/BookingModal';
import { OrderTrackingView } from './components/customer/OrderTrackingModal';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { DashboardView } from './components/admin/DashboardView';
import { CustomersView } from './components/admin/CustomersView';
import { CatalogManagerView } from './components/admin/CatalogManagerView';
import { OrdersManagerView } from './components/admin/OrdersManagerView';
import { ScheduleManagerView } from './components/admin/ScheduleManagerView';
import { PaymentsManagerView } from './components/admin/PaymentsManagerView';
import { GalleryManagerView } from './components/admin/GalleryManagerView';
import { ReviewsManagerView } from './components/admin/ReviewsManagerView';
import { ReportsView } from './components/admin/ReportsView';
import { NewOrderModal } from './components/admin/NewOrderModal';

// Global System Architecture Modal (Panel 4)
import { SystemWorkflowModal } from './components/SystemWorkflowModal';
import { CheckCircle2, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userRole, activeCustomerTab, activeAdminTab, toastMessage } = useApp();
  const [showAdminNewOrder, setShowAdminNewOrder] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <BookingModal />
      <NewOrderModal isOpen={showAdminNewOrder} onClose={() => setShowAdminNewOrder(false)} />
      <SystemWorkflowModal />

      {userRole === 'customer' ? (
        /* CUSTOMER VIEW PORTAL */
        <>
          <Navbar />
          
          <main className="flex-1">
            {activeCustomerTab === 'home' && (
              <>
                <HeroSection />
                <CatalogSection />
                <GallerySection />
                <ReviewSection />
              </>
            )}

            {activeCustomerTab === 'catalog' && (
              <div className="py-4">
                <CatalogSection />
              </div>
            )}

            {activeCustomerTab === 'gallery' && (
              <div className="py-4">
                <GallerySection />
              </div>
            )}

            {activeCustomerTab === 'reviews' && (
              <div className="py-4">
                <ReviewSection />
              </div>
            )}

            {activeCustomerTab === 'track' && (
              <OrderTrackingView />
            )}
          </main>

          <Footer />
        </>
      ) : (
        /* ADMIN DASHBOARD VIEW PORTAL */
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          <AdminSidebar onNewOrderClick={() => setShowAdminNewOrder(true)} />

          <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
            <AdminHeader onNewOrderClick={() => setShowAdminNewOrder(true)} />

            <main className="flex-1 overflow-y-auto">
              {activeAdminTab === 'dashboard' && (
                <DashboardView onNewOrderClick={() => setShowAdminNewOrder(true)} />
              )}
              {activeAdminTab === 'customers' && <CustomersView />}
              {activeAdminTab === 'catalog' && <CatalogManagerView />}
              {activeAdminTab === 'orders' && <OrdersManagerView />}
              {activeAdminTab === 'schedule' && <ScheduleManagerView />}
              {activeAdminTab === 'payments' && <PaymentsManagerView />}
              {activeAdminTab === 'gallery' && <GalleryManagerView />}
              {activeAdminTab === 'reviews' && <ReviewsManagerView />}
              {activeAdminTab === 'reports' && <ReportsView />}
            </main>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
