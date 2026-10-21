import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    userRole,
    setUserRole,
    setActiveCustomerTab,
    setShowWorkflowModal,
    services,
    setSelectedServiceForBooking
  } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                SP
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SewaPro</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Sistem Informasi Manajemen Sewa Tenda Acara, Dekorasi Plafon Draping VIP & Sound System Profesional.
            </p>
            <div className="pt-2 text-slate-400">
              Melayani wilayah Jabodetabek, Bandung & sekitarnya.
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Layanan Kami</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'admin') setUserRole('customer');
                    setActiveCustomerTab('catalog');
                    const tendaSrv = services.find(s => s.category === 'tenda');
                    if (tendaSrv) setSelectedServiceForBooking(tendaSrv);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Sewa Tenda Kanopi & Semi-Roder
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'admin') setUserRole('customer');
                    setActiveCustomerTab('catalog');
                    const plafonSrv = services.find(s => s.category === 'plafon');
                    if (plafonSrv) setSelectedServiceForBooking(plafonSrv);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Dekorasi Plafon Pelaminan VIP
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'admin') setUserRole('customer');
                    setActiveCustomerTab('catalog');
                    const soundSrv = services.find(s => s.category === 'sound');
                    if (soundSrv) setSelectedServiceForBooking(soundSrv);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Sound System & Line Array Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (userRole === 'admin') setUserRole('customer');
                    setActiveCustomerTab('catalog');
                    const paketSrv = services.find(s => s.category === 'paket');
                    if (paketSrv) setSelectedServiceForBooking(paketSrv);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Paket Komplit Pernikahan & Pesta
                </button>
              </li>
            </ul>
          </div>

          {/* Navigasi Modul */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Fitur Sistem</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveCustomerTab('gallery')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Galeri Dokumentasi Acara
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCustomerTab('reviews')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ulasan & Evaluasi Pelanggan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCustomerTab('track')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Lacak Pesanan & Upload Struk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowWorkflowModal(true)}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  Peta Modul & Alur Sistem (Panel 4)
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak & Hotline */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Kontak & Workshop</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Jl. Raya Condet No. 45, Kramat Jati, Jakarta Timur</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono">WhatsApp: 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>kontak@sewapro-event.id</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setUserRole('admin')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                >
                  Buka Portal Admin Manajemen →
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            © 2026 SewaPro. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Sistem Reservasi Sewa Tenda, Plafon & Sound</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
