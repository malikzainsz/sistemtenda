import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, ArrowRight, User, Shield, Layers, Calendar, DollarSign, Image, Star, BarChart3, Clock } from 'lucide-react';

export const SystemWorkflowModal: React.FC = () => {
  const {
    showWorkflowModal,
    setShowWorkflowModal,
    setUserRole,
    setActiveAdminTab,
    setActiveCustomerTab,
    setShowBookingModal
  } = useApp();

  if (!showWorkflowModal) return null;

  const modules = [
    {
      num: '1',
      title: 'Autentikasi & Akun',
      icon: User,
      desc: 'Manajemen login, registrasi, peran multi-level Admin operasional dan Pelanggan publik.',
      action: () => {
        setShowWorkflowModal(false);
      }
    },
    {
      num: '2',
      title: 'Katalog Layanan',
      icon: Layers,
      desc: 'Tenda acara, dekorasi plafon draping VIP, sound system: spesifikasi, foto katalog, tarif sewa harian & stok.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('customer');
        setActiveCustomerTab('catalog');
      }
    },
    {
      num: '3',
      title: 'Pemesanan',
      icon: Clock,
      desc: 'Form reservasi sewa terintegrasi, cek ketersediaan real-time, kalkulator total otomatis, diskon paket & invoice.',
      action: () => {
        setShowWorkflowModal(false);
        setShowBookingModal(true);
      }
    },
    {
      num: '4',
      title: 'Jadwal & Anti-Bentrok',
      icon: Calendar,
      desc: 'Kalender acara visual, timeline kru pemasangan, dan algoritma pencegahan jadwal bentrok overbooking unit.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('admin');
        setActiveAdminTab('schedule');
      }
    },
    {
      num: '5',
      title: 'Pembayaran',
      icon: DollarSign,
      desc: 'Pengaturan DP 50%, pelunasan H-1, unggah bukti transfer m-Banking/QRIS, dan verifikasi admin 1-klik.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('admin');
        setActiveAdminTab('payments');
      }
    },
    {
      num: '6',
      title: 'Galeri Acara',
      icon: Image,
      desc: 'Dokumentasi foto portfolio acara per kategori layanan (tenda, plafon, sound, all-in) dengan lightbox detail.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('customer');
        setActiveCustomerTab('gallery');
      }
    },
    {
      num: '7',
      title: 'Evaluasi & Testimoni',
      icon: Star,
      desc: 'Form review bintang 1-5 dan testimoni kepuasan pelanggan setelah acara selesai untuk kredibilitas.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('customer');
        setActiveCustomerTab('reviews');
      }
    },
    {
      num: '8',
      title: 'Laporan & Keuangan',
      icon: BarChart3,
      desc: 'Rekapitulasi omzet bulanan, total pesanan, grafik unit terlaris, dan export/print rekap pembukuan bisnis.',
      action: () => {
        setShowWorkflowModal(false);
        setUserRole('admin');
        setActiveAdminTab('reports');
      }
    }
  ];

  const workflowSteps = [
    { step: 1, title: 'Pelanggan pilih layanan', actor: 'Pelanggan' },
    { step: 2, title: 'Cek jadwal & unit', actor: 'Sistem' },
    { step: 3, title: 'Ajukan pesanan', actor: 'Pelanggan' },
    { step: 4, title: 'Admin konfirmasi', actor: 'Admin' },
    { step: 5, title: 'Bayar DP (50%)', actor: 'Pelanggan' },
    { step: 6, title: 'Acara berlangsung', actor: 'Operasional' },
    { step: 7, title: 'Pelunasan biaya', actor: 'Pelanggan' },
    { step: 8, title: 'Pelanggan kirim evaluasi', actor: 'Pelanggan' },
    { step: 9, title: 'Admin tampilkan di galeri', actor: 'Admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Arsitektur & Diagram Alur (Panel 4)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Peta Modul & Alur Sistem (Web)
            </h3>
          </div>
          <button
            onClick={() => setShowWorkflowModal(false)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* Peran Sistem: Pelanggan vs Admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pelanggan Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-base">
                <User className="w-4 h-4 text-amber-600" />
                <h4>Peran: Pelanggan (Customer)</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Lihat katalog layanan, lihat galeri acara, daftar / masuk, buat formulir pesanan sewa, cek ketersediaan otomatis, unggah bukti bayar DP, pantau status, dan kirim evaluasi ulasan.
              </p>
              <button
                onClick={() => {
                  setShowWorkflowModal(false);
                  setUserRole('customer');
                }}
                className="mt-3 text-xs font-bold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
              >
                <span>Buka Tampilan Pelanggan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Admin Box */}
            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
                <Shield className="w-4 h-4 text-amber-600" />
                <h4>Peran: Admin (Manajemen)</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Kelola data pelanggan & inventaris unit, konfirmasi pesanan masuk, atur kalender jadwal anti-bentrok, verifikasi bukti transfer DP, kelola galeri dokumentasi, moderasi evaluasi, dan pantau laporan omzet.
              </p>
              <button
                onClick={() => {
                  setShowWorkflowModal(false);
                  setUserRole('admin');
                }}
                className="mt-3 text-xs font-bold text-slate-900 hover:text-slate-800 inline-flex items-center gap-1"
              >
                <span>Buka Dashboard Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* 8 Core Modules Grid */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              8 Modul Fungsional Terintegrasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((m) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.num}
                    onClick={m.action}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          0{m.num}
                        </span>
                        <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                        {m.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 group-hover:text-slate-700 flex items-center justify-between">
                      <span>Buka Modul</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alur Utama Horizontal Interactive Flow */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
              Alur Utama Operasional Sistem
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              Siklus alur dari pemilihan layanan hingga pasca-acara dan dokumentasi galeri.
            </p>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2 min-w-[800px]">
                {workflowSteps.map((ws, i) => (
                  <React.Fragment key={ws.step}>
                    <div className="flex-1 bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 text-center">
                      <div className="text-[10px] font-mono text-amber-400 mb-0.5">
                        Langkah {ws.step}
                      </div>
                      <div className="text-xs font-bold text-white mb-1 leading-snug">
                        {ws.title}
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        {ws.actor}
                      </span>
                    </div>

                    {i < workflowSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowWorkflowModal(false)}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Tutup Peta Sistem
          </button>
        </div>

      </div>
    </div>
  );
};
