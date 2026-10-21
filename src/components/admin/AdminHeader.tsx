import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Layers, Calendar, UserCheck } from 'lucide-react';

export const AdminHeader: React.FC<{ onNewOrderClick: () => void }> = ({ onNewOrderClick }) => {
  const { activeAdminTab, setShowWorkflowModal } = useApp();

  const getTabTitle = () => {
    switch (activeAdminTab) {
      case 'dashboard': return 'Dashboard Admin';
      case 'customers': return 'Data Pelanggan';
      case 'catalog': return 'Katalog Layanan & Tarif';
      case 'orders': return 'Manajemen Pemesanan';
      case 'schedule': return 'Jadwal & Ketersediaan Unit';
      case 'payments': return 'Verifikasi Pembayaran & DP';
      case 'gallery': return 'Kelola Galeri Acara';
      case 'reviews': return 'Moderasi Evaluasi Pelanggan';
      case 'reports': return 'Laporan Omzet & Keuangan';
      default: return 'Dashboard Admin';
    }
  };

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Admin Portal</span>
          <span>/</span>
          <span className="font-semibold text-slate-800 capitalize">{activeAdminTab}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {getTabTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayStr}</span>
        </div>

        <button
          onClick={() => setShowWorkflowModal(true)}
          className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          title="Lihat Peta Modul & Alur Sistem"
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Peta Alur</span>
        </button>

        <button
          onClick={onNewOrderClick}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Pesanan Baru</span>
        </button>
      </div>
    </header>
  );
};
