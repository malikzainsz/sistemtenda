import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Sparkles, Search, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    userRole,
    setUserRole,
    activeCustomerTab,
    setActiveCustomerTab,
    setShowWorkflowModal,
    setShowBookingModal,
    setActiveTrackingOrderId
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (userRole === 'admin') setUserRole('customer');
              setActiveCustomerTab('home');
            }}
            className="group text-left flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-amber-600 transition-colors">
              SP
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                SewaPro
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Quiet Typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              if (userRole === 'admin') setUserRole('customer');
              setActiveCustomerTab('home');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              userRole === 'customer' && activeCustomerTab === 'home'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Beranda
          </button>
          
          <button
            onClick={() => {
              if (userRole === 'admin') setUserRole('customer');
              setActiveCustomerTab('catalog');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              userRole === 'customer' && activeCustomerTab === 'catalog'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Katalog Layanan
          </button>

          <button
            onClick={() => {
              if (userRole === 'admin') setUserRole('customer');
              setActiveCustomerTab('gallery');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              userRole === 'customer' && activeCustomerTab === 'gallery'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Galeri Acara
          </button>

          <button
            onClick={() => {
              if (userRole === 'admin') setUserRole('customer');
              setActiveCustomerTab('reviews');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 ${
              userRole === 'customer' && activeCustomerTab === 'reviews'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Evaluasi Pelanggan
          </button>

          <button
            onClick={() => setShowWorkflowModal(true)}
            className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Peta Modul & Alur</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {userRole === 'customer' ? (
            <>
              <button
                onClick={() => {
                  setActiveCustomerTab('track');
                  setActiveTrackingOrderId('ORD-001');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Pesanan</span>
              </button>

              <button
                onClick={() => setUserRole('admin')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Masuk Admin</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                Admin Mode Aktif
              </span>
              <button
                onClick={() => setUserRole('customer')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Lihat Tampilan Web
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
