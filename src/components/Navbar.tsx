import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Sparkles, Search, Layers, Menu, X, Calendar, Star, Image, Home } from 'lucide-react';

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'catalog' | 'gallery' | 'reviews' | 'track') => {
    if (userRole === 'admin') setUserRole('customer');
    setActiveCustomerTab(tab);
    setMobileMenuOpen(false);
    
    // If switching to a section that exists on home, scroll to it smoothly
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const elem = document.getElementById(`${tab}-section`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left flex items-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm group-hover:bg-amber-600 transition-colors">
              SP
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                SewaPro
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 cursor-pointer ${
              userRole === 'customer' && activeCustomerTab === 'home'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Beranda
          </button>
          
          <button
            onClick={() => handleNavClick('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 cursor-pointer ${
              userRole === 'customer' && activeCustomerTab === 'catalog'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Katalog Layanan
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 cursor-pointer ${
              userRole === 'customer' && activeCustomerTab === 'gallery'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Galeri Acara
          </button>

          <button
            onClick={() => handleNavClick('reviews')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 pb-0.5 cursor-pointer ${
              userRole === 'customer' && activeCustomerTab === 'reviews'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-500'
                : 'text-slate-600'
            }`}
          >
            Evaluasi Pelanggan
          </button>

          <button
            onClick={() => {
              setShowWorkflowModal(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Peta Modul & Alur</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {userRole === 'customer' ? (
            <>
              <button
                onClick={() => handleNavClick('track')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Pesanan</span>
              </button>

              <button
                onClick={() => {
                  setUserRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
                onClick={() => {
                  setUserRole('customer');
                  setMobileMenuOpen(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Lihat Tampilan Web
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeCustomerTab === 'home' && userRole === 'customer'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => handleNavClick('catalog')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeCustomerTab === 'catalog' && userRole === 'customer'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Katalog Layanan & Sewa</span>
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeCustomerTab === 'gallery' && userRole === 'customer'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Image className="w-4 h-4 text-amber-600" />
            <span>Galeri Acara & Portofolio</span>
          </button>

          <button
            onClick={() => handleNavClick('reviews')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeCustomerTab === 'reviews' && userRole === 'customer'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Star className="w-4 h-4 text-amber-600" />
            <span>Evaluasi & Testimoni Pelanggan</span>
          </button>

          <button
            onClick={() => handleNavClick('track')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeCustomerTab === 'track' && userRole === 'customer'
                ? 'bg-amber-50 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Cek Status Pesanan & Upload Struk</span>
          </button>

          <button
            onClick={() => {
              setShowWorkflowModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 text-left transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Peta Modul & Alur Sistem (Panel 4)</span>
          </button>
        </div>
      )}
    </header>
  );
};
